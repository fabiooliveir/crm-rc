import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordSchema } from '@/types/auth';
import { authService } from '@/lib/auth/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = ForgotPasswordSchema.parse(body);

    const result = await authService.forgotPassword(validatedData.email);

    return NextResponse.json({
      success: true,
      message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.',
      resetToken: process.env.NODE_ENV !== 'production' ? result.resetToken : undefined,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao processar solicitação';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
