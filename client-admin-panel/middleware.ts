import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAdmin, SESSION_COOKIE_NAME, verifySessionToken } from './src/lib/auth';

const PUBLIC_PATHS = new Set(['/login', '/api/auth/login']);

const isPublicPath = (pathname: string) => {
  if (PUBLIC_PATHS.has(pathname)) {
    return true;
  }

  return pathname.startsWith('/_next') || pathname === '/favicon.ico';
};

const isPublicApiRequest = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (request.method === 'GET' && (pathname === '/api/projects' || pathname.startsWith('/api/projects/'))) {
    return true;
  }

  if (request.method === 'POST' && pathname === '/api/contact') {
    return true;
  }

  if (request.method === 'OPTIONS' && (pathname.startsWith('/api/projects') || pathname.startsWith('/api/contact'))) {
    return true;
  }

  return false;
};

const buildLoginRedirect = (request: NextRequest) => {
  const loginUrl = new URL('/login', request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (nextPath && nextPath !== '/') {
    loginUrl.searchParams.set('next', nextPath);
  }
  return loginUrl;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const forceLogin = request.nextUrl.searchParams.get('forceLogin') === '1';

  if (isPublicApiRequest(request)) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (pathname === '/login') {
      if (forceLogin) {
        const cleanLoginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(cleanLoginUrl);
        response.cookies.set({
          name: SESSION_COOKIE_NAME,
          value: '',
          path: '/',
          maxAge: 0,
        });
        return response;
      }

      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        const payload = await verifySessionToken(token);
        if (isAllowedAdmin(payload)) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }

    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(buildLoginRedirect(request));
  }

  const payload = await verifySessionToken(token);
  if (!isAllowedAdmin(payload)) {
    const response = NextResponse.redirect(buildLoginRedirect(request));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      path: '/',
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};