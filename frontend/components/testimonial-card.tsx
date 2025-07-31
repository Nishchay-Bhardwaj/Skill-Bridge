import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export default function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-blue-600/10 opacity-0 group-hover:opacity-100 rounded-xl blur-xl transition duration-500"></div>
      <Card className="h-full flex flex-col bg-white/70 backdrop-blur-sm border border-slate-200/70 hover:shadow-xl hover:shadow-blue-100 hover:border-primary/10 transition-all duration-500 hover:-translate-y-1 relative z-20">
        <CardContent className="pt-6 flex-1 relative">
          <div className="absolute top-4 left-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-6">
            <Quote className="h-24 w-24 text-primary" />
          </div>
          <Quote className="h-8 w-8 text-primary/70 mb-4 transition-transform duration-300 transform group-hover:scale-110" />
          <p className="text-muted-foreground relative z-10">"{quote}"</p>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col items-start bg-gradient-to-r from-primary/5 to-blue-500/5">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

