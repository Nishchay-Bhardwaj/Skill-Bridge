"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
interface ResumeData {
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  education: string[]
  skills: string[]
  workExperience: string[]
  rawText: string
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { userEmail } = useAuth()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
  
    if (!userEmail) {
      setError("Authentication required");
      toast({
        title: "Login required",
        description: "Please login before uploading",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setIsUploading(true);
      setError(null);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userEmail", userEmail);
  
      // First API call for resume parsing
      const parseResponse = await fetch("http://localhost:5001/api/resume-parser", {
        method: "POST",
        body: formData,
      });
  
      if (!parseResponse.ok) throw new Error("Resume parsing failed");
  
      setIsProcessing(true);
      const parseResult = await parseResponse.json();
      setResumeData(parseResult.data);
  
      // Second API call for pie chart generation
      const chartResponse = await fetch("http://localhost:5001/api/generate-resume-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: parseResult.data,
          userEmail: userEmail,
        }),
      });
  
      if (!chartResponse.ok) throw new Error("Chart generation failed");
  
      const chartResult = await chartResponse.json();
  
      toast({
        title: "Resume processed",
        description: "Your resume has been analyzed and chart generated",
      });
  
      // Redirect to overview page with the chart data
      // You'll need to implement this based on your routing setup
      // router.push(`/overview?chartData=${encodeURIComponent(JSON.stringify(chartResult))}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      toast({
        title: "Error",
        description: "Failed to process resume",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl">Resume Upload & Analysis</CardTitle>
          <CardDescription>Upload your resume to automatically extract key information using AI</CardDescription>
        </CardHeader>
        <CardContent>
          {!resumeData ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <div className="mb-4">
                <Upload size={40} className="text-gray-400" />
              </div>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX or TXT (Max 10MB)</p>

              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />

              <div className="mt-6 flex flex-col gap-4 w-full max-w-xs">
                <Button
                  onClick={() => document.getElementById("resume-upload")?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" /> Select File
                </Button>

                {file && (
                  <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm truncate max-w-[180px]">{file.name}</span>
                    </div>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading || isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all shadow-md hover:shadow-lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" /> Upload & Analyze
                    </>
                  )}
                </Button>

                {error && (
                  <div className="flex items-center text-red-500 text-sm mt-2">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{resumeData.contactInfo.name}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{resumeData.contactInfo.email}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">{resumeData.contactInfo.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Education</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {resumeData.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Work Experience</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {resumeData.workExperience.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {resumeData && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setResumeData(null)
                  setFile(null)
                }}
              >
                Upload Another Resume
              </Button>
              <Button
                onClick={() => {
                  // Save the extracted data to user's session/profile
                  toast({
                    title: "Resume data saved",
                    description: "The extracted information has been saved to your profile.",
                  })
                }}
              >
                Save Information
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
