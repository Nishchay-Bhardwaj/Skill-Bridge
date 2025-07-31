"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { Check } from "lucide-react"

interface ResumeTemplateCardProps {
  title: string
  description: string
  imageSrc: string
  onSelect?: () => void
  isSelected?: boolean
}

export default function ResumeTemplateCard({
  title,
  description,
  imageSrc,
  onSelect,
  isSelected = false,
}: ResumeTemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Card
      className={`overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-2 relative">
        <div className="rounded-md overflow-hidden bg-muted relative aspect-[3/4]">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={`${title} template`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-primary text-white rounded-full p-2">
                <Check className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-4 flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <Button size="sm" className={`w-full ${isSelected ? "bg-primary/80" : ""}`} onClick={onSelect}>
          {isSelected ? "Selected" : "Use Template"}
        </Button>
      </CardContent>
    </Card>
  )
}

