"use client"

import { useEffect, useRef } from "react"

export default function SkillRadarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = Math.min(rect.width * 0.6, 300)
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw radar chart
    const drawRadarChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.8

      const skillCategories = [
        "Technical",
        "Communication",
        "Leadership",
        "Problem Solving",
        "Collaboration",
        "Domain Knowledge",
      ]
      const userSkills = [0.85, 0.65, 0.55, 0.9, 0.75, 0.6]
      const requiredSkills = [0.9, 0.7, 0.8, 0.85, 0.75, 0.95]

      // Draw axis lines and labels
      ctx.strokeStyle = "#e5e7eb"
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      for (let i = 0; i < skillCategories.length; i++) {
        const angle = (Math.PI * 2 * i) / skillCategories.length - Math.PI / 2
        const labelRadius = radius * 1.15

        // Draw axis line
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        ctx.stroke()

        // Draw label
        const labelX = centerX + Math.cos(angle) * labelRadius
        const labelY = centerY + Math.sin(angle) * labelRadius
        ctx.fillText(skillCategories[i], labelX, labelY)
      }

      // Draw concentric circles
      for (let i = 1; i <= 4; i++) {
        const levelRadius = radius * (i / 4)
        ctx.beginPath()
        ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Create gradient for user skills
      const userGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      userGradient.addColorStop(0, "rgba(21, 128, 61, 0.5)")
      userGradient.addColorStop(1, "rgba(21, 128, 61, 0.2)")

      // Draw user skills polygon
      ctx.beginPath()
      ctx.fillStyle = userGradient
      ctx.strokeStyle = "rgb(21, 128, 61)"
      ctx.lineWidth = 2

      for (let i = 0; i < skillCategories.length; i++) {
        const angle = (Math.PI * 2 * i) / skillCategories.length - Math.PI / 2
        const pointRadius = radius * userSkills[i]
        const x = centerX + Math.cos(angle) * pointRadius
        const y = centerY + Math.sin(angle) * pointRadius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Create gradient for required skills
      const requiredGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      requiredGradient.addColorStop(0, "rgba(59, 130, 246, 0.25)")
      requiredGradient.addColorStop(1, "rgba(59, 130, 246, 0.1)")

      // Draw required skills polygon
      ctx.beginPath()
      ctx.fillStyle = requiredGradient
      ctx.strokeStyle = "rgb(59, 130, 246)"
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2

      for (let i = 0; i < skillCategories.length; i++) {
        const angle = (Math.PI * 2 * i) / skillCategories.length - Math.PI / 2
        const pointRadius = radius * requiredSkills[i]
        const x = centerX + Math.cos(angle) * pointRadius
        const y = centerY + Math.sin(angle) * pointRadius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.setLineDash([])

      // Draw legend
      const legendY = canvas.height - 20

      // User skills legend
      ctx.fillStyle = userGradient
      ctx.strokeStyle = "rgb(21, 128, 61)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(centerX - 120, legendY, 15, 15)
      ctx.fill()
      ctx.stroke()

      // Required skills legend
      ctx.fillStyle = requiredGradient
      ctx.strokeStyle = "rgb(59, 130, 246)"
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.rect(centerX + 20, legendY, 15, 15)
      ctx.fill()
      ctx.stroke()
      ctx.setLineDash([])

      // Legend text
      ctx.fillStyle = "#64748b"
      ctx.textAlign = "left"
      ctx.fillText("Your Skills", centerX - 100, legendY + 7)
      ctx.fillText("Required Skills", centerX + 40, legendY + 7)
    }

    drawRadarChart()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  )
}

