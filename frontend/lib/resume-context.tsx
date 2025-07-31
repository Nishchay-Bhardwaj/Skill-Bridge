"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ContactInfo {
  name: string
  email: string
  phone: string
}

interface ResumeData {
  contactInfo: ContactInfo
  education: string[]
  skills: string[]
  workExperience: string[]
  rawText: string
}

interface ResumeContextType {
  resumeData: ResumeData | null
  setResumeData: (data: ResumeData | null) => void
  isResumeUploaded: boolean
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  const value = {
    resumeData,
    setResumeData,
    isResumeUploaded: resumeData !== null,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}
