import type { ResumeData } from "../types"
import { cn } from "@/lib/utils"

interface TemplateProps {
  data: ResumeData
  activeColor: string
  activeFont: string
}

export function SimpleTemplate({ data, activeColor, activeFont }: TemplateProps) {
  const colorClasses = {
    teal: {
      primary: "text-teal-600",
      border: "border-teal-600",
    },
    blue: {
      primary: "text-blue-600",
      border: "border-blue-600",
    },
    gray: {
      primary: "text-gray-700",
      border: "border-gray-700",
    },
    indigo: {
      primary: "text-indigo-600",
      border: "border-indigo-600",
    },
  }

  const fontClasses = {
    inter: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    heading: "font-heading",
  }

  const colors = colorClasses[activeColor as keyof typeof colorClasses]
  const fontClass = fontClasses[activeFont as keyof typeof fontClasses] || "font-sans"

  return (
    <div className={cn("bg-white text-black p-8 shadow-lg max-w-[800px] mx-auto resume-preview", fontClass)}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {data.personal.name}, {data.personal.title}
        </h1>
        <p className="text-sm text-gray-600">
          {data.personal.location} • {data.personal.phone} • {data.personal.email}
        </p>
      </header>

      {/* Profile */}
      {data.objective && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3 pb-1 border-b">PROFILE</h2>
          <p className="text-sm">{data.objective}</p>
        </section>
      )}

      {/* Employment History */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3 pb-1 border-b">EMPLOYMENT HISTORY</h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="font-semibold">{exp.position}, </span>
                    <span>{exp.company}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm">{exp.location}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {exp.startDate} – {exp.endDate}
                </div>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  {exp.description.split("\n").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3 pb-1 border-b">EDUCATION</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="font-semibold">{edu.degree}</span>
                    <span>, {edu.institution}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm">{edu.location}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {edu.startDate} – {edu.endDate}
                </div>
                {edu.gpa && <p className="text-sm">• Graduated with GPA: {edu.gpa}</p>}
                {edu.description && <p className="text-sm">• {edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(data.skills.length > 0 || data.tools.length > 0) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3 pb-1 border-b">SKILLS</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Technical Skills</h3>
                <p className="text-sm">{data.skills.join(", ")}</p>
              </div>
            )}
            {data.tools.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tools & Technologies</h3>
                <p className="text-sm">{data.tools.join(", ")}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* References */}
      {data.certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase mb-3 pb-1 border-b">REFERENCES</h2>
          <div className="grid grid-cols-2 gap-6">
            {data.certifications.slice(0, 3).map((cert, index) => (
              <div key={index} className="text-sm">
                <p className="font-semibold">{cert.title}</p>
                <p>{cert.issuer}</p>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

