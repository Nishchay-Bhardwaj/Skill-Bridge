"use client"

import { Check } from "lucide-react"

interface ResumeTemplatePreviewProps {
  templateId: string
  color: string
  isSelected: boolean
}

export default function ResumeTemplatePreview({ templateId, color, isSelected }: ResumeTemplatePreviewProps) {
  // Different layout previews based on template type
  const renderPreview = () => {
    switch (templateId) {
      case "professional":
        return (
          <div className="w-full h-full p-2">
            <div className={`w-full h-6 bg-blue-200 mb-2 rounded`}></div>
            <div className="space-y-1">
              <div className={`w-3/4 h-2 bg-blue-100 rounded`}></div>
              <div className={`w-1/2 h-2 bg-blue-100 rounded`}></div>
            </div>
            <div className="mt-3 space-y-1">
              <div className={`w-full h-1.5 bg-blue-100 rounded`}></div>
              <div className={`w-full h-1.5 bg-blue-100 rounded`}></div>
              <div className={`w-3/4 h-1.5 bg-blue-100 rounded`}></div>
            </div>
            <div className="mt-3 space-y-1">
              <div className={`w-full h-1.5 bg-blue-100 rounded`}></div>
              <div className={`w-full h-1.5 bg-blue-100 rounded`}></div>
            </div>
          </div>
        )

      case "creative":
        return (
          <div className="w-full h-full p-2 flex">
            <div className="w-1/3 bg-purple-200 h-full mr-1 flex flex-col">
              <div className="w-8 h-8 rounded-full bg-purple-300 mt-1 mb-2"></div>
              <div className="space-y-1">
                <div className="w-full h-1 bg-purple-300 rounded"></div>
                <div className="w-full h-1 bg-purple-300 rounded"></div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="w-full h-1 bg-purple-300 rounded"></div>
                <div className="w-full h-1 bg-purple-300 rounded"></div>
              </div>
            </div>
            <div className="w-2/3 flex flex-col">
              <div className="w-full h-2 bg-purple-100 rounded mb-2"></div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-purple-100 rounded"></div>
                <div className="w-full h-1.5 bg-purple-100 rounded"></div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="w-full h-1.5 bg-purple-100 rounded"></div>
                <div className="w-full h-1.5 bg-purple-100 rounded"></div>
              </div>
            </div>
          </div>
        )

      case "technical":
        return (
          <div className="w-full h-full p-2">
            <div className="flex justify-between mb-2">
              <div className="w-1/2 h-3 bg-green-200 rounded"></div>
              <div className="w-1/3 h-3 bg-green-100 rounded"></div>
            </div>
            <div className="w-full h-8 bg-green-100 rounded mb-2"></div>
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div className="h-2 bg-green-200 rounded"></div>
              <div className="h-2 bg-green-200 rounded"></div>
              <div className="h-2 bg-green-200 rounded"></div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="w-full h-1.5 bg-green-100 rounded"></div>
              <div className="w-full h-1.5 bg-green-100 rounded"></div>
              <div className="w-3/4 h-1.5 bg-green-100 rounded"></div>
            </div>
          </div>
        )

      case "executive":
        return (
          <div className="w-full h-full p-2">
            <div className="w-full text-center mb-2">
              <div className="w-3/4 h-3 bg-gray-300 rounded mx-auto"></div>
              <div className="w-1/2 h-2 bg-gray-200 rounded mx-auto mt-1"></div>
            </div>
            <div className="w-full h-6 bg-gray-100 rounded mb-2"></div>
            <div className="space-y-1 mb-2">
              <div className="flex justify-between items-center">
                <div className="w-1/3 h-2 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-2 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded"></div>
              <div className="w-full h-1.5 bg-gray-100 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                <div className="w-full h-1.5 bg-gray-100 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                <div className="w-full h-1.5 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        )

      case "minimal":
        return (
          <div className="w-full h-full p-2">
            <div className="mb-2">
              <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
              <div className="w-1/3 h-2 bg-gray-200 rounded mt-1"></div>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded mb-3"></div>
            <div className="space-y-1 mb-2">
              <div className="w-full h-1.5 bg-gray-200 rounded"></div>
              <div className="w-full h-1.5 bg-gray-100 rounded"></div>
              <div className="w-3/4 h-1.5 bg-gray-100 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <div className="w-1/4 h-2 bg-gray-200 rounded"></div>
              <div className="w-1/4 h-2 bg-gray-200 rounded"></div>
              <div className="w-1/4 h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full h-full p-2">
            <div className={`w-full h-6 bg-${color}-200 mb-2 rounded`}></div>
            <div className="space-y-1">
              <div className={`w-3/4 h-2 bg-${color}-100 rounded`}></div>
              <div className={`w-1/2 h-2 bg-${color}-100 rounded`}></div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative">
      {renderPreview()}
      {isSelected && (
        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
          <div className="bg-primary text-white rounded-full p-2">
            <Check className="h-6 w-6" />
          </div>
        </div>
      )}
    </div>
  )
}

