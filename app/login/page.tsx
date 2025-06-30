"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import { loginSchema, type LoginFormData } from "@/lib/schemas"
import { authApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { setUser, setTokens } = useStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted with data:", data)
    setIsLoading(true)

    try {
      console.log("Calling sign-in API...")
      const response = await authApi.signIn({
        email: data.email,
        password: data.password,
      })

      console.log("API Response:", response)

      if (response.status === "successful" && response.results?.[0]) {
        const result = response.results[0]

        // Set user data
        const userData = {
          userId: result.userId,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          roleResponseDto: result.roleResponseDto,
        }

        // Set tokens
        const tokens = {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }

        console.log("Setting user data:", userData)
        console.log("Setting tokens:", tokens)

        setUser(userData)
        setTokens(tokens)

        toast({
          title: "Login Successful!",
          description: `Welcome back, ${result.firstName}!`,
        })

        // Check if password needs to be changed
        if (!result.isPasswordChangedForTheFirstTime) {
          toast({
            title: "Password Change Required",
            description: "Please change your password for security.",
            variant: "destructive",
          })
          router.push("/change-password")
        } else {
          router.push("/")
        }
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Invalid email or password. Please try again."

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid credentials. Please check your email and password."
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later."
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection and try again."
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">EW</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-brand-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Easy Way account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  disabled={isLoading}
                  checked={watch("rememberMe")}
                  onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className={`text-sm text-brand-primary hover:underline ${isLoading ? "pointer-events-none opacity-50" : ""}`}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-dark text-white"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className={`text-brand-primary hover:underline font-medium ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
