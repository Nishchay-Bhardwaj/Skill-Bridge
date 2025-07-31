import type { ResumeData } from "../types"
import { MapPin, Phone, Mail, Linkedin, Github, Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemplateProps {
  data: ResumeData
  activeColor: string
  activeFont: string
}

export function MinimalTemplate({ data, activeColor, activeFont }: TemplateProps) {
  const colorClasses = {
    teal: {
      primary: "text-teal-600",
      bg: "bg-teal-600",
      border: "border-teal-600",
    },
    blue: {
      primary: "text-blue-600",
      bg: "bg-blue-600",
      border: "border-blue-600",
    },
    gray: {
      primary: "text-gray-700",
      bg: "bg-gray-700",
      border: "border-gray-700",
    },
    indigo: {
      primary: "text-indigo-600",
      bg: "bg-indigo-600",
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
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-1">{data.personal.name}</h1>
        <p className={`text-xl ${colors.primary} mb-4`}>{data.personal.title}</p>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {data.personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span>{data.personal.linkedin}</span>
            </div>
          )}
          {data.personal.github && (
            <div className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              <span>{data.personal.github}</span>
            </div>
          )}
        </div>
      </header>

      {data.objective && (
        <section className="mb-6">
          <p className="text-center">{data.objective}</p>
        </section>
      )}

      <div className={`w-full h-0.5 ${colors.bg} mb-6`}></div>

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold mb-3 ${colors.primary}`}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="font-medium">{exp.company}</p>
                  <p className="text-sm">{exp.location}</p>
                </div>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold mb-3 ${colors.primary}`}>Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="font-medium">{edu.institution}</p>
                  <p className="text-sm">{edu.location}</p>
                </div>
                {edu.gpa && <p className="text-sm">CGPA: {edu.gpa}</p>}
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data.skills.length > 0 || data.tools.length > 0) && (
          <section className="mb-6">
            <h2 className={`text-lg font-bold mb-3 ${colors.primary}`}>Skills & Tools</h2>
            {data.skills.length > 0 && (
              <div className="mb-3">
                <h3 className="font-medium mb-1">Skills</h3>
                <p className="text-sm">{data.skills.join(", ")}</p>
              </div>
            )}

            {data.tools.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Tools</h3>
                <p className="text-sm">{data.tools.join(", ")}</p>
              </div>
            )}
          </section>
        )}

        {data.languages.length > 0 && (
          <section className="mb-6">
            <h2 className={`text-lg font-bold mb-3 ${colors.primary}`}>Languages</h2>
            <div className="space-y-2">
              {data.languages.map((language, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{language.name}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < language.proficiency ? colors.bg : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold mb-3 ${colors.primary}`}>Certifications</h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{cert.title}</h3>
                  <span className="text-sm">{cert.date}</span>
                </div>
                <p className="font-medium">{cert.issuer}</p>
                {cert.score && <p className="text-sm">Score: {cert.score}</p>}
                {cert.description && <p className="text-sm">{cert.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section>
          <h2 className={`text-lg font-bold mb-3 ${colors.primary}`}>Projects</h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{project.title}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center ${colors.primary}`}
                    >
                      <Link className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

