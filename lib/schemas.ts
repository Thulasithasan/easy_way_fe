import { z } from "zod"

// Login Form Schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

// Registration Form Schema
export const registrationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^[0-9]+$/, "Phone number can only contain numbers"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),

    confirmPassword: z.string(),

    address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address is too long"),

    city: z.string().min(2, "City is required").max(50, "City name is too long"),

    district: z.string().min(2, "District is required").max(50, "District name is too long"),

    province: z.string().min(2, "Province is required").max(50, "Province name is too long"),

    agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),

    subscribeToNewsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Delivery Address Form Schema
export const deliveryAddressSchema = z.object({
  addressType: z.enum(["home", "work", "other"], {
    required_error: "Please select an address type",
  }),

  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[+]?[\d\s-()]+$/, "Please enter a valid phone number"),

  alternatePhoneNumber: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === "") return true
      return /^[+]?[\d\s-()]+$/.test(phone) && phone.length >= 10 && phone.length <= 15
    }, "Please enter a valid alternate phone number"),

  addressLine1: z
    .string()
    .min(5, "Address line 1 must be at least 5 characters")
    .max(200, "Address line 1 must be less than 200 characters"),

  addressLine2: z.string().max(200, "Address line 2 must be less than 200 characters").optional(),

  landmark: z.string().max(100, "Landmark must be less than 100 characters").optional(),

  city: z.string().min(2, "City is required").max(50, "City name must be less than 50 characters"),

  state: z.string().min(2, "State is required").max(50, "State name must be less than 50 characters"),

  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^\d{6}$/, "Pincode must contain only numbers"),

  country: z.string().min(2, "Country is required").default("India"),

  isDefault: z.boolean().optional().default(false),

  deliveryInstructions: z.string().max(500, "Delivery instructions must be less than 500 characters").optional(),
})

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9]+$/, "Phone number can only contain numbers"),

  address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address is too long"),

  city: z.string().min(2, "City is required").max(50, "City name is too long"),

  district: z.string().min(2, "District is required").max(50, "District name is too long"),

  province: z.string().min(2, "Province is required").max(50, "Province name is too long"),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegistrationFormData = z.infer<typeof registrationSchema>
export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
