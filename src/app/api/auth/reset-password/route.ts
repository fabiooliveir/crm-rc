import { NextRequest, NextResponse } from 'next/server';
import { ResetPasswordSchema } from '@/types/auth';
import { authService } from '@/lib/auth/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = ResetPasswordSchema.parse(body);

    await authService.resetPassword(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode realizar o login.',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Falha ao redefinir a senha';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
