"use client"

import { useState } from "react"
import { ResumeForm } from "./resume-form"
import { ResumePreview } from "./resume-preview"
import { type ResumeData, defaultResumeData } from "./types"
import { Button } from "@/components/ui/button"
import { Download,FileCheck, FileText, Printer, AlertTriangle } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { TemplateSelector } from "./template-selector"
import { FontStyleSelector } from "./font-style-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { downloadAsPDF, downloadAsWord } from "./download-utils"
import { printToPDF } from "./download-utils-fallback"
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [activeColor, setActiveColor] = useState<string>("teal")
  const [activeTemplate, setActiveTemplate] = useState<string>("simple")
  const [activeFont, setActiveFont] = useState<string>("inter")
  const [isDownloading, setIsDownloading] = useState(false)
  const [atsScore, setAtsScore] = useState<number | null>(null);
  
  const handleATSUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);  // Changed 'resume' to 'file'

    try {
      const response = await fetch('http://localhost:5006/api/check-ats', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.ats_score) {  // Changed 'score' to 'ats_score'
        console.log(data)
        setAtsScore(data.ats_score);
      }
    } catch (err) {
      console.error('Error checking ATS score:', err);
    }
  }

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...newData }))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await downloadAsPDF()
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("There was an error generating your PDF. Trying fallback method...")
      printToPDF()
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadWord = async () => {
    setIsDownloading(true)
    try {
      await downloadAsWord(resumeData)
    } catch (error) {
      console.error("Error downloading Word document:", error)
      alert("There was an error generating your Word document. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-background p-4 print:hidden">
          <div className="container flex justify-between items-center">
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                    <Button
              variant="outline"
              size="sm"
              className="gap-1 relative"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <FileCheck className="h-4 w-4" /> Check ATS
              <input
                type="file"
                id="fileInput"
                accept="application/pdf"
                className="hidden"
                onChange={handleATSUpload}
              />
            </Button>
            
            {/* Display ATS Score */}
            {atsScore !== null && (
              <motion.div
                className="ml-2 text-sm font-medium p-2 text-green-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                ATS Score: {atsScore.toFixed(3)}%
              </motion.div>
            )}
                      <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print or save as PDF using browser print dialog</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2" disabled={isDownloading}>
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownloadPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Format
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadWord}>
                    <FileText className="h-4 w-4 mr-2" />
                    Word Format
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={printToPDF}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Alternative PDF Method
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        {/* Top section: Template selection and customization */}
        <div className="container mx-auto p-4 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left top: Template selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose a Template</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector activeTemplate={activeTemplate} onTemplateChange={setActiveTemplate} />
              </CardContent>
            </Card>

            {/* Right top: Customization options */}
            <Card>
              <CardHeader>
                <CardTitle>Customize Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Select color scheme:</h3>
                  <div className="flex gap-2 mb-4">
                    {[
                      { name: "teal", class: "bg-teal-500" },
                      { name: "blue", class: "bg-blue-500" },
                      { name: "gray", class: "bg-gray-700" },
                      { name: "indigo", class: "bg-indigo-600" },
                    ].map((color) => (
                      <button
                        key={color.name}
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          activeColor === color.name ? "ring-2 ring-offset-2 ring-black" : ""
                        }`}
                        onClick={() => setActiveColor(color.name)}
                        aria-label={`Select ${color.name} color scheme`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Select font style:</h3>
                  <FontStyleSelector activeFont={activeFont} onFontChange={setActiveFont} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom section: Form and Preview */}
        <main className="flex-1 container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left bottom: Form to enter details */}
            <div className="overflow-y-auto print:hidden">
              <ResumeForm
                data={resumeData}
                onChange={handleDataChange}
                activeColor={activeColor}
                onColorChange={setActiveColor}
              />
            </div>

            {/* Right bottom: Resume preview */}
            <div className="overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <ResumePreview
                data={resumeData}
                activeColor={activeColor}
                activeTemplate={activeTemplate}
                activeFont={activeFont}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

