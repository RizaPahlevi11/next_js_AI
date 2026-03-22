"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/validations/auth.schema"
import { loginAction } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    defaultValues: {
      email: "",
      password: "",
    },
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
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Masukkan email dan password untuk masuk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="nama@email.com" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="******" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
