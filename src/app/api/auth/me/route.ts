import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { authRepository } from '@/lib/auth/authRepository';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
  }

  const payload = verifyJwt(accessToken);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }

  const user = await authRepository.findUserById(payload.sub);
  const tenant = await authRepository.findTenantById(payload.tenantId);

  if (!user || !tenant) {
    return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      tenantId: user.tenantId,
      nome: user.nome,
      email: user.email,
      role: user.role,
      whatsapp: user.whatsapp,
      tenantName: tenant.razaoSocial,
    },
  });
}
