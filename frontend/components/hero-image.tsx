"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

export default function HeroImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw resume and skill visualization graphics
    const drawHeroGraphic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stylized resume
      ctx.fillStyle = "#ffffff"
      ctx.shadowColor = "rgba(37, 99, 235, 0.2)"
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
      ctx.fillRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.5, canvas.height * 0.7)
      ctx.shadowColor = "transparent"

      // Draw resume header
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.5, canvas.height * 0.15)

      // Draw resume content lines
      ctx.fillStyle = "#e5e7eb"
      for (let i = 0; i < 10; i++) {
        ctx.fillRect(canvas.width * 0.15, canvas.height * (0.3 + i * 0.05), canvas.width * 0.4, canvas.height * 0.02)
      }

      // Draw skill chart
      ctx.fillStyle = "#ffffff"
      ctx.shadowColor = "rgba(37, 99, 235, 0.2)"
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
      ctx.beginPath()
      ctx.arc(canvas.width * 0.75, canvas.height * 0.4, canvas.width * 0.15, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowColor = "transparent"

      // Draw radar chart lines
      ctx.strokeStyle = "#e5e7eb"
      ctx.beginPath()
      const centerX = canvas.width * 0.75
      const centerY = canvas.height * 0.4
      const radius = canvas.width * 0.15
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      }
      ctx.stroke()

      // Draw concentric circles
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * (i / 3), 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw data points and fill
      ctx.fillStyle = "rgba(37, 99, 235, 0.3)" // Primary color with transparency
      ctx.strokeStyle = "rgb(37, 99, 235)"
      ctx.lineWidth = 2
      ctx.beginPath()

      const dataPoints = [0.8, 0.6, 0.9, 0.7, 0.5, 0.85]
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6
        const pointRadius = radius * dataPoints[i]
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

      // Animation frame
      requestAnimationFrame(drawHeroGraphic)
    }

    drawHeroGraphic()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <Card className="overflow-hidden w-full aspect-video md:aspect-square lg:aspect-video relative bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </Card>
  )
}

