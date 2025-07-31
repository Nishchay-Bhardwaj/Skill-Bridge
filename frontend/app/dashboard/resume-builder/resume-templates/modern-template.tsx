import type { ResumeData } from "../types"
import { MapPin, Phone, Mail, Linkedin, Github, Link } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TemplateProps {
  data: ResumeData
  activeColor: string
  activeFont: string
}

export function ModernTemplate({ data, activeColor, activeFont }: TemplateProps) {
  const colorClasses = {
    teal: {
      primary: "text-teal-600",
      bg: "bg-teal-600",
      border: "border-teal-600",
      light: "bg-teal-50",
    },
    blue: {
      primary: "text-blue-600",
      bg: "bg-blue-600",
      border: "border-blue-600",
      light: "bg-blue-50",
    },
    gray: {
      primary: "text-gray-700",
      bg: "bg-gray-700",
      border: "border-gray-700",
      light: "bg-gray-50",
    },
    indigo: {
      primary: "text-indigo-600",
      bg: "bg-indigo-600",
      border: "border-indigo-600",
      light: "bg-indigo-50",
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
    <div className={cn("bg-white text-black shadow-lg max-w-[800px] mx-auto resume-preview", fontClass)}>
      <div className={`${colors.bg} text-white p-8`}>
        <div className="flex items-center gap-6">
          {data.personal.photo && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={data.personal.photo || "/placeholder.svg?height=96&width=96"}
                alt={data.personal.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{data.personal.name}</h1>
            <p className="text-xl opacity-90">{data.personal.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {data.personal.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-5 w-5" />
              <span>{data.personal.linkedin}</span>
            </div>
          )}
          {data.personal.github && (
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <span>{data.personal.github}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {data.objective && (
          <section className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>OBJECTIVE</h2>
            <p>{data.objective}</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {data.experience.length > 0 && (
              <section className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>WORK EXPERIENCE</h2>
                <div className="space-y-4">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="font-bold">{exp.position}</h3>
                      <div className="flex justify-between">
                        <p className="font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{exp.location}</p>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects.length > 0 && (
              <section className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>PROJECTS</h2>
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

          <div>
            {data.education.length > 0 && (
              <section className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>EDUCATION</h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold">{edu.degree}</h3>
                      <div className="flex justify-between">
                        <p className="font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-600">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{edu.location}</p>
                      {edu.gpa && <p className="text-sm">CGPA: {edu.gpa}</p>}
                      {edu.description && <p className="text-sm">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(data.skills.length > 0 || data.tools.length > 0) && (
              <section className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>SKILLS & COMPETENCIES</h2>
                {data.skills.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-sm rounded-full ${colors.light} ${colors.primary}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.tools.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.tools.map((tool, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-sm rounded-full border ${colors.border} ${colors.primary}`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {data.certifications.length > 0 && (
              <section className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>CERTIFICATIONS</h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div key={index}>
                      <h3 className="font-bold">{cert.title}</h3>
                      <div className="flex justify-between">
                        <p className="font-medium">{cert.issuer}</p>
                        <p className="text-sm text-gray-600">{cert.date}</p>
                      </div>
                      {cert.score && <p className="text-sm">Score: {cert.score}</p>}
                      {cert.description && <p className="text-sm">{cert.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.languages.length > 0 && (
              <section>
                <h2 className={`text-lg font-semibold mb-3 pb-2 border-b-2 ${colors.border}`}>LANGUAGES</h2>
                <div className="space-y-2">
                  {data.languages.map((language, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{language.name}</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${i < language.proficiency ? colors.bg : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

