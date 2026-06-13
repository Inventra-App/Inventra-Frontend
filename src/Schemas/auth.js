import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name cannot be empty")
    .min(2, "First name is too short"),
    
  lastName: z
    .string()
    .min(1, "Last name cannot be empty")
    .min(2, "Last name is too short"),
    
  email: z
    .string()
    .min(1, "Email address cannot be empty")
    .email("Invalid email address"),
    
  businessName: z
    .string()
    .min(1, "Business name cannot be empty")
    .min(2, "Business name is too short"),
    
  phoneNumber: z
    .string()
    .min(1, "Phone number cannot be empty")
    .min(10, "Invalid phone number"),
    
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .min(6, "Password must be at least 6 characters"),
    
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),

    agree: z.boolean().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});