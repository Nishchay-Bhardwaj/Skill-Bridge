"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  activeTemplate: string
  onTemplateChange: (template: string) => void
}

export function TemplateSelector({ activeTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    {
      id: "simple",
      name: "Simple",
      description: "For Accountants & Finance",
      color: "bg-gradient-to-br from-gray-100 to-gray-300",
      accent: "bg-gray-800",
    },
    {
      id: "classic",
      name: "Classic",
      description: "For Freshers",
      color: "bg-gradient-to-br from-blue-50 to-blue-200",
      accent: "bg-blue-600",
    },
    {
      id: "modern",
      name: "Modern",
      description: "For Mobile Developer",
      color: "bg-gradient-to-br from-teal-100 to-teal-300",
      accent: "bg-teal-600",
    },
    {
      id: "professional",
      name: "Professional",
      description: "For Web Developer",
      color: "bg-gradient-to-br from-indigo-100 to-indigo-300",
      accent: "bg-indigo-700",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "For Software Engineer",
      color: "bg-gradient-to-br from-amber-50 to-amber-200",
      accent: "bg-amber-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all hover:border-primary",
            activeTemplate === template.id ? "border-2 border-primary" : "",
          )}
          onClick={() => onTemplateChange(template.id)}
        >
          <CardContent className="p-3">
            <div className="aspect-[4/3] relative mb-2 overflow-hidden rounded-md border">
              <div className={`absolute inset-0 ${template.color}`}>
                {/* Template preview with colored boxes instead of images */}
                <div className="absolute inset-x-0 top-0 h-1/4 flex items-center justify-center">
                  <div className={`w-1/2 h-4 ${template.accent} rounded-full opacity-70`}></div>
                </div>
                <div className="absolute inset-x-0 top-1/4 h-1/6 flex items-center justify-center">
                  <div className={`w-3/4 h-2 ${template.accent} rounded-full opacity-40`}></div>
                </div>
                <div className="absolute inset-x-0 top-1/3 bottom-0 flex flex-col gap-1 p-2">
                  <div className={`w-full h-2 ${template.accent} rounded-full opacity-30`}></div>
                  <div className={`w-full h-2 ${template.accent} rounded-full opacity-30`}></div>
                  <div className={`w-3/4 h-2 ${template.accent} rounded-full opacity-30`}></div>
                  <div className={`w-1/2 h-2 ${template.accent} rounded-full opacity-30`}></div>
                </div>
              </div>
            </div>
            <h3 className="font-medium text-center">{template.name}</h3>
            <p className="text-xs text-center text-muted-foreground">{template.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

