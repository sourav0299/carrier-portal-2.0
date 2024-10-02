import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths
  const publicPaths = ['/login', '/signup', '/forgot-password','/']
  
  // Check if the path is a public path
  const isPublicPath = publicPaths.includes(path)

  // Allow access to static files and API routes
  if (path.startsWith('/_next') || path.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value || ''

  // If it's a public path and user has a token, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If it's not a public path and user doesn't have a token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico).*)',
  ]
}