"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  name: string
  email: string
} | null

interface AuthContextType {
  user: User
  login: (user: User) => void
  userEmail: string | null
  logout: () => void
  isAuthenticated: boolean
  checkUserExists: (email: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("skillbridge_user")
        const storedEmail = localStorage.getItem("userEmail")
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setUserEmail(parsedUser?.email || storedEmail)
        } else if (storedEmail) {
          setUserEmail(storedEmail)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUser()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    
    try {
      // Store full user object
      localStorage.setItem("skillbridge_user", JSON.stringify(userData))
      
      // Store email separately for easy access
      if (userData?.email) {
        localStorage.setItem("userEmail", userData.email)
        setUserEmail(userData.email)
      }

      // Add to registered users if new
      const registeredUsers = JSON.parse(localStorage.getItem("skillbridge_users") || "[]")
      const exists = registeredUsers.some((u: any) => u.email === userData?.email)
      
      if (!exists && userData) {
        registeredUsers.push(userData)
        localStorage.setItem("skillbridge_users", JSON.stringify(registeredUsers))
      }
    } catch (error) {
      console.error("Error storing user data:", error)
    }
  }

  const logout = () => {
    setUser(null)
    setUserEmail(null)
    try {
      localStorage.removeItem("skillbridge_user")
      localStorage.removeItem("userEmail")
    } catch (error) {
      console.error("Error clearing user data:", error)
    }
  }

  const checkUserExists = (email: string): boolean => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem("skillbridge_users") || "[]")
      return registeredUsers.some((user: any) => user.email === email)
    } catch (error) {
      console.error("Error checking user existence:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        userEmail,
        logout,
        isAuthenticated: !!user,
        checkUserExists,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}