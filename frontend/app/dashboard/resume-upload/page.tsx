import ResumeUpload from "@/components/resume-upload"

export default function ResumeUploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Resume Upload & Analysis</h1>
      <p className="text-muted-foreground mb-8">
        Upload your resume to automatically extract key information using our AI-powered resume parser.
      </p>
      <ResumeUpload />
    </div>
  )
}
