"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login, checkUserExists } = useAuth()
  const searchParams = useSearchParams()
  const redirectReason = searchParams.get("reason")

  useEffect(() => {
    // Show notification based on redirect reason
    if (redirectReason === "upload") {
      toast({
        title: "Login Required",
        description: "Please login or sign up to upload your resume.",
      })
    } else if (redirectReason === "dashboard") {
      toast({
        title: "Login Required",
        description: "Please login or sign up to access the dashboard.",
      })
    }
  }, [redirectReason, toast])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      const userExists = checkUserExists(values.email) || values.email === "demo@example.com"
  
      if (!userExists) {
        toast({
          title: "Account not found",
          description: "This email is not registered. Please sign up first.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push(`/register?email=${encodeURIComponent(values.email)}`)
        }, 1500)
        return
      }
  
      // Login logic
      if (values.email === "demo@example.com" && values.password === "password") {
        login({ name: "Demo User", email: "demo@example.com" })
      } else {
        login({ 
          name: values.email.split("@")[0], 
          email: values.email 
        })
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to SkillBridge!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 z-0">
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        {/* Animated gradient circles */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/50 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/30">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-4 w-4 text-primary" />
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-50"></span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 font-extrabold">
              SkillBridge
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Glass card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-gradient"></div>

            <Card className="relative bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-xl rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl"></div>

              <CardHeader className="relative space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-slate-800">Welcome back</CardTitle>
                <CardDescription className="text-slate-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="relative space-y-4">
                    {/* Email field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="name@example.com"
                                className="bg-white/70 border-slate-200 focus:border-primary focus:ring-primary/30 pl-3 h-10 rounded-md"
                                {...field}
                              />
                              <div className="absolute inset-0 rounded-md border border-primary/0 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/20 pointer-events-none transition-all duration-300"></div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Password field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="bg-white/70 border-slate-200 focus:border-primary focus:ring-primary/30 pl-3 h-10 rounded-md pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-primary"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <div className="absolute inset-0 rounded-md border border-primary/0 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/20 pointer-events-none transition-all duration-300"></div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Submit button */}
                    <div className="pt-2">
                      <Button
                        className="w-full relative overflow-hidden group/btn bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                        type="submit"
                        disabled={isLoading}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Signing in...
                            </>
                          ) : (
                            "Sign in"
                          )}
                        </span>
                        <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                      </Button>
                    </div>

                    {/* Demo credentials */}
                    <div className="text-center text-xs text-slate-600 bg-blue-50/50 p-2 rounded-md border border-blue-100/50">
                      <p>
                        Demo credentials: <span className="font-medium text-primary">demo@example.com / password</span>
                      </p>
                    </div>
                  </CardContent>
                </form>
              </Form>

              <CardFooter className="relative flex flex-col space-y-4 pt-0">
                {/* Divider */}
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                {/* Social login buttons */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg
                      className="h-4 w-4 mr-2 text-[#0A66C2]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </Button>
                </div>

                {/* Sign up link */}
                <div className="text-center text-sm mt-4 text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-medium hover:text-primary/80 hover:underline transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

