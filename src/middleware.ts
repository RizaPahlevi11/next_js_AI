import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  // Use getToken for Edge compatibility instead of importing auth() + bcrypt
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  
  const pathname = req.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Guest requesting protected route -> redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Authenticated user requesting auth pages -> redirect to dashboard/home
  if (token && isAuthPage) {
    const role = token.role as string
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/', req.url))
  }

  // RBAC check for admin routes
  if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Applies to everything minus static assets and api endpoints
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
