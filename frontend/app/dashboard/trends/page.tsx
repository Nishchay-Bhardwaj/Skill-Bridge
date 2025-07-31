"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft,
  TrendingUp,
  Download,
  ExternalLink,
  BookOpen,
  Sparkles,
  BarChart3,
  Brain,
  Zap,
  Clock,
  RefreshCw,
  CheckCircle,
  Shield,
  Database,
  PenTool,
  Globe,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useSkillTrends } from "./hooks/use-skill-trends"

// Update the AnimatedCard component to have more dynamic animations
const AnimatedCard = ({ children, index = 0, direction = "up" }) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const getInitialAnimation = () => {
    switch (direction) {
      case "left":
        return { x: -50, opacity: 0 }
      case "right":
        return { x: 50, opacity: 0 }
      case "up":
      default:
        return { y: 50, opacity: 0 }
    }
  }

  const getFinalAnimation = () => {
    switch (direction) {
      case "left":
      case "right":
        return { x: 0, opacity: 1 }
      case "up":
      default:
        return { y: 0, opacity: 1 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialAnimation()}
      animate={isInView ? getFinalAnimation() : getInitialAnimation()}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="h-full"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  )
}

export default function SkillTrendsPage() {
  const [activeTab, setActiveTab] = useState("high-income")
  const { toast } = useToast()

  // Fetch real-time skill data from our API
  const { data, loading, error, lastUpdated, dataSource, refetch } = useSkillTrends()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading skill trends",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "The skill trends report has been downloaded successfully.",
    })
  }

  const handleRefreshData = async () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest skill trends ",
    })

    await refetch()

    toast({
      title: "Data refreshed",
      description: "The skill trends data has been updated.",
      variant: "success",
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Very High":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getGrowthIndicator = (growth: string) => {
    const percentage = Number.parseInt(growth.replace("%", "").trim())
    if (isNaN(percentage)) return 1

    if (percentage > 30) return 3
    if (percentage > 15) return 2
    return 1
  }

  // Map skill names to icons
  const getSkillIcon = (skillName: string) => {
    const skillLower = skillName.toLowerCase()

    if (skillLower.includes("software") || skillLower.includes("development") || skillLower.includes("programming")) {
      return <Zap className="h-5 w-5" />
    }

    if (skillLower.includes("data") || skillLower.includes("analysis")) {
      return <BarChart3 className="h-5 w-5" />
    }

    if (skillLower.includes("machine learning") || skillLower.includes("ai") || skillLower.includes("artificial")) {
      return <Brain className="h-5 w-5" />
    }

    if (skillLower.includes("cloud")) {
      return <Database className="h-5 w-5" />
    }

    if (skillLower.includes("cyber") || skillLower.includes("security")) {
      return <Shield className="h-5 w-5" />
    }

    if (skillLower.includes("design")) {
      return <PenTool className="h-5 w-5" />
    }

    if (skillLower.includes("marketing")) {
      return <Globe className="h-5 w-5" />
    }

    if (skillLower.includes("project") || skillLower.includes("management")) {
      return <CheckCircle className="h-5 w-5" />
    }

    // Default icon
    return <TrendingUp className="h-5 w-5" />
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
          <div className="container flex h-16 items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Skill Trends</h2>
            <p className="text-muted-foreground">Fetching the latest data from Coursera...</p>
          </div>
        </main>
      </div>
    )
  }

  // Prepare the skill data for display with icons
  const highIncomeSkills =
    data?.skills.map((skill) => ({
      ...skill,
      icon: getSkillIcon(skill.name),
    })) || []

  const emergingTechnologies = data?.emergingTechnologies || []

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white hover:bg-blue-50 transition-colors duration-300 font-secondary"
              onClick={handleRefreshData}
            >
              <RefreshCw className="h-4 w-4" /> Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white hover:bg-blue-50 transition-colors duration-300 font-secondary"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4" /> Download Report
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-primary"
            >
              {data?.articleTitle || "Skill Trends 2025"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-slate-600 font-secondary"
            >
              Explore the latest trends in high-demand skills and stay ahead of the curve in your career journey
            </motion.p>
            {lastUpdated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm text-blue-600 mt-2 font-secondary"
              >
                {/* Last updated: {new Date(lastUpdated).toLocaleString()}
                {dataSource && <span className="ml-2 text-xs text-slate-500">(Data source: {dataSource})</span>} */}
              </motion.div>
            )}
          </div>
          {/* Trending Skills List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100/50 shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 font-primary">Top Trending Skills</h3>
              <ol className="list-decimal pl-0 md:pl-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                  {highIncomeSkills
                    .sort((a, b) => getGrowthIndicator(b.growth) - getGrowthIndicator(a.growth))
                    .slice(0, 9)
                    .map((skill, index) => (
                      <li key={index} className="flex items-center gap-3 group ml-8 pl-2">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md"
                          style={{ background: skill.bgGradient || "linear-gradient(to right, #3b82f6, #4f46e5)" }}
                        >
                          <div className="text-white">{skill.icon}</div>
                        </div>
                        <div className="flex-1">
                          <a
                            href={`https://www.coursera.org/search?query=${encodeURIComponent(skill.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-800 hover:text-primary transition-colors duration-300"
                          >
                            {skill.name}
                          </a>
                          <div className="flex items-center text-xs text-slate-500">
                            <span className="mr-2">Growth: {skill.growth}</span>
                            <div className="flex">
                              {Array(getGrowthIndicator(skill.growth))
                                .fill(0)
                                .map((_, i) => (
                                  <TrendingUp key={i} className="h-3 w-3 text-green-500" />
                                ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </div>
              </ol>
            </div>
          </motion.div>

          {/* Skill Trends Overview - Creative Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-16"
          >

    <div className="flex justify-center items-center p-6">
      <a href="">
        <img
          src="/img1.png"
          alt="Trend icon"
          className="w-28 h-28 rounded-full p-6 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-xl hover:scale-110 hover:shadow-2xl transition-transform duration-300"
        />
      </a>
    </div>



            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 font-primary">Top In-Demand Skills</h2>
              <p className="text-slate-600 font-secondary">Based on growth rate and market demand</p>
            </div>
            
        
          
            
              {/* Background elements */}
              {/* <div className="absolute top-0 left-0 w-full h-full">
               
                <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
              </div> */}

              {/* Skill bubbles */}
              {highIncomeSkills
                .sort((a, b) => getGrowthIndicator(b.growth) - getGrowthIndicator(a.growth))
                .slice(0, 8)
                .map((skill, index) => {
                  // Calculate positions in a circular pattern
                  const angle = (index / 8) * Math.PI * 2
                  const radius = 120 + (index % 3) * 30
                  const x = 50 + Math.cos(angle) * radius
                  const y = 50 + Math.sin(angle) * radius
                  const size = getGrowthIndicator(skill.growth) * 25 + 120 // Significantly increased size

                  return (
                    <motion.div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        zIndex: 10 - index,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2 + index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: 1.1,
                        zIndex: 20,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          background: skill.bgGradient || "linear-gradient(to right, #3b82f6, #4f46e5)",
                        }}
                        onClick={() =>
                          window.open(
                            `https://www.coursera.org/search?query=${encodeURIComponent(skill.name)}`,
                            "_blank",
                          )
                        }
                      >
                        <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full">
                          <div className="text-white mb-2 bg-white/20 p-2 rounded-full">{skill.icon}</div>
                          <h3 className="text-white font-bold text-base md:text-lg mb-1 max-w-full px-2 break-words">
                            {skill.name}
                          </h3>
                          <div className="flex mt-1">
                            {Array(getGrowthIndicator(skill.growth))
                              .fill(0)
                              .map((_, i) => (
                                <TrendingUp key={i} className="h-3 w-3 text-white/80" />
                              ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

              {/* Central element */}
              {/* <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              > */}
                {/* <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div> */}
               
              {/* </motion.div> */}
            

            <div className="mt-6 text-center">
              <a
                href="https://www.coursera.org/articles/high-income-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                {/* Source: Coursera - High Income Skills to Learn in 2025
                <ExternalLink className="h-3 w-3" /> */}
              </a>
            </div>
          </motion.div>

          <Tabs defaultValue="high-income" className="space-y-6 mt-12" onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[600px] grid-cols-2 mx-auto bg-gradient-to-r from-blue-100/50 to-indigo-100/50 p-1">
              <TabsTrigger
                value="high-income"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 font-primary"
              >
                High-Income Skills
              </TabsTrigger>
              <TabsTrigger
                value="emerging"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 font-primary"
              >
                Emerging Technologies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="high-income" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highIncomeSkills.map((skill, index) => (
                  <AnimatedCard key={index} index={index % 3}>
                    <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-500 border-slate-200 relative bg-white/80 backdrop-blur-sm">
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-15 transition-opacity duration-500 -z-10"
                        style={{ background: skill.bgGradient }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 w-full h-1 opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:h-1.5"
                        style={{ background: skill.bgGradient }}
                      ></div>
                      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/5 to-indigo-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                      <CardHeader className="pb-1 pt-4 px-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base flex items-center gap-2 font-primary">
                            <div
                              className="p-1.5 rounded-md text-white shadow-sm transform group-hover:scale-110 transition-all duration-300"
                              style={{ background: skill.bgGradient }}
                            >
                              {skill.icon}
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-blue-700 group-hover:to-indigo-800 transition-all duration-500">
                              {skill.name}
                            </span>
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`${getDifficultyColor(skill.difficulty)} transition-all duration-300 group-hover:scale-110 shadow-sm text-xs`}
                          >
                            {skill.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 font-secondary text-sm leading-relaxed pl-2 border-l-2 border-slate-200 group-hover:border-blue-400 transition-all duration-300">
                          {skill.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-1 px-4 pb-4">
                        <div className="grid grid-cols-2 gap-2 text-xs font-secondary">
                          <div className="p-2 rounded-md bg-slate-50/80 group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100">
                            <p className="text-muted-foreground text-xs mb-0.5 uppercase tracking-wider">Salary</p>
                            <p className="font-medium text-blue-700">{skill.salary}</p>
                          </div>
                          <div className="p-2 rounded-md bg-slate-50/80 group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100">
                            <p className="text-muted-foreground text-xs mb-0.5 uppercase tracking-wider">Growth</p>
                            <p className="font-medium text-green-600">{skill.growth}</p>
                          </div>
                          <div className="p-2 rounded-md bg-slate-50/80 group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100 col-span-2">
                            <p className="text-muted-foreground text-xs mb-0.5 uppercase tracking-wider">
                              Time to Learn
                            </p>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3 text-blue-500" />
                              {skill.timeToLearn}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50/80 p-2.5 rounded-md group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100">
                          <p className="text-xs font-medium mb-1.5 font-secondary flex items-center gap-1.5">
                            <span className="p-0.5 rounded-full bg-blue-100">
                              <BookOpen className="h-3 w-3 text-blue-700" />
                            </span>
                            Recommended Courses:
                          </p>
                          <ul className="text-xs space-y-1 font-secondary">
                            {skill.courses.map((course, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-300 opacity-90 hover:opacity-100 py-1 px-1.5 hover:bg-blue-50/50 rounded-md"
                              >
                                <div
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ background: skill.bgGradient }}
                                ></div>
                                <span>{course}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="relative">
                          <div
                            className="absolute -inset-0.5 bg-gradient-to-r rounded-md blur opacity-30 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ background: skill.bgGradient }}
                          ></div>
                          <a
                            href={`https://www.coursera.org/search?query=${encodeURIComponent(skill.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full relative bg-white text-black hover:text-white transition-all duration-500 border font-secondary z-10 py-1.5 h-auto text-sm flex items-center justify-center rounded-md px-4"
                            style={{
                              backgroundImage: "none",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundImage = skill.bgGradient
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundImage = "none"
                            }}
                          >
                            Learn More
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="emerging" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emergingTechnologies.map((tech, index) => (
                  <AnimatedCard key={index} index={index} direction={index % 2 === 0 ? "left" : "right"}>
                    <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-500 border-slate-200 relative bg-white/80 backdrop-blur-sm">
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-15 transition-opacity duration-500 -z-10"
                        style={{ background: tech.bgGradient }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 w-full h-1 opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:h-1.5"
                        style={{ background: tech.bgGradient }}
                      ></div>
                      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/5 to-indigo-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                      <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-base flex items-center gap-2 font-primary group-hover:translate-y-0 transition-all duration-300">
                          <div
                            className="p-1.5 rounded-md text-white shadow-sm transform group-hover:scale-110 transition-all duration-300 flex items-center justify-center"
                            style={{ background: tech.bgGradient }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-blue-700 group-hover:to-indigo-800 transition-all duration-500">
                            {tech.name}
                          </span>
                        </CardTitle>
                        <CardDescription className="mt-2 font-secondary text-sm leading-relaxed pl-2 border-l-2 border-slate-200 group-hover:border-blue-400 transition-all duration-300">
                          {tech.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-1 px-4 pb-4">
                        <div className="grid grid-cols-2 gap-2 text-xs font-secondary">
                          <div className="p-2 rounded-md bg-slate-50/80 group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100">
                            <p className="text-muted-foreground text-xs mb-0.5 uppercase tracking-wider">Growth</p>
                            <p className="font-medium flex items-center gap-1.5">
                              <TrendingUp
                                className={`h-3 w-3 ${tech.growth === "High" ? "text-green-500" : tech.growth === "Medium" ? "text-amber-500" : "text-blue-500"}`}
                              />
                              <span
                                className={`${tech.growth === "High" ? "text-green-700" : tech.growth === "Medium" ? "text-amber-700" : "text-blue-700"}`}
                              >
                                {tech.growth}
                              </span>
                            </p>
                          </div>
                          <div className="p-2 rounded-md bg-slate-50/80 group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100">
                            <p className="text-muted-foreground text-xs mb-0.5 uppercase tracking-wider">Maturity</p>
                            <p className="font-medium">
                              <span
                                className={`${tech.maturity === "Emerging" ? "text-purple-700" : tech.maturity === "Early" ? "text-blue-700" : "text-green-700"}`}
                              >
                                {tech.maturity}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50/80 p-2.5 rounded-md group-hover:bg-white/90 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-slate-100">
                          <p className="text-xs font-medium mb-1.5 font-secondary flex items-center gap-1.5">
                            <span className="p-0.5 rounded-full bg-blue-100">
                              <BookOpen className="h-3 w-3 text-blue-700" />
                            </span>
                            Key Industries:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {tech.industries.map((industry, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="group-hover:scale-105 transition-transform duration-300 bg-white border-slate-200 font-secondary py-0.5 px-2 text-xs shadow-sm hover:shadow-md hover:bg-blue-50 cursor-pointer"
                              >
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="relative">
                          <div
                            className="absolute -inset-0.5 bg-gradient-to-r rounded-md blur opacity-30 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ background: tech.bgGradient }}
                          ></div>
                          <a
                            href={`https://www.coursera.org/search?query=${encodeURIComponent(tech.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full relative bg-white text-black hover:text-white transition-all duration-500 border font-secondary z-10 py-1.5 h-auto text-sm flex items-center justify-center rounded-md px-4"
                            style={{
                              backgroundImage: "none",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundImage = tech.bgGradient
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundImage = "none"
                            }}
                          >
                            Explore Opportunities
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

