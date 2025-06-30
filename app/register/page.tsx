"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Building, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { registrationSchema, type RegistrationFormData } from "@/lib/schemas"
import { authApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { language } = useStore()
  const t = useTranslation(language)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      agreeToTerms: false,
      subscribeToNewsletter: false,
    },
  })

  const onSubmit = async (data: RegistrationFormData) => {
    console.log("Registration form submitted with data:", data)
    setIsLoading(true)

    try {
      const signUpData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        district: data.district,
        province: data.province,
        roleId: 2, // Default role ID for customers
      }

      console.log("Calling sign-up API with data:", signUpData)
      const response = await authApi.signUp(signUpData)
      console.log("Registration API Response:", response)

      if (response.status === "successful") {
        toast({
          title: "Registration Successful!",
          description: "Your account has been created successfully. Please sign in to continue.",
        })

        router.push("/login")
      } else {
        throw new Error("Registration failed")
      }
    } catch (error: any) {
      console.error("Registration error:", error)

      let errorMessage = "Registration failed. Please try again."

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check your information."
      } else if (error.response?.status === 409) {
        errorMessage = "An account with this email already exists."
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later."
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection and try again."
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">EW</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-brand-primary">Create Your Account</CardTitle>
          <CardDescription>Join Easy Way for fresh groceries delivered to your doorstep</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      className="pl-10"
                      disabled={isLoading}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      className="pl-10"
                      disabled={isLoading}
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number (10 digits)"
                    className="pl-10"
                    disabled={isLoading}
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your full address"
                    className="pl-10"
                    disabled={isLoading}
                    {...register("address")}
                  />
                </div>
                {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      className="pl-10"
                      disabled={isLoading}
                      {...register("city")}
                    />
                  </div>
                  {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="district"
                      type="text"
                      placeholder="Enter your district"
                      className="pl-10"
                      disabled={isLoading}
                      {...register("district")}
                    />
                  </div>
                  {errors.district && <p className="text-sm text-red-600">{errors.district.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province/State *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="province"
                      type="text"
                      placeholder="Enter your province/state"
                      className="pl-10"
                      disabled={isLoading}
                      {...register("province")}
                    />
                  </div>
                  {errors.province && <p className="text-sm text-red-600">{errors.province.message}</p>}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  disabled={isLoading}
                  checked={watch("agreeToTerms")}
                  onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-brand-primary hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-brand-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  *
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscribeToNewsletter"
                  disabled={isLoading}
                  checked={watch("subscribeToNewsletter")}
                  onCheckedChange={(checked) => setValue("subscribeToNewsletter", checked as boolean)}
                />
                <Label htmlFor="subscribeToNewsletter" className="text-sm">
                  Subscribe to our newsletter for offers and updates
                </Label>
              </div>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className={`text-brand-primary hover:underline font-medium ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
