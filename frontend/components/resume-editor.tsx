"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, Trash2, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  description: z.string(),
  current: z.boolean().optional(),
})

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institution: z.string().min(1, "Institution name is required"),
  graduationYear: z.string().min(1, "Graduation year is required"),
})

const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().min(10, "Please provide a summary of at least 10 characters"),
  experiences: z.array(experienceSchema),
  educations: z.array(educationSchema),
  skills: z.object({
    technical: z.string(),
    soft: z.string(),
  }),
})

type ResumeFormValues = z.infer<typeof resumeSchema>

export default function ResumeEditor() {
  const [activeTab, setActiveTab] = useState("edit")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      experiences: [
        {
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
          current: false,
        },
      ],
      educations: [
        {
          degree: "",
          fieldOfStudy: "",
          institution: "",
          graduationYear: "",
        },
      ],
      skills: {
        technical: "",
        soft: "",
      },
    },
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = form.useFieldArray({
    name: "experiences",
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = form.useFieldArray({
    name: "educations",
  })

  const addExperience = () => {
    appendExperience({
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    })
  }

  const addEducation = () => {
    appendEducation({
      degree: "",
      fieldOfStudy: "",
      institution: "",
      graduationYear: "",
    })
  }

  const generateWithAI = (field: string) => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      if (field === "summary") {
        form.setValue(
          "summary",
          "Experienced software developer with over 5 years of expertise in building scalable web applications. Proficient in JavaScript, React, and Node.js. Passionate about clean code and user experience. Demonstrated ability to lead teams and deliver projects on time and within budget.",
        )
      } else if (field === "jobTitle") {
        form.setValue("jobTitle", "Senior Full Stack Developer")
      } else if (field === "experience") {
        const currentExperiences = form.getValues("experiences")
        if (currentExperiences.length > 0) {
          const index = currentExperiences.length - 1
          form.setValue(
            `experiences.${index}.description`,
            "Led the development of a customer-facing dashboard that increased user engagement by 40%. Implemented new features that improved application performance by 25%. Mentored junior developers and implemented code review processes that improved code quality and reduced bugs by 30%.",
          )
        }
      } else if (field === "technicalSkills") {
        form.setValue(
          "skills.technical",
          "JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, PostgreSQL, GraphQL, REST APIs, Git, AWS, Docker, CI/CD, Jest, React Testing Library",
        )
      } else if (field === "softSkills") {
        form.setValue(
          "skills.soft",
          "Communication, Problem Solving, Team Leadership, Time Management, Adaptability, Critical Thinking, Collaboration, Creativity, Attention to Detail, Conflict Resolution",
        )
      }

      setIsGenerating(false)
      toast({
        title: "AI Generation Complete",
        description: "Content has been generated successfully!",
      })
    }, 1500)
  }

  const onSubmit = (data: ResumeFormValues) => {
    console.log(data)
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully!",
    })

    // Switch to preview tab after saving
    setActiveTab("preview")
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full md:w-[400px] grid grid-cols-2">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Accordion type="multiple" defaultValue={["personal-info", "experience"]} className="space-y-4">
                {/* Personal Information */}
                <AccordionItem value="personal-info" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4">Personal Information</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input placeholder="Software Engineer" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="shrink-0"
                                title="Generate suggestions"
                                onClick={() => generateWithAI("jobTitle")}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                  <Sparkles className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Summary</FormLabel>
                          <div className="flex flex-col gap-2">
                            <FormControl>
                              <Textarea
                                placeholder="Experienced software engineer with expertise in..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => generateWithAI("summary")}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" />
                                ) : (
                                  <Sparkles className="h-3 w-3" />
                                )}
                                AI Generate
                              </Button>
                            </div>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Work Experience */}
                <AccordionItem value="experience" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4">Work Experience</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-6">
                    {experienceFields.map((field, index) => (
                      <div key={field.id} className="space-y-4 pb-6 border-b last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Experience {index + 1}</h4>
                          {experienceFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeExperience(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.jobTitle`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Senior Developer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`experiences.${index}.company`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tech Solutions Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`experiences.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YYYY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name={`experiences.${index}.current`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                                  <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Current Position</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />

                            {!form.watch(`experiences.${index}.current`) && (
                              <FormField
                                control={form.control}
                                name={`experiences.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YYYY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>

                          <FormField
                            control={form.control}
                            name={`experiences.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Description</FormLabel>
                                <div className="flex flex-col gap-2">
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe your responsibilities, achievements, and skills used..."
                                      className="min-h-[100px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <div className="flex justify-end">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => generateWithAI("experience")}
                                      disabled={isGenerating}
                                    >
                                      {isGenerating ? (
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" />
                                      ) : (
                                        <Sparkles className="h-3 w-3" />
                                      )}
                                      Improve with AI
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addExperience} className="w-full gap-1">
                      <Plus className="h-4 w-4" /> Add Another Experience
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4">Education</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-6">
                    {educationFields.map((field, index) => (
                      <div key={field.id} className="space-y-4 pb-6 border-b last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Education {index + 1}</h4>
                          {educationFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeEducation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`educations.${index}.degree`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                  <Input placeholder="Bachelor of Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`educations.${index}.fieldOfStudy`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field of Study</FormLabel>
                                <FormControl>
                                  <Input placeholder="Computer Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`educations.${index}.institution`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl>
                                  <Input placeholder="University Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`educations.${index}.graduationYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Graduation Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="YYYY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addEducation} className="w-full gap-1">
                      <Plus className="h-4 w-4" /> Add Another Education
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Skills */}
                <AccordionItem value="skills" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4">Skills</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                    <FormField
                      control={form.control}
                      name="skills.technical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Skills</FormLabel>
                          <div className="flex flex-col gap-2">
                            <FormControl>
                              <Textarea
                                placeholder="JavaScript, React, Node.js, SQL, Git, AWS..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <div className="flex justify-end mt-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => generateWithAI("technicalSkills")}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" />
                                ) : (
                                  <Sparkles className="h-3 w-3" />
                                )}
                                Suggest Skills
                              </Button>
                            </div>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="skills.soft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soft Skills</FormLabel>
                          <div className="flex flex-col gap-2">
                            <FormControl>
                              <Textarea
                                placeholder="Communication, Problem Solving, Team Leadership..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <div className="flex justify-end mt-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => generateWithAI("softSkills")}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" />
                                ) : (
                                  <Sparkles className="h-3 w-3" />
                                )}
                                Suggest Skills
                              </Button>
                            </div>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-6 flex justify-end">
                <Button type="submit" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                  <Check className="h-4 w-4" /> Save Resume
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="preview" className="border rounded-lg p-4">
          <div className="bg-white p-8 rounded-lg shadow-sm mx-auto max-w-2xl min-h-[500px]">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold">{form.watch("fullName") || "John Doe"}</h2>
              <p className="text-muted-foreground">{form.watch("jobTitle") || "Software Developer"}</p>
              <div className="flex flex-wrap gap-2 text-sm mt-2">
                <span>{form.watch("email") || "john.doe@example.com"}</span>
                {form.watch("phone") && (
                  <>
                    <span>•</span>
                    <span>{form.watch("phone")}</span>
                  </>
                )}
                {form.watch("location") && (
                  <>
                    <span>•</span>
                    <span>{form.watch("location")}</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Professional Summary</h3>
              <p className="text-sm">
                {form.watch("summary") ||
                  "Experienced software developer with over 5 years of expertise in building scalable web applications. Proficient in JavaScript, React, and Node.js. Passionate about clean code and user experience."}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Work Experience</h3>
              <div className="space-y-3">
                {form.watch("experiences").map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <p className="font-medium">{exp.jobTitle || "Position Title"}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate || "Start Date"} - {exp.current ? "Present" : exp.endDate || "End Date"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.company || "Company Name"}</p>
                    <p className="text-sm mt-1">
                      {exp.description || "Job description and achievements will appear here."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Education</h3>
              <div className="space-y-3">
                {form.watch("educations").map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {edu.degree || "Degree"}, {edu.fieldOfStudy || "Field of Study"}
                      </p>
                      <p className="text-sm text-muted-foreground">{edu.graduationYear || "Year"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{edu.institution || "Institution Name"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Technical Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(form.watch("skills.technical") || "JavaScript, React, Node.js, SQL, Git, AWS")
                      .split(",")
                      .map((skill, i) => (
                        <span key={i} className="bg-muted px-2 py-1 rounded-md text-xs">
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Soft Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(form.watch("skills.soft") || "Communication, Problem Solving, Team Leadership")
                      .split(",")
                      .map((skill, i) => (
                        <span key={i} className="bg-muted px-2 py-1 rounded-md text-xs">
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

