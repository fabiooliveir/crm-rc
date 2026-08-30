import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { attachAuthCookies, clearAuthCookies } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token não encontrado' },
        { status: 401 }
      );
    }

    const newTokens = await authService.refresh(refreshToken);

    const response = NextResponse.json({
      success: true,
      message: 'Sessão renovada com sucesso!',
      expiresIn: newTokens.expiresIn,
    });

    return attachAuthCookies(response, newTokens);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Falha ao renovar sessão';
    const response = NextResponse.json({ success: false, error: errorMsg }, { status: 401 });
    return clearAuthCookies(response);
  }
}
