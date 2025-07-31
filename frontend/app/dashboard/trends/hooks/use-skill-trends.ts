"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface SkillTrend {
  name: string
  description: string
  salary: string
  growth: string
  difficulty: string
  timeToLearn: string
  courses: string[]
  bgGradient?: string
  icon?: React.ReactNode
}

interface EmergingTechnology {
  name: string
  description: string
  growth: string
  maturity: string
  industries: string[]
  bgGradient?: string
}

interface SkillTrendData {
  articleTitle: string
  lastUpdated: string
  skills: SkillTrend[]
  emergingTechnologies: EmergingTechnology[]
}

interface SkillTrendsResponse {
  success: boolean
  data: SkillTrendData
  source: "cache" | "fresh" | "stale-cache"
  lastUpdated: string
  error?: string
}

export function useSkillTrends() {
  const [data, setData] = useState<SkillTrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string | null>(null)

  // Assign color gradients to skills based on their names for consistent display
  const processSkillData = (skillData: SkillTrendData): SkillTrendData => {
    if (!skillData) return skillData

    // Gradient mapping for consistency
    const gradients = [
      "linear-gradient(to right, #3b82f6, #4f46e5)", // blue
      "linear-gradient(to right, #a855f7, #ec4899)", // purple to pink
      "linear-gradient(to right, #22c55e, #10b981)", // green
      "linear-gradient(to right, #f59e0b, #f97316)", // amber to orange
      "linear-gradient(to right, #06b6d4, #3b82f6)", // cyan to blue
      "linear-gradient(to right, #ef4444, #e11d48)", // red
      "linear-gradient(to right, #0ea5e9, #3b82f6)", // light blue
      "linear-gradient(to right, #8b5cf6, #a855f7)", // violet to purple
    ]

    // Process skills
    const processedSkills = skillData.skills.map((skill, index) => ({
      ...skill,
      bgGradient: skill.bgGradient || gradients[index % gradients.length],
    }))

    // Process emerging technologies
    const processedTechnologies = skillData.emergingTechnologies.map((tech, index) => ({
      ...tech,
      bgGradient: tech.bgGradient || gradients[(index + 4) % gradients.length],
    }))

    return {
      ...skillData,
      skills: processedSkills,
      emergingTechnologies: processedTechnologies,
    }
  }

  useEffect(() => {
    const fetchSkillTrends = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/skills")

        if (!response.ok) {
          throw new Error(`Failed to fetch skill trends: ${response.status}`)
        }

        const result: SkillTrendsResponse = await response.json()

        if (result.success) {
          setData(processSkillData(result.data))
          setLastUpdated(result.lastUpdated)
          setDataSource(result.source)
          setError(result.error || null)
        } else {
          throw new Error(result.error || "Unknown error")
        }
      } catch (err: any) {
        console.error("Error fetching skill trends:", err)
        setError(err.message || "Failed to fetch skill trends")

        // Set fallback data if fetch fails
        const fallbackData = {
          articleTitle: "High-Income Skills to Learn in 2025",
          lastUpdated: new Date().toISOString(),
          skills: [
            {
              name: "Software Development",
              description: "Creating, testing, and maintaining software applications and systems.",
              salary: "$110,140",
              growth: "25%",
              difficulty: "High",
              timeToLearn: "6-12 months",
              courses: ["Computer Science Fundamentals", "Full-Stack Web Development", "Mobile App Development"],
            },
            {
              name: "Data Science",
              description: "Extracting insights from complex data using statistics and machine learning.",
              salary: "$100,910",
              growth: "36%",
              difficulty: "High",
              timeToLearn: "6-12 months",
              courses: ["Data Analysis with Python", "Machine Learning", "Big Data Analytics"],
            },
            {
              name: "Digital Marketing",
              description: "Promoting products/services through digital channels.",
              salary: "$77,200",
              growth: "10%",
              difficulty: "Medium",
              timeToLearn: "3-6 months",
              courses: ["SEO Fundamentals", "Social Media Marketing", "Content Marketing Strategy"],
            },
            {
              name: "UX/UI Design",
              description: "Creating user-friendly and visually appealing digital experiences.",
              salary: "$85,277",
              growth: "13%",
              difficulty: "Medium",
              timeToLearn: "4-8 months",
              courses: ["User Experience Design", "UI Design Principles", "Prototyping and Wireframing"],
            },
            {
              name: "Project Management",
              description: "Planning, executing, and overseeing projects from start to finish.",
              salary: "$94,500",
              growth: "7%",
              difficulty: "Medium",
              timeToLearn: "3-6 months",
              courses: ["Agile Project Management", "PMP Certification Prep", "Scrum Master Training"],
            },
            {
              name: "Cybersecurity",
              description: "Protecting systems, networks, and programs from digital attacks.",
              salary: "$103,590",
              growth: "33%",
              difficulty: "High",
              timeToLearn: "6-12 months",
              courses: ["Network Security Fundamentals", "Ethical Hacking", "Security Compliance"],
            },
          ],
          emergingTechnologies: [
            {
              name: "Blockchain Development",
              description: "Building decentralized applications and smart contracts.",
              growth: "High",
              maturity: "Emerging",
              industries: ["Finance", "Supply Chain", "Healthcare"],
            },
            {
              name: "Quantum Computing",
              description: "Programming quantum computers to solve complex problems.",
              growth: "Medium",
              maturity: "Early",
              industries: ["Research", "Cryptography", "Pharmaceuticals"],
            },
            {
              name: "AR/VR Development",
              description: "Creating immersive augmented and virtual reality experiences.",
              growth: "High",
              maturity: "Growing",
              industries: ["Gaming", "Education", "Real Estate"],
            },
            // {
            //   name: "Sustainable Technology",
            //   description: "Developing eco-friendly tech solutions.",
            //   growth: "High",
            //   maturity: "Growing",
            //   industries: ["Energy", "Manufacturing", "Transportation"],
            // },
          ],
        }

        setData(processSkillData(fallbackData))
        setLastUpdated(new Date().toISOString())
        setDataSource("fallback")
      } finally {
        setLoading(false)
      }
    }

    fetchSkillTrends()

    // Refetch data every hour
    const intervalId = setInterval(fetchSkillTrends, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const refetch = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/skills")

      if (!response.ok) {
        throw new Error(`Failed to fetch skill trends: ${response.status}`)
      }

      const result: SkillTrendsResponse = await response.json()

      if (result.success) {
        setData(processSkillData(result.data))
        setLastUpdated(result.lastUpdated)
        setDataSource(result.source)
        setError(result.error || null)
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (err: any) {
      console.error("Error fetching skill trends:", err)
      setError(err.message || "Failed to fetch skill trends")
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    lastUpdated,
    dataSource,
    refetch,
  }
}

