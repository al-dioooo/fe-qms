import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register']
const COOKIE_KEY = 'qms_auth_token'

export function middleware(request: NextRequest) {
    // const { pathname } = request.nextUrl
    // const token = request.cookies.get(COOKIE_KEY)?.value
    // const authenticated = Boolean(token)

    // if (PUBLIC_PATHS.includes(pathname)) {
    //     if (authenticated && (pathname === '/login' || pathname === '/register')) {
    //         return NextResponse.redirect(new URL('/', request.url))
    //     }
    //     return NextResponse.next()
    // }

    // if (!authenticated) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/|favicon.ico).*)'],
}