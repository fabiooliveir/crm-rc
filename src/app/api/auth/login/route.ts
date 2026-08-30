import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/types/auth';
import { authService } from '@/lib/auth/authService';
import { attachAuthCookies } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LoginSchema.parse(body);

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const result = await authService.login(validatedData, clientIp);

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        message: 'Login realizado com sucesso!',
      },
      { status: 200 }
    );

    return attachAuthCookies(response, result.tokens);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao realizar login';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 401 });
  }
}
