import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { produtoService } from '@/lib/produtos/produtoService';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const { searchParams } = new URL(req.url);
    const representadaId = searchParams.get('representadaId') || undefined;
    const search = searchParams.get('search') || undefined;
    const categoria = searchParams.get('categoria') || undefined;
    const statusParam = searchParams.get('status');

    let ativo: boolean | undefined = undefined;
    if (statusParam === 'ativos') ativo = true;
    if (statusParam === 'inativos') ativo = false;

    const produtos = await produtoService.listProdutos(tenantId, {
      representadaId,
      search,
      categoria,
      ativo,
    });

    return NextResponse.json({ produtos });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao listar produtos';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const body = await req.json();
    const produto = await produtoService.createProduto(tenantId, body);

    return NextResponse.json(
      {
        message: 'Produto cadastrado com sucesso no catálogo!',
        produto,
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
    const msg = error instanceof Error ? error.message : 'Erro ao criar produto';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
