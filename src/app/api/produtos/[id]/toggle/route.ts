import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/crypto';
import { produtoService } from '@/lib/produtos/produtoService';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get('accessToken')?.value;
    const session = accessToken ? verifyJwt(accessToken) : null;
    const tenantId = session?.tenantId || req.headers.get('x-tenant-id') || 'tenant_demo_1';

    const produto = await produtoService.toggleProdutoStatus(id, tenantId);
    return NextResponse.json({
      message: `Produto ${produto.ativo ? 'ativado' : 'inativado'} com sucesso!`,
      produto,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao alterar status do produto';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
