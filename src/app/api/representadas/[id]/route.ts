import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { representadaService } from '@/lib/representadas/representadaService';
import { ZodError } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const representada = await representadaService.getRepresentadaById(id, tenantId);
    return NextResponse.json({ representada });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Representada não encontrada';
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
    const representada = await representadaService.updateRepresentada(id, tenantId, body);

    return NextResponse.json({
      message: 'Representada atualizada com sucesso!',
      representada,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar representada';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    await representadaService.deleteRepresentada(id, tenantId);
    return NextResponse.json({ message: 'Representada removida com sucesso!' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir representada';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
