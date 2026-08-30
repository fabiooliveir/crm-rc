import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtEdge } from '@/lib/auth/jwtEdge';

// Rotas protegidas que exigem autenticação ativa
const PROTECTED_ROUTES = ['/dashboard', '/pedidos', '/clientes', '/catalogo', '/configuracoes'];

// Rotas exclusivas para usuários anônimos (redireciona para / caso já logado)
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Validação do Token JWT no Edge
  const session = accessToken ? verifyJwtEdge(accessToken) : null;

  // 1. Bloqueio de rotas protegidas sem sessão válida
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirecionamento de usuário já autenticado tentando acessar telas de login/cadastro
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 3. Injeção de headers de contexto de Tenant para rotas autenticadas
  if (session) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', session.sub);
    requestHeaders.set('x-tenant-id', session.tenantId);
    requestHeaders.set('x-user-role', session.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto arquivos estáticos, chunks do Next.js e manifest
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|media/).*)',
  ],
};
