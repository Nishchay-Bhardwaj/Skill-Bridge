"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, CheckCircle, Clock, Filter, Play, Star, Rocket } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface Course {
  id: string
  title: string
  provider: string
  image: string
  duration: string
  level: string
  rating: number
  progress?: number
  skillMatch?: number
  description: string
  type: 'Course' | 'Project'
  priority?: string
  url: string
}

interface LearningPath {
  id: string
  title: string
  courses: number
  duration: string
  progress: number
  skills: string[]
}

interface AnalysisData {
  job_role: string
  match_percentage: number
  required_skills: string[]
  matched_skills: string[]
  missing_skills: string[]
  recommendations: Course[]
  visualizations: {
    skill_match: string
    skill_radar: string
  }
}

export default function LearningRoadmapPage() {
  const { userEmail } = useAuth()
  const [activeTab, setActiveTab] = useState("recommended")
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])

  const analyzeRoadmap = async () => {
    if (!userEmail) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze your roadmap.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('http://localhost:5002/api/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      })

      if (!response.ok) throw new Error(await response.text())

      const data = await response.json()
      console.log(data)
      setAnalysisData(data)

      const generatedPaths: LearningPath[] = [
        {
          id: '1',
          title: data.job_role || 'Career Path',
          courses: data.recommendations.length,
          duration: `${Math.ceil(data.recommendations.length * 10)} hours`,
          progress: Math.min(100, Math.max(0, data.match_percentage || 0)),
          skills: data.required_skills,
        }
      ]
      setLearningPaths(generatedPaths)

      setHasAnalyzed(true)
      toast({
        title: "Roadmap Generated",
        description: "Your personalized learning path has been created.",
      })
    } catch (error) {
    } finally {
      setIsAnalyzing(false)
    }
  }

  const recommendedCourses = analysisData?.recommendations.filter(r => r.type === 'Course') || []
  const projects = analysisData?.recommendations.filter(r => r.type === 'Project') || []

  const renderCourseCard = (course: Course, index: number) => (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 border-slate-200 relative bg-white/90 backdrop-blur-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-1 opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-indigo-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg text-white shadow-md transform group-hover:scale-110 transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-700 group-hover:from-purple-700 group-hover:to-indigo-800 transition-all duration-500 font-heading">
                {course.title}
              </span>
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-indigo-100 text-indigo-800 border-indigo-200 transition-all duration-300 group-hover:scale-110 shadow-sm text-xs font-medium"
            >
              {course.type}
            </Badge>
          </div>
          <CardDescription className="mt-3 text-sm leading-relaxed pl-3 border-l-2 border-violet-200 group-hover:border-violet-400 transition-all duration-300 font-sans">
            {course.provider}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 px-5 pb-5">
          <p className="text-sm line-clamp-2 text-slate-600 font-sans leading-relaxed">{course.description}</p>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-md bg-gradient-to-br from-violet-50 to-indigo-50/80 group-hover:from-violet-100 group-hover:to-indigo-50 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-indigo-100">
              <p className="text-indigo-500 text-xs mb-1 uppercase tracking-wider font-medium">Priority</p>
              <p className="font-semibold flex items-center gap-1.5 text-indigo-800">
                <Clock className="h-3.5 w-3.5 text-violet-500" />
                {course.priority}
              </p>
            </div>
            {course.rating && (
              <div className="p-3 rounded-md bg-gradient-to-br from-violet-50 to-indigo-50/80 group-hover:from-violet-100 group-hover:to-indigo-50 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-indigo-100 col-span-1">
                <p className="text-indigo-500 text-xs mb-1 uppercase tracking-wider font-medium">Rating</p>
                <p className="font-semibold flex items-center gap-1.5 text-indigo-800">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {course.rating}
                </p>
              </div>
            )}
          </div>

          <div className="relative mt-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-md blur opacity-40 transition-opacity duration-300 group-hover:opacity-100"></div>
            <Button
              size="sm"
              className="w-full relative bg-white text-indigo-900 hover:text-white transition-all duration-500 border-indigo-100 z-10 py-6 font-semibold text-sm"
              onClick={() => window.open(course.url, "_blank")}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundImage = "linear-gradient(to right, #8b5cf6, #4f46e5)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundImage = "none"
              }}
            >
              <Play className="h-4 w-4 mr-2" /> Start Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderProjectCard = (project: Course, index: number) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 border-slate-200 relative bg-white/90 backdrop-blur-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-1 opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg text-white shadow-md transform group-hover:scale-110 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-600">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-700 group-hover:from-cyan-700 group-hover:to-blue-800 transition-all duration-500 font-heading">
                {project.title}
              </span>
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-cyan-100 text-cyan-800 border-cyan-200 transition-all duration-300 group-hover:scale-110 shadow-sm font-medium"
            >
              Project • {project.skillMatch || 85}% match
            </Badge>
          </div>
          <CardDescription className="mt-3 text-sm leading-relaxed pl-3 border-l-2 border-cyan-200 group-hover:border-cyan-400 transition-all duration-300 font-sans">
            {project.provider}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 px-5 pb-5">
          <p className="text-sm line-clamp-2 text-slate-600 font-sans leading-relaxed">{project.description}</p>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-md bg-gradient-to-br from-cyan-50 to-blue-50/80 group-hover:from-cyan-100 group-hover:to-blue-50 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-cyan-100">
              <p className="text-cyan-500 text-xs mb-1 uppercase tracking-wider font-medium">Duration</p>
              <p className="font-semibold flex items-center gap-1.5 text-cyan-800">
                <Clock className="h-3.5 w-3.5 text-cyan-500" />
                {project.duration}
              </p>
            </div>
            <div className="p-3 rounded-md bg-gradient-to-br from-cyan-50 to-blue-50/80 group-hover:from-cyan-100 group-hover:to-blue-50 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-cyan-100">
              <p className="text-cyan-500 text-xs mb-1 uppercase tracking-wider font-medium">Level</p>
              <p className="font-semibold flex items-center gap-1.5 text-cyan-800">
                <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
                {project.level}
              </p>
            </div>
            {project.rating && (
              <div className="p-3 rounded-md bg-gradient-to-br from-cyan-50 to-blue-50/80 group-hover:from-cyan-100 group-hover:to-blue-50 transition-colors duration-300 shadow-sm border border-transparent group-hover:border-cyan-100 col-span-2">
                <p className="text-cyan-500 text-xs mb-1 uppercase tracking-wider font-medium">Rating</p>
                <p className="font-semibold flex items-center gap-1.5 text-cyan-800">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {project.rating}
                </p>
              </div>
            )}
          </div>

          <div className="relative mt-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md blur opacity-40 transition-opacity duration-300 group-hover:opacity-100"></div>
            <Button
              size="sm"
              className="w-full relative bg-white text-cyan-900 hover:text-white transition-all duration-500 border-cyan-100 z-10 py-6 font-semibold text-sm"
              onClick={() => window.open(project.url, "_blank")}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundImage = "linear-gradient(to right, #06b6d4, #2563eb)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundImage = "none"
              }}
            >
              <Play className="h-4 w-4 mr-2" /> Start Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
  
  function scrollTo() {
    document.getElementById('recom').scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      <header className="sticky top-0 z-50 w-full border-b border-indigo-100 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-sm">
        <div className="container flex h-16 items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="ml-auto flex gap-2">
            {/* <Button variant="outline" size="sm" className="gap-1 border-indigo-200 hover:bg-indigo-50 text-indigo-700">
              <Filter className="h-4 w-4" />
              Filter
            </Button> */}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-10">
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 font-heading">Learning Roadmap</h1>
            <p className="text-slate-600 text-lg font-light">Personalized learning paths to bridge your skill gaps and accelerate your career growth</p>

            {!hasAnalyzed && (
              <Button onClick={analyzeRoadmap} className="mt-6 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 px-6 py-6 text-base font-medium" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5" />
                    Analyze My Roadmap
                  </>
                )}
              </Button>
            )}
          </div>

          {hasAnalyzed && analysisData ? (
            <>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 font-heading">Your Learning Paths</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {learningPaths.map((path) => (
                    <Card key={path.id} className="border border-indigo-100/50 bg-white/70 backdrop-blur-lg hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-300/30 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-bold text-indigo-800 font-heading">{path.title}</CardTitle>
                        <CardDescription className="text-indigo-600/80 text-base">{path.courses} courses • {path.duration}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span className="text-indigo-700">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2.5 bg-indigo-100" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-3 text-indigo-800">Skills Covered</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {path.skills.slice(0, 5).map((skill, i) => (
                              <span key={i} className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1.5 rounded-full font-medium">{skill}</span>
                            ))}
                            {path.skills.length > 5 && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-full font-medium">
                                +{path.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={scrollTo} size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 py-5 font-medium text-sm">View Detailed Path</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="border border-indigo-100/50 bg-white/70 backdrop-blur-lg hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-300/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-indigo-800 font-heading">Skill Match Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-square">
                      <Image src={`data:image/png;base64,${analysisData.visualizations.skill_match}`} alt="Skill Match" fill className="object-contain" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-indigo-100/50 bg-white/70 backdrop-blur-lg hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-300/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-indigo-800 font-heading">Skill Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-square">
                      <Image src={`data:image/png;base64,${analysisData.visualizations.skill_radar}`} alt="Skill Radar" fill className="object-contain" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {projects.length > 0 && (
                <div id="recom" className="space-y-5 mt-8">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-700 font-heading">Recommended Projects</h2>
                  <p className="text-slate-600 mb-6">Hands-on projects to apply your skills and build your portfolio</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => renderProjectCard(project, index))}
                  </div>
                </div>
              )}

              <div className="space-y-5 mt-8">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 font-heading">Your Learning Journey</h2>
                <p className="text-slate-600 mb-4">Track your progress and discover new courses tailored to your career goals</p>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-indigo-50/70 p-1">
                    <TabsTrigger value="recommended" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium">
                      Recommended
                    </TabsTrigger>
                    <TabsTrigger value="inProgress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium">
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium">
                      Completed
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="recommended" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendedCourses.map((course, index) => renderCourseCard(course, index))}
                    </div>
                  </TabsContent>

                  <TabsContent value="inProgress" className="mt-8">
                    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <BookOpen className="h-12 w-12 text-indigo-400" />
                      <h3 className="text-xl font-bold text-indigo-800">No courses in progress</h3>
                      <p className="text-base text-indigo-600/70 max-w-md font-light">
                        Start a recommended course to track your progress here and build your skills.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="completed" className="mt-8">
                    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <CheckCircle className="h-12 w-12 text-indigo-400" />
                      <h3 className="text-xl font-bold text-indigo-800">No completed courses yet</h3>
                      <p className="text-base text-indigo-600/70 max-w-md font-light">
                        Finish a course to see it appear here and track your learning achievements.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-lg shadow-indigo-100/20">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Rocket className="h-10 w-10 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 font-heading">Your Personalized Roadmap Awaits</h3>
              <p className="text-indigo-600/80 text-lg text-center max-w-lg font-light">
                Analyze your skills and goals to generate a customized learning path with courses and projects tailored just for you.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}