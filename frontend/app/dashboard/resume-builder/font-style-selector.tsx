"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FontStyleSelectorProps {
  activeFont: string
  onFontChange: (font: string) => void
}

export function FontStyleSelector({ activeFont, onFontChange }: FontStyleSelectorProps) {
  const fonts = [
    {
      id: "inter",
      name: "Inter",
      description: "Modern & Clean",
      className: "font-sans",
    },
    {
      id: "serif",
      name: "Serif",
      description: "Traditional & Professional",
      className: "font-serif",
    },
    {
      id: "mono",
      name: "Monospace",
      description: "Technical & Precise",
      className: "font-mono",
    },
    {
      id: "heading",
      name: "Display",
      description: "Bold & Creative",
      className: "font-heading",
    },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={activeFont} onValueChange={onFontChange} className="grid grid-cols-2 gap-4">
        {fonts.map((font) => (
          <div key={font.id} className="flex items-center space-x-2">
            <RadioGroupItem value={font.id} id={`font-${font.id}`} />
            <Label htmlFor={`font-${font.id}`} className={`${font.className} cursor-pointer`}>
              <span className="block text-base">{font.name}</span>
              <span className="block text-xs text-muted-foreground">{font.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

