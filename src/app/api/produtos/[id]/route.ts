import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { produtoService } from '@/lib/produtos/produtoService';
import { ZodError } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const produto = await produtoService.getProdutoById(id, tenantId);
    return NextResponse.json({ produto });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Produto não encontrado';
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
    const produto = await produtoService.updateProduto(id, tenantId, body);

    return NextResponse.json({
      message: 'Produto atualizado com sucesso!',
      produto,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar produto';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    await produtoService.deleteProduto(id, tenantId);
    return NextResponse.json({ message: 'Produto removido com sucesso!' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir produto';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
