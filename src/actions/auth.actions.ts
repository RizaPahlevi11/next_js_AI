"use server"

import { authService } from "@/services/auth.service"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/validations/auth.schema"
import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(values: LoginInput) {
  try {
    const validatedData = loginSchema.parse(values)
    
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })
    
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." }
        default:
          return { error: "Terjadi kesalahan saat login." }
      }
    }
    
    // Zod errors
    if (error instanceof Error && error.name === "ZodError") {
      return { error: "Format input tidak valid." }
    }
    
    throw error // Important: NextAuth handles redirect if configured
  }
}

export async function registerAction(values: RegisterInput) {
  try {
    const validatedData = registerSchema.parse(values)
    await authService.registerUser(validatedData)
    
    // Auto login after successful registration
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Terjadi kesalahan saat registrasi." }
  }
}
