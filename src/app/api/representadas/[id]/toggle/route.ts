import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { representadaService } from '@/lib/representadas/representadaService';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const representada = await representadaService.toggleRepresentadaStatus(id, tenantId);
    return NextResponse.json({
      message: `Representada ${representada.ativo ? 'ativada' : 'inativada'} com sucesso!`,
      representada,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao alterar status da representada';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
