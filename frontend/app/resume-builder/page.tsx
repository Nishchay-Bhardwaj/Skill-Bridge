"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, ArrowLeft, Download, FileCheck , Eye, Save } from "lucide-react"
import Link from "next/link"
import ResumeTemplateCard from "@/components/resume-template-card"
import ResumeEditor from "@/components/resume-editor"
import { useToast } from "@/components/ui/use-toast"

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const templates = [
    {
      id: "professional",
      title: "Professional",
      description: "Elegant and minimal design suitable for corporate roles",
      imageSrc: "/placeholder.svg?height=200&width=150",
    },
    {
      id: "creative",
      title: "Creative",
      description: "Modern layout with visual elements for creative fields",
      imageSrc: "/placeholder.svg?height=200&width=150",
    },
    {
      id: "technical",
      title: "Technical",
      description: "Structured format emphasizing technical skills and projects",
      imageSrc: "/placeholder.svg?height=200&width=150",
    },
    {
      id: "simple",
      title: "Simple",
      description: "Clean and straightforward design for all industries",
      imageSrc: "/placeholder.svg?height=200&width=150",
    },
  ]

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    toast({
      title: "Template Selected",
      description: `You've selected the ${templates.find((t) => t.id === templateId)?.title} template.`,
    })
  }

  const handleSave = () => {
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully!",
    })
  }

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Viewing your resume in preview mode.",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Resume Downloaded",
      description: "Your resume has been downloaded as a PDF.",
    })
  }

  const handleUpload = () => {
    setIsUploading(true)

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false)
      setActiveTab("create")
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been uploaded and is ready for editing.",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handlePreview}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button size="sm" className="gap-1" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Resume Builder</h1>
            <p className="text-muted-foreground">Create a professional resume in minutes with AI assistance</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="create" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" /> Create New
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex gap-2 items-center">
                <Upload className="h-4 w-4" /> Upload Existing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose a Template</CardTitle>
                  <CardDescription>Select a template to get started with your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                      <ResumeTemplateCard
                        key={template.id}
                        title={template.title}
                        description={template.description}
                        imageSrc={template.imageSrc}
                        isSelected={selectedTemplate === template.id}
                        onSelect={() => handleTemplateSelect(template.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Editor</CardTitle>
                  <CardDescription>Build your resume with AI assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeEditor />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                  <CardDescription>Upload an existing resume for analysis and optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Drag & drop your resume</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Supported formats: PDF, DOCX, TXT</p>
                      <div className="mt-6">
                        <Button size="sm" onClick={handleUpload} disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                              Uploading...
                            </>
                          ) : (
                            "Browse Files"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

