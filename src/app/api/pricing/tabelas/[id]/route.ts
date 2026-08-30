import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { pricingService } from '@/lib/pricing/pricingService';
import { ZodError } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const tabela = await pricingService.getTabelaById(id, tenantId);
    return NextResponse.json({ tabela });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Tabela de preços não encontrada';
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const body = await req.json();
    const tabela = await pricingService.updateTabela(id, tenantId, body);

    return NextResponse.json({
      message: 'Tabela de preços atualizada com sucesso!',
      tabela,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar tabela';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    await pricingService.deleteTabela(id, tenantId);
    return NextResponse.json({ message: 'Tabela de preços removida com sucesso!' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir tabela';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
