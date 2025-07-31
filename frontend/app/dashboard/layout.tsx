"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Layers,
  FileText,
  BarChart2,
  List,
  LineChart,
  User,
  LogOut,
  LucideGitCompare,
  GitCompareArrowsIcon,
  Settings,
  Star,
  Menu,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activePath, setActivePath] = useState("")

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login?reason=dashboard")
    }

    // Set active path based on current URL
    setActivePath(window.location.pathname)
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  const isActive = (path: string) => {
    return activePath === path
  }

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: Layers },
    {
      path: "/dashboard/resume-builder",
      label: "Resume Builder",
      icon: FileText,
    },
    { path: "/dashboard/skill-analysis", label: "Skill Analysis", icon: BarChart2 },
    { path: "/dashboard/learning", label: "Learning Roadmap", icon: List },
    { path: "/dashboard/trends", label: "Skill Trends", icon: LineChart },
    { path:"/dashboard/Compare",label:"Resume Compare",icon:GitCompareArrowsIcon}
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200/50 bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <header className="sticky top-0 z-50 w-full border-b bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transform -translate-x-1 translate-y-1"></div>
                <Star className="h-5 w-5 text-primary relative" />
              </div>
              <span>SkillBridge</span>
            </div>
            <Button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden ml-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-white/80 backdrop-blur-xl border-white/50">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-200/50">
                  <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transform -translate-x-1 translate-y-1"></div>
                      <Star className="h-5 w-5 text-primary relative" />
                    </div>
                    <span>SkillBridge</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                          isActive(item.path)
                            ? "bg-primary/10 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${isActive(item.path) ? "text-primary" : ""}`} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="p-4 border-t border-slate-200/50">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-primary/10 transition-all duration-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Replace the user dropdown menu section with this improved implementation */}
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-primary/10"
                onClick={() => {
                  const dropdown = document.getElementById("user-dropdown")
                  if (dropdown) {
                    dropdown.classList.toggle("hidden")
                  }
                }}
              >
                <User className="h-5 w-5 text-primary" />
              </Button>

              <div
                id="user-dropdown"
                className="hidden absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                  </div>

                  <Link href="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-primary/10">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>

                  <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-primary/10">
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>

                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/10"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/50 p-4 space-y-4 bg-white/40 backdrop-blur-md">
          <div className="px-2 py-2 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Dashboard</h2>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-8 w-8 p-0 rounded-full"
                onClick={() => {
                  // This would toggle sidebar on smaller screens
                }}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 -mr-1">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 group ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? "text-primary" : ""}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-primary/10 transition-all duration-300"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white/70 backdrop-blur-xl border-t border-slate-200/50">
          <div className="grid h-full grid-cols-6">
            <Button
              onClick={handleBackToHome}
              className="flex flex-col items-center justify-center transition-colors text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Button>
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center transition-colors ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label.split(" ")[0]}</span>
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 relative z-10">{children}</main>
      </div>
    </div>
  )
}

