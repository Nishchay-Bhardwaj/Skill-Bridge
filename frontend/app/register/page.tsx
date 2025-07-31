"use client"
import { useState } from "react"
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

const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login, checkUserExists } = useAuth()
  const searchParams = useSearchParams()
  const prefillEmail = searchParams.get("email")

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: prefillEmail || "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
  
    try {
      if (checkUserExists(values.email)) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please login instead.",
          variant: "destructive",
        })
        setTimeout(() => router.push("/login"), 1500)
        return
      }
  
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      const userData = { 
        name: values.name, 
        email: values.email 
      }
      
      login(userData) // This will store the email
  
      toast({
        title: "Registration successful",
        description: "Welcome to SkillBridge!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-slate-200/50 bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] pointer-events-none"></div>

      {/* Animated blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>

      <header className="border-b bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20 relative z-10">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transform -translate-x-1 translate-y-1"></div>
              <Star className="h-5 w-5 text-primary relative" />
            </div>
            <span className="gradient-text">SkillBridge</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="relative max-w-md w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-500/30 to-blue-600/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-gradient"></div>
          <Card className="w-full border border-white/50 bg-white/70 backdrop-blur-md shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
            <CardHeader className="space-y-1 relative">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Enter your information to get started with SkillBridge</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 relative">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="bg-white/70 focus:bg-white/90 backdrop-blur-sm transition-all duration-300 border-slate-200 focus:border-primary/50 focus:ring-primary/50 shadow-sm hover:shadow-md"
                            {...field}
                          />
                        </FormControl>
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
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="bg-white/70 focus:bg-white/90 backdrop-blur-sm transition-all duration-300 border-slate-200 focus:border-primary/50 focus:ring-primary/50 shadow-sm hover:shadow-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="bg-white/70 focus:bg-white/90 backdrop-blur-sm transition-all duration-300 border-slate-200 focus:border-primary/50 focus:ring-primary/50 shadow-sm hover:shadow-md"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-primary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <div className="text-xs text-muted-foreground mt-1">
                          Password must be at least 8 characters long
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white/70 focus:bg-white/90 backdrop-blur-sm transition-all duration-300 border-slate-200 focus:border-primary/50 focus:ring-primary/50 shadow-sm hover:shadow-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="space-y-2 pt-2">
                        <div className="flex items-start">
                          <FormControl>
                            <div className="flex items-center h-5">
                              <input
                                id="terms"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-muted-foreground">
                              I agree to the{" "}
                              <Link href="#" className="text-primary hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="#" className="text-primary hover:underline">
                                Privacy Policy
                              </Link>
                            </label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-blue-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300 animate-gradient"></div>
                      <Button
                        className="w-full relative bg-gradient-to-r from-primary to-blue-600/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group-hover:scale-[1.01] btn-shine"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create account"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Form>
            <CardFooter className="flex flex-col space-y-4 relative">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 backdrop-blur-sm px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button
                  variant="outline"
                  className="w-full bg-white/70 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/70 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                >
                  LinkedIn
                </Button>
              </div>
              <div className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 hover:underline transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

