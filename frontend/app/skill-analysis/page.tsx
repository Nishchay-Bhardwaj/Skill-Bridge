"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, BookOpen, Sparkles, Download } from "lucide-react"
import SkillGapHeatmap from "@/components/skill-gap-heatmap"
import SkillRadarChart from "@/components/skill-radar-chart"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

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

interface RecommendedCourse {
  title: string
  provider: string
  duration: string
  level: string
  match: number
}

interface AnalysisData {
  job_role: string
  required_skills: string[]
  candidate_skills: string[]
  match_percentage: number
  images?: {
    'skill_match.png'?: string
    'similarity_heatmap.png'?: string
  }
}

export default function SkillAnalysisPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [jobRole, setJobRole] = useState("")
  const [location, setLocation] = useState("")
  const { toast } = useToast()

  // Transform backend data to frontend format
  const skillCategories: SkillCategory[] = analysisData ? [
    {
      name: "Technical Skills",
      skills: analysisData.required_skills.map(skill => ({
        name: skill,
        proficiency: analysisData.candidate_skills.includes(skill) ? 80 : 30,
        required: 80,
        gap: analysisData.candidate_skills.includes(skill) ? 0 : 50
      }))
    }
  ] : []

  const recommendedCourses: RecommendedCourse[] = [
    {
      title: "AWS Certified Solutions Architect",
      provider: "Coursera",
      duration: "3 months",
      level: "Intermediate",
      match: 95,
    },
    {
      title: "Advanced Node.js Development",
      provider: "Udemy",
      duration: "20 hours",
      level: "Advanced",
      match: 90,
    },
    {
      title: "SQL for Data Analysis",
      provider: "DataCamp",
      duration: "15 hours",
      level: "Intermediate",
      match: 85,
    },
  ]

  const handleGenerateReport = async () => {
    if (!jobRole || !resumeText) {
      toast({
        title: "Error",
        description: "Please enter both job role and resume text",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_role: jobRole,
          resume_text: resumeText,
          location: location
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setAnalysisData(data.analysis)
      
      toast({
        title: "Report Generated",
        description: "Your skill gap analysis report has been generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewCourse = (courseTitle: string) => {
    toast({
      title: "Course Selected",
      description: `You've selected the "${courseTitle}" course.`,
    })
  }

  const handleViewProject = (projectTitle: string) => {
    toast({
      title: "Project Selected",
      description: `You've selected the "${projectTitle}" project.`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={handleGenerateReport} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Report
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => {
                toast({
                  title: "Report Downloaded",
                  description: "Your skill gap analysis report has been downloaded.",
                })
              }}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Skill Gap Analysis</h1>
            <p className="text-muted-foreground">Identify gaps in your skillset and get personalized recommendations</p>
          </div>

          {/* Input Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label htmlFor="jobRole" className="block text-sm font-medium mb-1">
                  Job Role
                </label>
                <input
                  id="jobRole"
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              
              <div>
                <label htmlFor="resumeText" className="block text-sm font-medium mb-1">
                  Resume Text
                </label>
                <textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md min-h-[200px]"
                  placeholder="Paste your resume content here..."
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location (optional)
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </CardContent>
          </Card>

          {analysisData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Skill Radar</CardTitle>
                    <CardDescription>Your skills compared to industry requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkillRadarChart 
                      requiredSkills={analysisData.required_skills} 
                      candidateSkills={analysisData.candidate_skills}
                    />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Skills Summary</CardTitle>
                    <CardDescription>Overall skill match</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Overall Match</span>
                        <span className="text-sm font-medium">{analysisData.match_percentage}%</span>
                      </div>
                      <Progress value={analysisData.match_percentage} className="h-2" />
                    </div>

                    {/* Display visualization images if available */}
                    {analysisData.images && (
                      <div className="space-y-4">
                        {analysisData.images['skill_match.png'] && (
                          <img 
                            src={`data:image/png;base64,${analysisData.images['skill_match.png']}`} 
                            alt="Skill Match Visualization"
                            className="w-full rounded border"
                          />
                        )}
                        {analysisData.images['similarity_heatmap.png'] && (
                          <img 
                            src={`data:image/png;base64,${analysisData.images['similarity_heatmap.png']}`} 
                            alt="Similarity Heatmap"
                            className="w-full rounded border"
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="heatmap" className="space-y-6">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                  <TabsTrigger value="heatmap">Heatmap Analysis</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="heatmap" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Gap Heatmap</CardTitle>
                      <CardDescription>Detailed breakdown of your skills and gaps</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SkillGapHeatmap skillCategories={skillCategories} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Recommendations</CardTitle>
                      <CardDescription>Personalized courses and resources to bridge your skill gaps</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {recommendedCourses.map((course, i) => (
                          <Card
                            key={i}
                            className="bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold line-clamp-2">{course.title}</h4>
                                  <p className="text-sm text-muted-foreground">{course.provider}</p>
                                </div>
                                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                  {course.match}% match
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 my-2">
                                <span className="text-xs bg-secondary px-2 py-1 rounded">{course.duration}</span>
                                <span className="text-xs bg-secondary px-2 py-1 rounded">{course.level}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2 gap-1 hover:bg-primary/10"
                                onClick={() => handleViewCourse(course.title)}
                              >
                                <BookOpen className="h-3 w-3" /> View Course
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  )
}