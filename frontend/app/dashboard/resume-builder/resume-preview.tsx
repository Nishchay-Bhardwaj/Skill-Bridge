import type { ResumeData } from "./types"
import { ClassicTemplate } from "./resume-templates/classic-template"
import { ModernTemplate } from "./resume-templates/modern-template"
import { ProfessionalTemplate } from "./resume-templates/professional-template"
import {MinimalTemplate } from "./resume-templates/minimal-template"
import { SimpleTemplate } from "./resume-templates/simple-template"

interface ResumePreviewProps {
  data: ResumeData
  activeColor: string
  activeTemplate: string
  activeFont: string
}

export function ResumePreview({ data, activeColor, activeTemplate, activeFont }: ResumePreviewProps) {
  switch (activeTemplate) {
    case "simple":
      return <SimpleTemplate data={data} activeColor={activeColor} activeFont={activeFont} />
    case "modern":
      return <ModernTemplate data={data} activeColor={activeColor} activeFont={activeFont} />
    case "professional":
      return <ProfessionalTemplate data={data} activeColor={activeColor} activeFont={activeFont} />
    case "minimal":
      return <MinimalTemplate data={data} activeColor={activeColor} activeFont={activeFont} />
    case "classic":
    default:
      return <ClassicTemplate data={data} activeColor={activeColor} activeFont={activeFont} />
  }
}

