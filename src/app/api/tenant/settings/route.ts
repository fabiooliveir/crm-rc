import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { profileService } from '@/lib/profile/profileService';
import { UpdateTenantSettingsSchema } from '@/types/profile';
import { UserRole } from '@/types/domain';

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

    // Apenas Administrador Titular pode alterar configurações cadastrais do Tenant
    if (session.role !== UserRole.ADMIN_TITULAR) {
      return NextResponse.json(
        {
          success: false,
          error: 'Apenas o Administrador Titular pode alterar as configurações do escritório.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = UpdateTenantSettingsSchema.parse(body);

    const updatedTenant = await profileService.updateTenantSettings(
      session.tenantId,
      validatedData
    );

    return NextResponse.json({
      success: true,
      message: 'Configurações da representação atualizadas com sucesso!',
      tenant: updatedTenant,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao atualizar configurações';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
