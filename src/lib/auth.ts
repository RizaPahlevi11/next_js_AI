import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { type DefaultSession } from "next-auth"

// Extend session types to include role
declare module "next-auth" {
  interface Session {
    user: {
      role: "USER" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role?: "USER" | "ADMIN"
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [], // Placeholder for providers
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        // 'user' in database sessions contains the role from our schema
        session.user.role = user.role as "USER" | "ADMIN"
      }
      return session
    },
  },
})
