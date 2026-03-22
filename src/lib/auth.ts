import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { loginSchema } from "@/validations/auth.schema"
import { type DefaultSession } from "next-auth"

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role?: "USER" | "ADMIN"
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // JWT strategy is typical for credentials
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials against our shared Zod schema
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          
          // Never call logic directly everywhere; here we are inside NextAuth so we fetch user
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})
