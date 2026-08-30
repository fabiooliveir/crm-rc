import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { profileService } from '@/lib/profile/profileService';
import { UpdateUserProfileSchema } from '@/types/profile';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    const session = verifyJwt(accessToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    const profileData = await profileService.getProfile(session.sub, session.tenantId);
    return NextResponse.json({ success: true, data: profileData });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao obter perfil';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    const session = verifyJwt(accessToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = UpdateUserProfileSchema.parse(body);

    const updatedUser = await profileService.updateUserProfile(session.sub, validatedData);

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: updatedUser.id,
        nome: updatedUser.nome,
        whatsapp: updatedUser.whatsapp,
        telefone: updatedUser.telefone,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
