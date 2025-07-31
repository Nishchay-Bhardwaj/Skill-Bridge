"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BookOpen, Sparkles, Download, Upload, BarChart, BookX } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface Skill {
  name: string
  proficiency: number
  required: number
  gap: number
}

interface SkillCategory {
  name: string
  skills: Skill[]
}

interface AnalysisResult {
  job_role: string
  skills: string[]
  match_percentage: number
  required_skills: string[]
  candidate_skills: string[]
  images?: {
    skill_match?: string
    tech_pie_chart?:string
  }
}

export default function SkillAnalysisPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [jobRole, setJobRole] = useState("")
  const [email, setEmail] = useState("")
  const [imageUrls, setImageUrls] = useState<{
    skillMatch?: string
    tech_pie_chart?:string
  }>({})
  const { toast } = useToast()
  const router = useRouter()
  const handleUploadResume = () => {
    router.push("/dashboard/resume-upload")
  }
  // Simulated skill proficiency data for visualization
  
  const [skillProficiency, setSkillProficiency] = useState({})

  useEffect(() => {
    if (result?.candidate_skills) {
      // Generate random proficiency scores for demonstration
      const proficiency = {}
      result.candidate_skills.forEach(skill => {
        proficiency[skill] = Math.floor(Math.random() * 40) + 60 // 60-100%
      })
      setSkillProficiency(proficiency)
    }
  }, [result])

  useEffect(() => {
    if (result?.images) {
      const timestamp = Date.now()
      setImageUrls({
        skillMatch: result.images.skill_match 
          ? `http://localhost:5000${result.images.skill_match}?t=${timestamp}`
          : undefined,
        tech_pie_chart: result.images.tech_pie_chart 
          ? `http://localhost:5000${result.images.tech_pie_chart}?t=${timestamp}`
          : undefined,
       
      })
    }
  }, [result])

  const missingSkills = result 
    ? result.required_skills.filter(skill => 
        !result.candidate_skills.includes(skill.toLowerCase())
      )
    : []

  const matchingSkills = result
    ? result.skills.filter(skill => 
        result.candidate_skills.includes(skill.toLowerCase())
      )
    : []

  const handleGenerateReport = async () => {
    if (!jobRole || !email) {
      toast({
        title: "Error",
        description: "Please enter job role and email",
        variant: "destructive"
      })
      return
    }
    setIsGenerating(true)
  
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_role: jobRole,
          email: email
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }
  
      const data = await response.json()
      console.log(data)
      console.log("Tech Pie Chart URL:", data.images);

      setResult(data)
  
      toast({
        title: "Analysis Complete",
        description: "Your skill gap analysis is ready",
      })
    } catch (error) {
      console.error("Error during fetch:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  

  // Error handling for image loading
  const handleImageError = (e) => {
    e.target.style.display = 'none'
    toast({
      title: "Image Error",
      description: "Failed to load skill visualization",
      variant: "destructive"
    })
  }
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-indigo-100 shadow-sm">
        <div className="container flex h-16 items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="ml-auto flex gap-2">
            {/* <Button 
              size="sm" 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all duration-300 hover:translate-y-px"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Report
                </>
              )}
            </Button> */}
            {/* <Button
              variant="outline"
              size="sm"
              className="gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all duration-300"
              onClick={() => {
                toast({
                  title: "Report Downloaded",
                  description: "Your skill gap analysis report has been downloaded.",
                })
              }}
            >
              <Download className="h-4 w-4" /> Download
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadResume}
              className="gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all duration-300"
            >
            
            Upload Resume
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Skill Gap Analysis
            </h1>
            <p className="text-indigo-800/70 max-w-2xl mx-auto md:mx-0">
              Identify gaps in your skillset and discover what you need to learn for your dream role
            </p>
          </motion.div>

          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <Card className="relative border border-transparent bg-gradient-to-br from-white/80 via-white/60 to-white/30 backdrop-blur-xl shadow-xl rounded-xl p-[1px] hover:scale-[1.01] transition-transform duration-300">
    <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 blur-md opacity-30 animate-pulse" />

    <CardContent className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-indigo-800">
            Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-inner transition duration-200"
            placeholder="e.g. Frontend Developer"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-indigo-800">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-inner transition duration-200"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <Button
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 w-full md:w-auto bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-lg shadow-xl shadow-indigo-300/40 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 animate-bounce" />
            Analyze Skills
          </>
        )}
      </Button>
    </CardContent>
  </Card>
</motion.div>

          {result && (
  <div className="space-y-8">
    {/* Skills Overview Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Left Side - Your Skills with Horizontal Bars */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg border-indigo-100 overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-xl text-indigo-800">Your Skills</CardTitle>
            <CardDescription className="text-indigo-600">
              Skills you have for <span className="font-medium">{result.job_role}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-indigo-800">Overall Match</span>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }}
                  className="text-lg font-bold" 
                  style={{ 
                    color: result.match_percentage > 70 ? '#4338ca' : 
                           result.match_percentage > 40 ? '#9333ea' : '#be185d' 
                  }}
                >
                  {result.match_percentage.toFixed(3)}%
                </motion.span>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                style={{ originX: 0 }}
              >
                <Progress 
                  value={result.match_percentage} 
                  className="h-4 bg-indigo-100"
                  indicatorClassName={
                    result.match_percentage > 70 ? 'bg-gradient-to-r from-indigo-500 to-indigo-700' : 
                    result.match_percentage > 40 ? 'bg-gradient-to-r from-purple-500 to-purple-700' : 
                    'bg-gradient-to-r from-pink-500 to-pink-700'
                  }
                />
              </motion.div>
            </div>

            {/* Skill Match Visualization */}
            {imageUrls.skillMatch && (
              <div className="mt-8">
                <div className="relative border border-indigo-100 rounded-xl p-6 bg-white shadow-lg overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-20 -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full opacity-20 -ml-24 -mb-24"></div>
                  </div>
                  
                  {/* Chart header */}
                  <div className="relative z-10 mb-4">
                    <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
                      Skill Match Visualization
                    </h3>
                    <p className="text-sm text-indigo-600 mt-1">
                      How your skills compare to requirements
                    </p>
                  </div>

                  {/* Chart container */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 border border-indigo-100 rounded-lg bg-white shadow-inner overflow-hidden"
                  >
                    <img
                      src={imageUrls.skillMatch}
                      alt="Skill Match Chart"
                      className="w-full h-auto mx-auto p-4"
                      onError={handleImageError}
                    />
                     <img
                      src={imageUrls.tech_pie_chart}
                      alt="Pie chart"
                      className="w-full h-auto mx-auto p-4"
                      onError={handleImageError}
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Skill bars for matching skills */}
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
                Skill Proficiency 
              </h3>
              <div className="space-y-5">
                {matchingSkills.map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-700">{skill}</span>
                      <span className="text-sm font-semibold text-indigo-800">
                        {skillProficiency[skill.toLowerCase()]}%
                      </span>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      style={{ originX: 0 }}
                    >
                      <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform transition-all duration-500 hover:scale-x-105"
                          style={{ 
                            width: `${skillProficiency[skill.toLowerCase()]}%`,
                            boxShadow: '0 0 8px rgba(79, 70, 229, 0.6)'
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
                {/* Right Side - Missing Skills */}
                <div className="lg:col-span-1">
                  <Card className="shadow-lg border-indigo-100 overflow-hidden bg-white/95 backdrop-blur-sm transform perspective-1000">
                    <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
                      <CardTitle className="text-xl text-rose-800 flex items-center">
                        <BookX className="h-5 w-5 mr-2 text-rose-600" />
                        Missing Skills
                      </CardTitle>
                      <CardDescription className="text-rose-600">
                        Skills you need to develop
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {missingSkills.length > 0 ? (
                        <div className="space-y-3">
                          {missingSkills.map((skill, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * i }}
                              className="group"
                            >
                              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:scale-102 group-hover:border-rose-200">
                                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-200"></div>
                                <span className="text-sm font-medium text-rose-800">{skill}</span>
                                <span className="ml-auto text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-sm">
                                  Required
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-rose-500">
                          No missing skills detected
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Recommended Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="shadow-lg border-indigo-100 overflow-hidden bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="text-xl text-blue-800">Recommended Actions</CardTitle>
                    <CardDescription className="text-blue-600">Steps to improve your skillset</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div 
                        whileHover={{ 
                          scale: 1.03, 
                          rotateY: 5, 
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                        }}
                        className="p-4 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md transform transition-all duration-300 cursor-pointer"
                      >
                        <h4 className="font-medium text-blue-800 mb-2">1. Focus on Missing Skills</h4>
                        <p className="text-sm text-blue-700">
                          Prioritize learning the {missingSkills.length} missing skills identified above.
                        </p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ 
                          scale: 1.03, 
                          rotateY: 5, 
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                        }}
                        className="p-4 border border-purple-100 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md transform transition-all duration-300 cursor-pointer"
                      >
                        <h4 className="font-medium text-purple-800 mb-2">2. Practice Projects</h4>
                        <p className="text-sm text-purple-700">
                          Build real-world projects to strengthen your existing skills.
                        </p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ 
                          scale: 1.03, 
                          rotateY: 5, 
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                        }}
                        className="p-4 border border-cyan-100 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md transform transition-all duration-300 cursor-pointer"
                      >
                        <h4 className="font-medium text-cyan-800 mb-2">3. Update Resume</h4>
                        <p className="text-sm text-cyan-700">
                          Highlight your matching skills when applying for roles.
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}