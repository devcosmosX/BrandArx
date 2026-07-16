// lib/validations/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required'),
    lastName: z
      .string()
      .min(1, 'Last name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the Terms of Service and Privacy Policy',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
