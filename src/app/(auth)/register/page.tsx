"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterInput } from "@/validations/auth.schema"
import { registerAction } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: RegisterInput) {
    setIsPending(true)
    setError(null)
    
    try {
      const result = await registerAction(values)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Terjadi kesalahan sistem")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-background text-on-surface font-body overflow-hidden selection:bg-primary selection:text-on-primary">
      {/* Left Side: Cinematic Visual */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsS9Z37RyMTYOLZJrzrDrf4FFGnqFLqZnlB_Xy2aHLTVA5CEK-dR2FXc_WjKpgWOlJ6xyBnoG972zvZi4ZKX_5mZoIgVTBBHmSQ-KZB3G9oUtFPH2w0_Obis1uzzTxl-V_DSFOopA41ZWz43XSw4jdH7Orzqw4nHx54Rx98-Jf6JjgSF871ZMg2m7SfKua7OFFvN68L3JrfDzPcV8B5kvgyF_6JR_H0XQsq5wqGlXjDVwvszxC6gZhVcwINBdW1qrN0YNdzWGC9yE" 
            alt="Cinematic theater interior" 
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="mb-6">
            <span className="text-primary-container font-headline font-black text-5xl tracking-tighter">NOIR</span>
          </div>
          <h1 className="font-headline text-6xl font-bold leading-[0.9] tracking-tighter mb-8 text-on-surface">
            YOUR FRONT ROW <br/> <span className="text-primary-fixed-dim">SEAT AWAITS.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
            Experience the golden age of cinema with a modern digital red carpet. Join our premiere circle today.
          </p>
        </div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-md">
          {/* Brand Anchor for Mobile */}
          <div className="lg:hidden mb-12">
            <span className="text-primary-container font-headline font-black text-3xl tracking-tighter">NOIR</span>
          </div>
          
          <div className="mb-10">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2 uppercase">Create Account</h2>
            <p className="text-on-surface-variant font-label tracking-wide uppercase text-xs">Join the premiere circle</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="relative group">
              <label className="block text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1 group-focus-within:text-primary transition-colors" htmlFor="email">
                Email Address
              </label>
              <input 
                {...register("email")}
                className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary text-on-surface placeholder:text-surface-variant placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest transition-all" 
                id="email" 
                placeholder="ALEX@NOIR.COM" 
                type="email"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1 group-focus-within:text-primary transition-colors" htmlFor="password">
                Password
              </label>
              <input 
                {...register("password")}
                className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary text-on-surface placeholder:text-surface-variant transition-all font-mono" 
                id="password" 
                placeholder="••••••••" 
                type="password"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* T&C Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <div className="flex items-center h-5">
                <input 
                  className="h-4 w-4 rounded-sm border-outline-variant bg-surface-container-high text-primary-container focus:ring-primary focus:ring-offset-background" 
                  id="terms" 
                  name="terms" 
                  type="checkbox"
                />
              </div>
              <div className="text-xs">
                <label className="font-label text-on-surface-variant leading-relaxed tracking-wide cursor-pointer" htmlFor="terms">
                  I AGREE TO THE <Link href="#" className="text-primary-fixed-dim hover:text-primary transition-colors">TERMS OF SERVICE</Link> AND <Link href="#" className="text-primary-fixed-dim hover:text-primary transition-colors">PRIVACY POLICY</Link>.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-6">
              <button 
                disabled={isPending}
                className="w-full bg-primary-container text-on-primary-container font-label font-extrabold uppercase tracking-[0.15em] py-5 rounded-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all duration-300 flex justify-center items-center group disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
              >
                {isPending ? "CREATING ACCOUNT..." : "Create Account"}
                <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
              </button>
              
              <div className="flex flex-col items-center space-y-4">
                <p className="text-[10px] font-label font-bold text-on-surface-variant tracking-widest uppercase">
                  Already have an account? 
                  <Link href="/login" className="text-primary hover:text-primary-fixed transition-colors ml-1">Log In</Link>
                </p>
              </div>
            </div>
          </form>

          {/* Aesthetic Footer Text */}
          <div className="mt-16 text-center">
            <p className="text-[8px] text-surface-variant font-label tracking-[0.3em] uppercase">
              Noir Cinema Group © 2024. All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
