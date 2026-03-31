"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/validations/auth.schema"
import { loginAction } from "@/actions/auth.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setIsPending(true)
    setError(null)
    try {
      const result = await loginAction(values)
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
    <main className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary">
      {/* Film Grain Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBT-xrtgJXTTVqVl03SkVXm-6USuoS_w_BSrgSeHMGgqQ1iBS95nvndILa2PIFA0K1XH1eFX18hVVnTIMl6M0ngB0H5mNuu_wkBuevhMo7dPCjX-24kOkkBzOh4Sbswtq9OJsfeX8ICKgDwNsxrjfIMYeVnGY7hfhghsn-eMo9Ianh8WHZuTdDQ8I6ncXc4vQunXwY0aE5I-bimCaNual3dIVHdO6a9BOwNwj8OANVAysPlWWJ9xgwiKotgrxZ6cxfH_4l0JpYrssA')" }}></div>

      {/* Left Side: Cinematic Visuals */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface z-20"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO5FPtwmVQ_eSkqhFcghLPUxHA7YATfzO5jyqXgzmUfusxI9Snq7Nju5GlPJeaakCI-pr9Z4LgZAamoHzFVTZKua8vwwwMmdb4FF1ceXVwp3fBcykJUHvN3YR3KOYbsYbP4T9_d_vw7I9PdA754X92Es_4R1CEMLXScNnLaZOyoH6UvzV-M4e2RXVufdnUpVwCNK7pxouX-MmQuI8f08LgNb4UWjwpoWvfqfuVC10rMPJ7gYWg50Kwu5KHuEP_C-XLkx9hzkJz-lw" 
          alt="Cinema Hall" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        
        {/* Brand Overlay */}
        <div className="absolute top-12 left-12 z-30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
            <h1 className="font-headline font-black text-4xl tracking-tighter text-on-surface">CinemaPass</h1>
          </div>
        </div>

        {/* Cinematic Quote/Tagline */}
        <div className="absolute bottom-24 left-12 z-30 max-w-md">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-4 block">The Premiere Experience</span>
          <h2 className="font-headline text-5xl font-bold leading-tight tracking-tight mb-6">
            WHERE EVERY <span className="text-primary italic">FRAME</span> MATTERS.
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            Step back into the magic. Your front-row seat to the world's most captivating stories is waiting.
          </p>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-surface z-20">
        {/* Mobile Brand Header */}
        <div className="md:hidden flex items-center gap-2 mb-12">
          <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
          <h1 className="font-headline font-black text-2xl tracking-tighter">CinemaPass</h1>
        </div>

        <header className="mb-10">
          <h2 className="font-headline text-4xl font-bold mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-on-surface-variant">Log in to your account to continue the show.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary">mail</span>
              <input 
                {...register("email")}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 py-3 pl-8 pr-2 focus:ring-0 focus:border-primary text-on-surface placeholder:text-zinc-600 transition-all duration-300" 
                id="email" 
                placeholder="name@example.com" 
                type="email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="password">Password</label>
              <Link href="#" className="text-xs text-primary hover:text-primary-fixed-dim transition-colors font-semibold">Forgot password?</Link>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary">lock</span>
              <input 
                {...register("password")}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 py-3 pl-8 pr-2 focus:ring-0 focus:border-primary text-on-surface placeholder:text-zinc-600 transition-all duration-300" 
                id="password" 
                placeholder="••••••••" 
                type="password"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3 py-2">
            <div className="relative flex items-center">
              <input 
                className="h-5 w-5 rounded-lg bg-surface-container-high border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface transition-all" 
                id="remember" 
                type="checkbox"
              />
            </div>
            <label className="text-sm text-on-surface-variant font-medium cursor-pointer select-none" htmlFor="remember">Stay signed in for 30 days</label>
          </div>

          {/* Action Button */}
          <button 
            disabled={isPending}
            className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-xl shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all duration-300 tracking-wide text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
          >
            {isPending ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10 flex items-center">
          <div className="flex-grow border-t border-outline-variant/20"></div>
          <span className="px-4 text-xs font-label uppercase tracking-widest text-zinc-600">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-outline-variant/20"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low border border-outline-variant/20 rounded-xl hover:bg-surface-container-high transition-colors group">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl8XYa3jrnys6nIyGGf0k1vz-7o52tURXCQ_vDM9bbdcmswkNjPZ_bk3Ie0QvZsRnieEdCQGs4F8W5KX06GKU5BkjmK9HnBxtL1A-_RmyiFp7nOqQeuJRNYED7ynguNHu-oQJ4WXJWJL51I69e6tLDbq-wOyt8YIAq9Wpd5cO2mHtF-BiA1lLZiaqvMYnauNE0Aqrz_IBoBAQyIU6nIVmB82QwGvPdhJv1j02w7pwoPR_2K_xDc1GIULZ5SPZ8-DD0iUnrxHeXsvs" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform"/>
            <span className="text-sm font-semibold">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low border border-outline-variant/20 rounded-xl hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-xl text-on-surface">apple</span>
            <span className="text-sm font-semibold">Apple</span>
          </button>
        </div>

        <footer className="text-center mt-auto">
          <p className="text-on-surface-variant text-sm">
            New to the premiere? 
            <Link href="/register" className="text-primary font-bold hover:underline ml-1">Create an account</Link>
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link href="#" className="text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-on-surface transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-on-surface transition-colors">Terms</Link>
            <Link href="#" className="text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-on-surface transition-colors">Help</Link>
          </div>
        </footer>
      </section>
    </main>
  )
}
