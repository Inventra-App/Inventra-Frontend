import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .refine((val) => val.includes("@"), {
        message: "Email must contain @",
      })
      .refine((val) => val.includes(".com"), {
        message: "Email must end with .com",
      }),

    businessName: z
      .string()
      .min(1, "Business name is required")
      .min(2, "Business name is too short"),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (val) => /^0[789][01]\d{8}$/.test(val.trim()),
        "Enter a valid phone number (e.g. 08012345678)",
      ),

    password: z
      .string()
      .min(1, "Password is required")
      .superRefine((val, ctx) => {
        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 8 characters",
          });
        }
        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one uppercase letter",
          });
        }
        if (!/[a-z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one lowercase letter",
          });
        }
        if (!/[0-9]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one number",
          });
        }
        if (!/[^A-Za-z0-9]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one symbol (e.g. @, #, !)",
          });
        }
      }),

    confirmPassword: z.string().min(1, "Please confirm your password"),

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

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), "Must contain an uppercase letter")
      .refine((val) => /[a-z]/.test(val), "Must contain a lowercase letter")
      .refine((val) => /[0-9]/.test(val), "Must contain a number")
      .refine((val) => /[^A-Za-z0-9]/.test(val), "Must contain a symbol"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
