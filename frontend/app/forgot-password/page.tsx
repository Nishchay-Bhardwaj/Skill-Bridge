"use client"
import { useState } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo reset - in a real app, this would call your password reset API
      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="absolute inset-0 bg-grid-slate-200/50 bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] pointer-events-none"></div>
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>

      <header className="border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 relative z-10">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transform -translate-x-1 translate-y-1"></div>
              <Star className="h-5 w-5 text-primary relative" />
            </div>
            <span>SkillBridge</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="relative group max-w-md w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>
          <Card className="w-full border border-white/50 bg-white/70 backdrop-blur-md shadow-xl relative">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            {!isSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              className="bg-white/70 focus:bg-white/90 backdrop-blur-sm transition-all duration-300 border-slate-200 focus:border-primary/50 focus:ring-primary/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                        <Button
                          className="w-full relative bg-gradient-to-r from-primary to-blue-600/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group-hover:scale-[1.01]"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send reset link"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </form>
              </Form>
            ) : (
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 rounded-md text-center border border-primary/10">
                  <p className="text-primary font-medium">Reset link sent!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check your email for instructions to reset your password.
                  </p>
                </div>
              </CardContent>
            )}
            <CardFooter>
              <div className="text-center text-sm w-full">
                <Link href="/login" className="text-primary hover:text-primary/80 hover:underline transition-colors">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

