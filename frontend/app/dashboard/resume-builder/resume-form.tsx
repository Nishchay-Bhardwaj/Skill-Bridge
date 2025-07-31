"use client"
import { useState } from "react"
import type { ResumeData } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash, Sparkles, Loader2 } from "lucide-react"
import { generateObjective, generateSkills, generateTools } from "./ai-generator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: Partial<ResumeData>) => void
  activeColor: string
  onColorChange: (color: string) => void
}

export function ResumeForm({ data, onChange, activeColor, onColorChange }: ResumeFormProps) {
  const [isGeneratingObjective, setIsGeneratingObjective] = useState(false)
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false)

  const colorOptions = [
    { name: "teal", class: "bg-teal-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "gray", class: "bg-gray-700" },
    { name: "indigo", class: "bg-indigo-600" },
  ]

  const handlePersonalChange = (field: string, value: string) => {
    onChange({
      personal: {
        ...data.personal,
        [field]: value,
      },
    })
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...data.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    onChange({ education: newEducation })
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...data.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    onChange({ experience: newExperience })
  }

  const handleCertificationChange = (index: number, field: string, value: string) => {
    const newCertifications = [...data.certifications]
    newCertifications[index] = { ...newCertifications[index], [field]: value }
    onChange({ certifications: newCertifications })
  }

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...data.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    onChange({ projects: newProjects })
  }

  const handleLanguageChange = (index: number, field: string, value: any) => {
    const newLanguages = [...data.languages]
    newLanguages[index] = {
      ...newLanguages[index],
      [field]: field === "proficiency" ? Number.parseInt(value) : value,
    }
    onChange({ languages: newLanguages })
  }

  const handleSkillsChange = (skills: string) => {
    onChange({ skills: skills.split(",").map((skill) => skill.trim()) })
  }

  const handleToolsChange = (tools: string) => {
    onChange({ tools: tools.split(",").map((tool) => tool.trim()) })
  }

  const handleGenerateObjective = async () => {
    setIsGeneratingObjective(true)
    try {
      const objective = await generateObjective(data)
      onChange({ objective })
    } catch (error) {
      console.error("Error generating objective:", error)
    } finally {
      setIsGeneratingObjective(false)
    }
  }

  const handleGenerateSkills = async () => {
    setIsGeneratingSkills(true)
    try {
      const [skills, tools] = await Promise.all([generateSkills(data), generateTools(data)])
      onChange({ skills, tools })
    } catch (error) {
      console.error("Error generating skills:", error)
    } finally {
      setIsGeneratingSkills(false)
    }
  }

  const addEducation = () => {
    onChange({
      education: [
        ...data.education,
        {
          startDate: "",
          endDate: "",
          degree: "",
          institution: "",
          location: "",
          description: "",
          gpa: "",
        },
      ],
    })
  }

  const removeEducation = (index: number) => {
    const newEducation = [...data.education]
    newEducation.splice(index, 1)
    onChange({ education: newEducation })
  }

  const addExperience = () => {
    onChange({
      experience: [
        ...data.experience,
        {
          startDate: "",
          endDate: "",
          position: "",
          company: "",
          location: "",
          description: "",
        },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const newExperience = [...data.experience]
    newExperience.splice(index, 1)
    onChange({ experience: newExperience })
  }

  const addCertification = () => {
    onChange({
      certifications: [
        ...data.certifications,
        {
          date: "",
          title: "",
          issuer: "",
          score: "",
          description: "",
        },
      ],
    })
  }

  const removeCertification = (index: number) => {
    const newCertifications = [...data.certifications]
    newCertifications.splice(index, 1)
    onChange({ certifications: newCertifications })
  }

  const addProject = () => {
    onChange({
      projects: [
        ...data.projects,
        {
          title: "",
          url: "",
          description: "",
        },
      ],
    })
  }

  const removeProject = (index: number) => {
    const newProjects = [...data.projects]
    newProjects.splice(index, 1)
    onChange({ projects: newProjects })
  }

  const addLanguage = () => {
    onChange({
      languages: [
        ...data.languages,
        {
          name: "",
          proficiency: 3,
        },
      ],
    })
  }

  const removeLanguage = (index: number) => {
    const newLanguages = [...data.languages]
    newLanguages.splice(index, 1)
    onChange({ languages: newLanguages })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={data.personal.name}
                      onChange={(e) => handlePersonalChange("name", e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={data.personal.title}
                      onChange={(e) => handlePersonalChange("title", e.target.value)}
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo URL</Label>
                    <Input
                      id="photo"
                      value={data.personal.photo}
                      onChange={(e) => handlePersonalChange("photo", e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-muted-foreground">Enter a URL to your profile photo</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={data.personal.location}
                      onChange={(e) => handlePersonalChange("location", e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={data.personal.phone}
                      onChange={(e) => handlePersonalChange("phone", e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={data.personal.email}
                      onChange={(e) => handlePersonalChange("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={data.personal.linkedin}
                      onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={data.personal.github}
                      onChange={(e) => handlePersonalChange("github", e.target.value)}
                      placeholder="github.com/yourusername"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="objective">Objective</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleGenerateObjective}
                              disabled={isGeneratingObjective}
                              className="h-8"
                            >
                              {isGeneratingObjective ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Generate with AI
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate a professional objective based on your information</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      id="objective"
                      value={data.objective}
                      onChange={(e) => onChange({ objective: e.target.value })}
                      placeholder="Brief professional summary or career objective"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              {data.education.map((edu, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Education {index + 1}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => removeEducation(index)} className="h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                        <Input
                          id={`edu-start-${index}`}
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                          placeholder="e.g. 2017"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                        <Input
                          id={`edu-end-${index}`}
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                          placeholder="e.g. 2021 or Present"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                      <Input
                        id={`edu-institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        placeholder="e.g. University Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-location-${index}`}>Location</Label>
                      <Input
                        id={`edu-location-${index}`}
                        value={edu.location}
                        onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                        placeholder="e.g. City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-gpa-${index}`}>GPA</Label>
                      <Input
                        id={`edu-gpa-${index}`}
                        value={edu.gpa || ""}
                        onChange={(e) => handleEducationChange(index, "gpa", e.target.value)}
                        placeholder="e.g. 3.8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-description-${index}`}>Description</Label>
                      <Textarea
                        id={`edu-description-${index}`}
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                        placeholder="Relevant coursework, achievements, etc."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addEducation} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              {data.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Experience {index + 1}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => removeExperience(index)} className="h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                        <Input
                          id={`exp-start-${index}`}
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                          placeholder="e.g. Jan 2020"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                        <Input
                          id={`exp-end-${index}`}
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                          placeholder="e.g. Present"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-position-${index}`}>Position</Label>
                      <Input
                        id={`exp-position-${index}`}
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        placeholder="e.g. Software Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-company-${index}`}>Company</Label>
                      <Input
                        id={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        placeholder="e.g. Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-location-${index}`}>Location</Label>
                      <Input
                        id={`exp-location-${index}`}
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                        placeholder="e.g. City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-description-${index}`}>Description</Label>
                      <Textarea
                        id={`exp-description-${index}`}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addExperience} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </TabsContent>

            <TabsContent value="more" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Skills & Tools</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateSkills}
                          disabled={isGeneratingSkills}
                        >
                          {isGeneratingSkills ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Skills & Tools
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate relevant skills and tools based on your professional title</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={data.skills.join(", ")}
                      onChange={(e) => handleSkillsChange(e.target.value)}
                      placeholder="JavaScript, React, Node.js, etc. (comma separated)"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tools">Tools</Label>
                    <Textarea
                      id="tools"
                      value={data.tools.join(", ")}
                      onChange={(e) => handleToolsChange(e.target.value)}
                      placeholder="VS Code, Git, Docker, etc. (comma separated)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="border p-4 rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertification(index)}
                        className="absolute top-2 right-2 h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`cert-date-${index}`}>Date</Label>
                          <Input
                            id={`cert-date-${index}`}
                            value={cert.date}
                            onChange={(e) => handleCertificationChange(index, "date", e.target.value)}
                            placeholder="e.g. 2020"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cert-title-${index}`}>Title</Label>
                          <Input
                            id={`cert-title-${index}`}
                            value={cert.title}
                            onChange={(e) => handleCertificationChange(index, "title", e.target.value)}
                            placeholder="e.g. Web Development Certification"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cert-issuer-${index}`}>Issuer</Label>
                          <Input
                            id={`cert-issuer-${index}`}
                            value={cert.issuer}
                            onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                            placeholder="e.g. Certification Provider"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cert-score-${index}`}>Score</Label>
                          <Input
                            id={`cert-score-${index}`}
                            value={cert.score || ""}
                            onChange={(e) => handleCertificationChange(index, "score", e.target.value)}
                            placeholder="e.g. 90%"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cert-description-${index}`}>Description</Label>
                          <Textarea
                            id={`cert-description-${index}`}
                            value={cert.description}
                            onChange={(e) => handleCertificationChange(index, "description", e.target.value)}
                            placeholder="Brief description of the certification"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addCertification} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Certification
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border p-4 rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProject(index)}
                        className="absolute top-2 right-2 h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`project-title-${index}`}>Title</Label>
                          <Input
                            id={`project-title-${index}`}
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                            placeholder="e.g. E-commerce Website"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-url-${index}`}>URL</Label>
                          <Input
                            id={`project-url-${index}`}
                            value={project.url || ""}
                            onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                            placeholder="e.g. https://project-url.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-description-${index}`}>Description</Label>
                          <Textarea
                            id={`project-description-${index}`}
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                            placeholder="Brief description of the project and your role"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addProject} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.languages.map((language, index) => (
                    <div key={index} className="border p-4 rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(index)}
                        className="absolute top-2 right-2 h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`language-name-${index}`}>Language</Label>
                          <Input
                            id={`language-name-${index}`}
                            value={language.name}
                            onChange={(e) => handleLanguageChange(index, "name", e.target.value)}
                            placeholder="e.g. English"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`language-proficiency-${index}`}>Proficiency (1-5)</Label>
                          <Input
                            id={`language-proficiency-${index}`}
                            type="number"
                            min="1"
                            max="5"
                            value={language.proficiency}
                            onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addLanguage} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Language
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

