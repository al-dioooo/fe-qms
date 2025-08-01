import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register']
const COOKIE_KEY = 'qms_auth_token'

export function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/|favicon.ico).*)'],
}
