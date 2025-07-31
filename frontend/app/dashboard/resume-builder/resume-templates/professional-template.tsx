import type { ResumeData } from "../types"
import { MapPin, Phone, Mail, Linkedin, Github, Link } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TemplateProps {
  data: ResumeData
  activeColor: string
  activeFont: string
}

export function ProfessionalTemplate({ data, activeColor, activeFont }: TemplateProps) {
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
      <div className="grid grid-cols-3">
        <div className={`${colors.bg} text-white p-6 col-span-1`}>
          {data.personal.photo && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white mx-auto mb-6">
              <Image
                src={data.personal.photo || "/placeholder.svg?height=128&width=128"}
                alt={data.personal.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-2 border-b border-white/30 pb-1">CONTACT</h2>
              <div className="space-y-2">
                {data.personal.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{data.personal.location}</span>
                  </div>
                )}
                {data.personal.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{data.personal.phone}</span>
                  </div>
                )}
                {data.personal.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{data.personal.email}</span>
                  </div>
                )}
                {data.personal.linkedin && (
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{data.personal.linkedin}</span>
                  </div>
                )}
                {data.personal.github && (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{data.personal.github}</span>
                  </div>
                )}
              </div>
            </div>

            {data.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2 border-b border-white/30 pb-1">SKILLS</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tools.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2 border-b border-white/30 pb-1">TOOLS</h2>
                <div className="space-y-2">
                  {data.tools.map((tool, index) => (
                    <div key={index} className="text-sm">
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2 border-b border-white/30 pb-1">LANGUAGES</h2>
                <div className="space-y-2">
                  {data.languages.map((language, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm font-medium">{language.name}</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < language.proficiency ? "bg-white" : "bg-white/30"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 p-6">
          <header className="mb-6">
            <h1 className={`text-3xl font-bold ${colors.primary}`}>{data.personal.name}</h1>
            <p className="text-xl text-gray-600">{data.personal.title}</p>
          </header>

          {data.objective && (
            <section className="mb-6">
              <h2 className={`text-lg font-bold mb-2 ${colors.primary} border-b ${colors.border} pb-1`}>OBJECTIVE</h2>
              <p className="text-sm">{data.objective}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-lg font-bold mb-2 ${colors.primary} border-b ${colors.border} pb-1`}>EXPERIENCE</h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{exp.position}</h3>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-1">{exp.location}</p>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-lg font-bold mb-2 ${colors.primary} border-b ${colors.border} pb-1`}>EDUCATION</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <span className="text-sm text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="font-medium">{edu.institution}</p>
                    <p className="text-sm text-gray-600 mb-1">{edu.location}</p>
                    {edu.gpa && <p className="text-sm">CGPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-lg font-bold mb-2 ${colors.primary} border-b ${colors.border} pb-1`}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{cert.title}</h3>
                      <span className="text-sm text-gray-600">{cert.date}</span>
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
              <h2 className={`text-lg font-bold mb-2 ${colors.primary} border-b ${colors.border} pb-1`}>PROJECTS</h2>
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
      </div>
    </div>
  )
}

