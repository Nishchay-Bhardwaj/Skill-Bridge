"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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

interface SkillGapHeatmapProps {
  skillCategories: SkillCategory[]
}

export default function SkillGapHeatmap({ skillCategories }: SkillGapHeatmapProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  // Helper function to determine cell color based on gap
  const getGapColor = (gap: number) => {
    if (gap <= 0) return "bg-green-100 text-green-800"
    if (gap <= 10) return "bg-amber-100 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  // Helper function to determine progress bar color
  const getProgressColor = (proficiency: number, required: number) => {
    if (proficiency >= required) return "bg-green-500"
    if (proficiency >= required * 0.8) return "bg-amber-500"
    return "bg-red-500"
  }

  const handleAnalyzeSkill = (skillName: string) => {
    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      toast({
        title: "Skill Analysis Complete",
        description: `Analysis for ${skillName} has been completed. Check your learning recommendations.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-8">
      {skillCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="font-medium text-lg">{category.name}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground w-[200px]">Skill</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Your Proficiency</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Required Level</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground w-[120px]">Gap</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground w-[120px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {category.skills.map((skill, skillIndex) => (
                  <tr key={skillIndex} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{skill.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getProgressColor(skill.proficiency, skill.required)}`}
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm whitespace-nowrap">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="h-2.5 rounded-full bg-blue-500" style={{ width: `${skill.required}%` }}></div>
                        </div>
                        <span className="text-sm whitespace-nowrap">{skill.required}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${getGapColor(skill.gap)}`}>
                        {skill.gap > 0 ? `${skill.gap}% gap` : "No gap"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {skill.gap > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-8 hover:bg-primary/10"
                          onClick={() => handleAnalyzeSkill(skill.name)}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? "Analyzing..." : "Improve"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

