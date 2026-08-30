import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { representadaService } from '@/lib/representadas/representadaService';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const segmento = searchParams.get('segmento') || undefined;
    const statusParam = searchParams.get('status');

    let ativo: boolean | undefined = undefined;
    if (statusParam === 'ativos') ativo = true;
    if (statusParam === 'inativos') ativo = false;

    const representadas = await representadaService.listRepresentadas(tenantId, {
      search,
      segmento,
      ativo,
    });

    return NextResponse.json({ representadas });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao listar representadas';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const body = await req.json();
    const representada = await representadaService.createRepresentada(tenantId, body);

    return NextResponse.json(
      {
        message: 'Representada cadastrada com sucesso!',
        representada,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : 'Erro ao criar representada';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
