"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin, Phone, User, Home, Building, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { deliveryAddressSchema, type DeliveryAddressFormData } from "@/lib/schemas"
import { useToast } from "@/hooks/use-toast"

interface DeliveryAddressFormProps {
  onSubmit?: (data: DeliveryAddressFormData) => void
  initialData?: Partial<DeliveryAddressFormData>
  isEditing?: boolean
}

export default function DeliveryAddressForm({ onSubmit, initialData, isEditing = false }: DeliveryAddressFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeliveryAddressFormData>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: {
      country: "India",
      isDefault: false,
      ...initialData,
    },
  })

  const addressType = watch("addressType")

  const handleFormSubmit = async (data: DeliveryAddressFormData) => {
    console.log("Address form submitted with data:", data)
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (onSubmit) {
        onSubmit(data)
      }

      toast({
        title: isEditing ? "Address Updated!" : "Address Added!",
        description: isEditing
          ? "Your delivery address has been updated successfully."
          : "Your delivery address has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-brand-primary" />
          <span>{isEditing ? "Edit Delivery Address" : "Add Delivery Address"}</span>
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update your delivery address information" : "Add a new delivery address for your orders"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Address Type */}
          <div className="space-y-3">
            <Label>Address Type *</Label>
            <RadioGroup
              value={addressType}
              onValueChange={(value) => setValue("addressType", value as any)}
              className="flex space-x-6"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" disabled={isLoading} />
                <Label htmlFor="home" className="flex items-center space-x-2 cursor-pointer">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="work" id="work" disabled={isLoading} />
                <Label htmlFor="work" className="flex items-center space-x-2 cursor-pointer">
                  <Building className="w-4 h-4" />
                  <span>Work</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" disabled={isLoading} />
                <Label htmlFor="other" className="flex items-center space-x-2 cursor-pointer">
                  <MapPin className="w-4 h-4" />
                  <span>Other</span>
                </Label>
              </div>
            </RadioGroup>
            {errors.addressType && <p className="text-sm text-red-600">{errors.addressType.message}</p>}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  className="pl-10"
                  disabled={isLoading}
                  {...register("fullName")}
                />
              </div>
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    className="pl-10"
                    disabled={isLoading}
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhoneNumber">Alternate Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="alternatePhoneNumber"
                    type="tel"
                    placeholder="Enter alternate phone"
                    className="pl-10"
                    disabled={isLoading}
                    {...register("alternatePhoneNumber")}
                  />
                </div>
                {errors.alternatePhoneNumber && (
                  <p className="text-sm text-red-600">{errors.alternatePhoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Details</h3>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="House/Flat/Building No., Street Name"
                disabled={isLoading}
                {...register("addressLine1")}
              />
              {errors.addressLine1 && <p className="text-sm text-red-600">{errors.addressLine1.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="Area, Colony, Sector"
                disabled={isLoading}
                {...register("addressLine2")}
              />
              {errors.addressLine2 && <p className="text-sm text-red-600">{errors.addressLine2.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="landmark"
                  type="text"
                  placeholder="Near landmark for easy identification"
                  className="pl-10"
                  disabled={isLoading}
                  {...register("landmark")}
                />
              </div>
              {errors.landmark && <p className="text-sm text-red-600">{errors.landmark.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" type="text" placeholder="Enter city" disabled={isLoading} {...register("city")} />
                {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" type="text" placeholder="Enter state" disabled={isLoading} {...register("state")} />
                {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  disabled={isLoading}
                  {...register("pincode")}
                />
                {errors.pincode && <p className="text-sm text-red-600">{errors.pincode.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value="India"
                disabled
                className="bg-gray-100 dark:bg-gray-800"
                {...register("country")}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="deliveryInstructions"
                placeholder="Any specific instructions for delivery (e.g., Ring the bell twice, Leave at the gate, etc.)"
                rows={3}
                disabled={isLoading}
                {...register("deliveryInstructions")}
              />
              {errors.deliveryInstructions && (
                <p className="text-sm text-red-600">{errors.deliveryInstructions.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                disabled={isLoading}
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked as boolean)}
              />
              <Label htmlFor="isDefault" className="text-sm">
                Set as default delivery address
              </Label>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1 bg-brand-primary hover:bg-brand-dark text-white"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Update Address"
              ) : (
                "Add Address"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 bg-transparent"
              disabled={isLoading}
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
