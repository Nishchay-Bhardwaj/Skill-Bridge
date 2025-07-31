"use client"

import {
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle,
  FileText,
  LucideLineChart,
  Shield,
  Star,
  Upload,
  Zap,
  User,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react" // Added useEffect

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HeroImage from "@/components/hero-image"
import TestimonialCard from "@/components/testimonial-card"

import { motion } from "framer-motion";

import FeatureHighlight from "@/components/feature-highlight"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import ThemeToggle from "./ThemeTog"

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [scrollY, setScrollY] = useState(0) // Added scroll state
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user, logout } = useAuth()

  // Added scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleUploadResume = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login or sign up to upload your resume.",
        variant: "destructive",
      })
      router.push("/login?reason=upload")
      return
    }

    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been uploaded and is being analyzed.",
      })
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }, 2000)
  }

  const handleDashboardAccess = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login or sign up to access the dashboard.",
        variant: "destructive",
      })
      router.push("/login?reason=dashboard")
      return
    }
    router.push("/dashboard")
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  // Calculate blur intensity based on scroll position
  const blurIntensity = Math.min(scrollY / 20, 10) // Max blur of 10px
  const bgOpacity = Math.min(scrollY / 100, 0.8) // Max opacity of 0.8

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-slate-200/50 bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-100/30 to-transparent pointer-events-none z-0"></div>

      {/* Header with dynamic blur effect */}
      <motion.header 
        className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
        style={{
          backdropFilter: `blur(${blurIntensity}px)`,
          backgroundColor: `rgba(255, 255, 255, ${0.8 - bgOpacity/2})`,
          boxShadow: scrollY > 10 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' : 'none',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:text-indigo-600 transition-colors">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-indigo-100 blur-md transform -translate-x-1 translate-y-1"></div>
              <Star className="h-5 w-5 text-indigo-600 relative" />
            </div>
            {/* <ThemeToggle/> */}
            <span>SkillBridge</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link
              href="/#features"
              className="text-sm font-medium hidden sm:block text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hidden sm:block text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              How It Works
            </Link>

            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:flex items-center gap-1 hover:bg-indigo-600/10 hover:text-indigo-700 hover:border-indigo-300 transition-all hover:shadow-sm"
                  onClick={handleDashboardAccess}
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-indigo-100 hover:bg-indigo-200/50 transition-colors"
                    onClick={() => {
                      const dropdown = document.getElementById("home-user-dropdown")
                      dropdown?.classList.toggle("hidden")
                    }}
                  >
                    <User className="h-5 w-5 text-indigo-600" />
                  </Button>

                  <div
                    id="home-user-dropdown"
                    className="hidden absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-slate-200/80 z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-medium text-slate-800">{user?.name || "User"}</p>
                        <p className="text-xs text-slate-500">{user?.email || "user@example.com"}</p>
                      </div>

                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <Star className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>

                      <div className="border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:flex items-center gap-1 hover:bg-indigo-600/10 hover:text-indigo-700 hover:border-indigo-300 transition-all hover:shadow-sm"
                  onClick={handleDashboardAccess}
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/login">
                  <Button className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 transition-all">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login" className="sm:hidden">
                  <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </motion.header>
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
 
    <section className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center bg-black">
      {/* Blurred Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/main.jpeg"
          alt="Career Growth"
          fill
          className="object-cover blur-sm brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Text Overlapping Image by 30% */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-3xl px-6 lg:px-12"
      >
        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-white mb-6">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Smarter Skills,
          </span>{" "}
          Stronger Careers.
        </h1>
        <p className="text-lg text-slate-100 mb-8">
          Build your perfect resume, identify skill gaps, and accelerate your career with AI-powered insights and personalized learning roadmaps.
        </p>
        <div className="flex gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition">
            Get Started
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg shadow transition backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </motion.div>
    </section>
  


        {/* Quick Start - Resume Upload Section */}
        <section className="container py-12 md:py-16 relative">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-indigo-50 border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-500">
            <div className="absolute inset-0 bg-grid-indigo-100/50 bg-[length:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
            <div className="relative p-8 md:p-10">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Get Started in Seconds</h2>
                <p className="text-slate-600">
                  Upload your resume and instantly see how your skills match with market demands
                </p>

                <div className="mt-8 border-2 border-dashed border-indigo-200 rounded-xl p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm transition-all hover:border-indigo-300">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
                      <Upload className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-800">Drag & drop your resume</h3>
                    <p className="mt-1 text-sm text-slate-500">Supported formats: PDF, DOCX, TXT</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
                      <Button
                        size="lg"
                        className="relative gap-2 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-indigo-500/20 transition-all"
                        onClick={handleUploadResume}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Uploading...
                          </>
                        ) : (
                          "Browse Files"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                        onClick={handleDashboardAccess}
                      >
                        Skip to Dashboard
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700">
                    <Shield className="h-4 w-4" />
                    <span>Your data is secure</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700">
                    <Zap className="h-4 w-4" />
                    <span>Instant analysis</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Free to start</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white"></div>
          <div className="container space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-800">Powerful Features</h2>
              <p className="text-slate-600 max-w-[700px] mx-auto">
                Our intelligent career optimization tool empowers professionals to enhance their profiles, stay
                relevant, and secure better opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "AI Resume Builder",
                  description:
                    "Create professional resumes with AI guidance tailored to your preferences and industry standards.",
                },
                {
                  icon: Upload,
                  title: "Resume Upload & Analysis",
                  description:
                    "Analyze existing resumes for improvements and optimization with our AI-powered toolkit.",
                },
                {
                  icon: BarChart2,
                  title: "Skill Gap Detection",
                  description:
                    "Identify missing skills in your specific domain using AI by comparing against industry standards.",
                },
                {
                  icon: BookOpen,
                  title: "Personalized Learning",
                  description: "Get AI-curated courses, projects, and resources based on your specific skill gaps.",
                },
                {
                  icon: CheckCircle,
                  title: "ATS Score Checker",
                  description:
                    "Evaluate resume compatibility with Applicant Tracking Systems and optimize accordingly.",
                },
                {
                  icon: LucideLineChart,
                  title: "Real-Time Skill Trends",
                  description: "Track in-demand skills and industry requirements to stay ahead of the competition.",
                },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group border border-slate-200/80 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardHeader>
                      <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-indigo-200/50 transition-colors">
                        <feature.icon className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                      </div>
                      <CardTitle className="text-slate-800">{feature.title}</CardTitle>
                      <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                View All Features
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="how-it-works" className="container py-16 md:py-24 space-y-20 relative">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>

          <FeatureHighlight
            title="Build Perfect Resumes"
            description="Our AI-powered resume builder creates professional, ATS-friendly resumes tailored to your career goals. Choose from multiple templates and customize to your preferences."
            imageSrc="/resume_temp.jpg"
            imageAlt="AI Resume Builder"
            reverse={false}
          />

          <FeatureHighlight
            title="Identify & Bridge Skill Gaps"
            description="Discover the skills you need to advance your career with our detailed gap analysis. Compare your skills against industry benchmarks and get a visual heatmap of strengths and weaknesses."
            imageSrc="/skill_gap.png"
            imageAlt="Skill Gap Analysis"
            reverse={true}
          />

          <FeatureHighlight
            title="Personalized Learning Roadmap"
            description="Get customized recommendations for courses, projects, and certifications that will help you fill skill gaps and advance your career. Track your progress and stay motivated."
            imageSrc="/roadmap.jpeg"
            imageAlt="Learning Roadmap"
            reverse={false}
          />
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-indigo-50/30">
          <div className="container space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-800">What Our Users Say</h2>
              <p className="text-slate-600 max-w-[700px] mx-auto">
                Join thousands of professionals who have transformed their careers with SkillBridge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TestimonialCard
                quote="SkillBridge helped me identify critical skill gaps and land my dream job in tech. The personalized learning roadmap was a game-changer!"
                author="Sarah Johnson"
                role="Software Engineer"
                avatar="/avatars/sarah.jpg"
              />

              <TestimonialCard
                quote="The resume comparison feature helped me optimize my CV for different roles. I saw an immediate increase in interview callbacks!"
                author="Michael Chen"
                role="Marketing Specialist"
                avatar="/avatars/michael.jpg"
              />

              <TestimonialCard
                quote="As a career switcher, I didn't know which skills to focus on. SkillBridge provided clear guidance and helped me transition to data science."
                author="Emma Rodriguez"
                role="Data Scientist"
                avatar="/avatars/emma.jpg"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 md:py-24 relative">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-xl">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px] opacity-10"></div>
            <div className="relative p-8 md:p-12 lg:p-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Accelerate Your Career?</h2>
              <p className="text-lg text-indigo-100 max-w-[600px] mx-auto">
                Join SkillBridge today and transform your resume, skills, and career prospects with our AI-powered
                platform.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:shadow-white/20 transition-all hover:scale-105"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 md:py-12 bg-white/80 backdrop-blur-md relative z-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-100 blur-sm transform -translate-x-1 translate-y-1"></div>
                <Star className="h-5 w-5 text-indigo-600 relative" />
              </div>
              <span>SkillBridge</span>
            </div>
            <span className="text-sm text-slate-500">© 2024</span>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}