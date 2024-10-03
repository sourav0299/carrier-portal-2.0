import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicPaths = ['/login']
  const isPublicPath = publicPaths.includes(path)
  if (path.startsWith('/_next') || path.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value || ''
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico).*)',
  ]
}