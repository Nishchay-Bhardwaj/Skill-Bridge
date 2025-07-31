"use client"

import { useEffect, useRef } from "react"

interface ResumeScoreGaugeProps {
  score: number
}

export default function ResumeScoreGauge({ score }: ResumeScoreGaugeProps) {
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
        canvas.width = Math.min(rect.width, 300)
        canvas.height = Math.min(rect.width, 300)
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw gauge
    const drawGauge = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.8

      // Draw outer arc background
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
      ctx.lineWidth = 20
      ctx.strokeStyle = "#e5e7eb"
      ctx.stroke()

      // Calculate score position
      const scoreRadian = Math.PI + (score / 100) * Math.PI

      // Draw score arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, scoreRadian, false)

      // Gradient based on score
      const arcGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)

      if (score < 50) {
        // Red gradient for low scores
        arcGradient.addColorStop(0, "#ef4444")
        arcGradient.addColorStop(1, "#f87171")
      } else if (score < 75) {
        // Orange gradient for medium scores
        arcGradient.addColorStop(0, "#f97316")
        arcGradient.addColorStop(1, "#fb923c")
      } else {
        // Green gradient for high scores
        arcGradient.addColorStop(0, "#15803d")
        arcGradient.addColorStop(1, "#22c55e")
      }

      ctx.lineWidth = 20
      ctx.strokeStyle = arcGradient
      ctx.stroke()

      // Add shadow to the score text
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Draw score text
      ctx.font = "bold 40px sans-serif"
      ctx.fillStyle = "#0f172a"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${score}`, centerX, centerY - 10)

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Draw label
      ctx.font = "14px sans-serif"
      ctx.fillStyle = "#64748b"
      ctx.fillText("ATS Score", centerX, centerY + 20)

      // Draw min and max labels
      ctx.font = "12px sans-serif"
      ctx.textAlign = "start"
      ctx.fillText("0", centerX - radius + 10, centerY + radius / 2)
      ctx.textAlign = "end"
      ctx.fillText("100", centerX + radius - 10, centerY + radius / 2)
    }

    drawGauge()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [score])

  return (
    <div className="flex justify-center w-full max-w-[250px]">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  )
}

