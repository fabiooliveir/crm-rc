import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { pricingService } from '@/lib/pricing/pricingService';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const { searchParams } = new URL(req.url);
    const representadaId = searchParams.get('representadaId') || undefined;
    const statusParam = searchParams.get('status');

    let ativo: boolean | undefined = undefined;
    if (statusParam === 'ativos') ativo = true;
    if (statusParam === 'inativos') ativo = false;

    const tabelas = await pricingService.listTabelas(tenantId, {
      representadaId,
      ativo,
    });

    return NextResponse.json({ tabelas });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao listar tabelas de preços';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const body = await req.json();
    const tabela = await pricingService.createTabela(tenantId, body);

    return NextResponse.json(
      {
        message: 'Tabela de preços cadastrada com sucesso!',
        tabela,
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
    const msg = error instanceof Error ? error.message : 'Erro ao criar tabela de preços';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
