import type React from "react"
import "@/styles/globals.css"
import { Inter, Playfair_Display, Open_Sans } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { ResumeProvider } from "@/lib/resume-context"
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./themeContext";

// Define the primary font - Playfair Display for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

// Define the secondary font - Open Sans for body text
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

// Keep Inter as a system font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SkillBridge - Smarter Skills. Stronger Careers.",
  description:
    "Build your perfect resume, identify skill gaps, and accelerate your career growth with AI-powered insights and personalized learning roadmaps.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (


    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${openSans.variable} font-sans`}>
      <ThemeProvider>
        <AuthProvider>
          <ResumeProvider>
            {children}
            <Toaster />
          </ResumeProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
