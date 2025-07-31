import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface FeatureHighlightProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}

export default function FeatureHighlight({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureHighlightProps) {
  return (
    <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}>
      <div className="lg:w-1/2 space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="relative group inline-block">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <Button
            variant="outline"
            className="relative gap-2 bg-white/70 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 hover:scale-105 group-hover:border-primary/30"
          >
            Learn More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      <div className="lg:w-1/2 group">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-blue-600/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative overflow-hidden rounded-lg shadow-xl bg-white/50 backdrop-blur-sm border border-white/50 p-1 group-hover:scale-[1.02] transition-all duration-500">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-700 rounded-lg group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

