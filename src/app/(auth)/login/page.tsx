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
    <div 
      className="flex min-h-screen w-full overflow-hidden bg-[#f5f7f8] dark:bg-[#0f1923] text-[#0d141b] dark:text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Left Side: Aesthetic Image/Gradient */}
      <div className="hidden lg:flex flex-col lg:w-1/2 relative bg-[#359EFF] items-center justify-center p-12">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBYOrEfltgynQJexm3XwszzRbE7Y3ohPi56_YCHxXR7F4TvMxt8wiy4jmDF_gv4Q5D9_KXiGufMMwOXxdJmmmTigUDYeLs7CFboxGDZk6cc-_NdB4-XcVwWRyzxy86puS2oCqi39gJSmFVal1CuUi8GQMOhvn9k_TIl-bu6CJOf9UCT6zFK3eHoUDx78EB6idV0kg3qh9OGvdeO1qpc-lhIz3N4AClCql97653NJJgO6iYrag3nXFUVKOqNNLcBVM8oKIGK1lqD74')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#359EFF]/80 to-[#359EFF]/40 mix-blend-multiply" />
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">NexusFlow</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">Elevate your team's productivity.</h2>
          <p className="text-lg text-white/80">Experience the next generation of collaborative project management with our intuitive interface.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 overflow-y-auto">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0d141b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Welcome back</h1>
            <p className="text-[#4c739a] dark:text-slate-400 text-base font-normal leading-normal">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[#0d141b] dark:text-slate-200 text-sm font-semibold">Email Address</label>
              <input 
                id="email"
                type="email"
                placeholder="e.g. name@company.com" 
                className="flex w-full rounded-lg text-[#0d141b] dark:text-white border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4 focus:ring-2 focus:ring-[#359EFF] focus:border-transparent outline-none transition-all placeholder:text-[#4c739a]/60"
                {...register("email")}
              />
              {errors.email && <p className="text-sm font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[#0d141b] dark:text-slate-200 text-sm font-semibold">Password</label>
              <input 
                id="password"
                type="password"
                placeholder="Enter your password" 
                className="flex w-full rounded-lg text-[#0d141b] dark:text-white border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4 focus:ring-2 focus:ring-[#359EFF] focus:border-transparent outline-none transition-all placeholder:text-[#4c739a]/60"
                {...register("password")}
              />
              {errors.password && <p className="text-sm font-medium text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-x-2 cursor-pointer group">
                <input type="checkbox" className="h-5 w-5 rounded border-[#cfdbe7] dark:border-slate-700 border-2 bg-transparent text-[#359EFF] focus:ring-0 transition-colors" />
                <span className="text-[#0d141b] dark:text-slate-300 text-sm font-medium">Remember me</span>
              </label>
              <Link href="#" className="text-[#359EFF] hover:underline text-sm font-semibold">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#359EFF] hover:bg-[#359EFF]/90 disabled:bg-[#359EFF]/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-all transform active:scale-[0.98]"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-grow border-t border-[#cfdbe7] dark:border-slate-700"></div>
            <span className="text-[#4c739a] dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-[#cfdbe7] dark:border-slate-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 h-12 px-4 rounded-lg border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl8XYa3jrnys6nIyGGf0k1vz-7o52tURXCQ_vDM9bbdcmswkNjPZ_bk3Ie0QvZsRnieEdCQGs4F8W5KX06GKU5BkjmK9HnBxtL1A-_RmyiFp7nOqQeuJRNYED7ynguNHu-oQJ4WXJWJL51I69e6tLDbq-wOyt8YIAq9Wpd5cO2mHtF-BiA1lLZiaqvMYnauNE0Aqrz_IBoBAQyIU6nIVmB82QwGvPdhJv1j02w7pwoPR_2K_xDc1GIULZ5SPZ8-DD0iUnrxHeXsvs" alt="Google" className="w-5 h-5"/>
              <span className="text-[#0d141b] dark:text-white text-sm font-semibold">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 h-12 px-4 rounded-lg border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="text-[#0d141b] dark:text-white text-sm font-semibold">Apple</span>
            </button>
          </div>

          <p className="text-center text-[#4c739a] dark:text-slate-400 text-sm font-medium mt-4">
            Don't have an account? 
            <Link href="/register" className="text-[#359EFF] font-bold hover:underline ml-1">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
