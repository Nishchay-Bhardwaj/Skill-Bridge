import type { ResumeData } from "../types"
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Link,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TemplateProps {
  data: ResumeData
  activeColor: string
  activeFont: string
}

export function ClassicTemplate({ data, activeColor, activeFont }: TemplateProps) {
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
      <header className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          {data.personal.photo && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={data.personal.photo || "/placeholder.svg?height=96&width=96"}
                alt={data.personal.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <h1 className={`text-3xl font-bold ${colors.primary}`}>{data.personal.name}</h1>
            <p className="text-xl text-gray-600">{data.personal.title}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {data.personal.location && (
            <div className="flex items-center gap-1 text-sm">
              <MapPin className={`h-4 w-4 ${colors.primary}`} />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-1 text-sm">
              <Phone className={`h-4 w-4 ${colors.primary}`} />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.email && (
            <div className="flex items-center gap-1 text-sm">
              <Mail className={`h-4 w-4 ${colors.primary}`} />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div className="flex items-center gap-1 text-sm">
              <Linkedin className={`h-4 w-4 ${colors.primary}`} />
              <span>{data.personal.linkedin}</span>
            </div>
          )}
          {data.personal.github && (
            <div className="flex items-center gap-1 text-sm">
              <Github className={`h-4 w-4 ${colors.primary}`} />
              <span>{data.personal.github}</span>
            </div>
          )}
        </div>
      </header>

      {data.objective && (
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${colors.primary}`}>
            <Award className="h-5 w-5" /> Objective
          </h2>
          <p className="text-sm">{data.objective}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${colors.primary}`}>
            <GraduationCap className="h-5 w-5" /> Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr] gap-x-4">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  {edu.startDate} - {edu.endDate}
                </div>
                <div>
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.location}</p>
                  {edu.gpa && <p className="text-sm">CGPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${colors.primary}`}>
            <Briefcase className="h-5 w-5" /> Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr] gap-x-4">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  {exp.startDate} - {exp.endDate}
                </div>
                <div>
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-sm">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.location}</p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(data.skills.length > 0 || data.tools.length > 0) && (
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 ${colors.primary}`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className={`px-2 py-1 text-xs rounded ${colors.bg} text-white`}>
                {skill}
              </span>
            ))}
          </div>

          {data.tools.length > 0 && (
            <>
              <h3 className={`text-md font-medium mt-3 mb-2 ${colors.primary}`}>Tools</h3>
              <div className="flex flex-wrap gap-2">
                {data.tools.map((tool, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded border ${colors.border} text-gray-800`}>
                    {tool}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${colors.primary}`}>
            <Award className="h-5 w-5" /> Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr] gap-x-4">
                <div className="text-sm text-gray-600 whitespace-nowrap flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {cert.date}
                </div>
                <div>
                  <h3 className="font-medium">{cert.title}</h3>
                  <p className="text-sm">{cert.issuer}</p>
                  {cert.score && <p className="text-sm">Score: {cert.score}</p>}
                  {cert.description && <p className="text-sm text-gray-600">{cert.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${colors.primary}`}>
            <Globe className="h-5 w-5" /> Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{project.title}</h3>
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

      {data.languages.length > 0 && (
        <section>
          <h2 className={`text-lg font-semibold mb-2 ${colors.primary}`}>Languages</h2>
          <div className="space-y-2">
            {data.languages.map((language, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium text-sm">{language.name}</span>
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
  )
}

