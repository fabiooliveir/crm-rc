import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema } from '@/types/auth';
import { authService } from '@/lib/auth/authService';
import { attachAuthCookies } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);

    const result = await authService.register(validatedData);

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        message: 'Conta criada com sucesso!',
      },
      { status: 201 }
    );

    return attachAuthCookies(response, result.tokens);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao cadastrar usuário';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
