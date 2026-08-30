import { NextRequest, NextResponse } from 'next/server';
import { pricingService } from '@/lib/pricing/pricingService';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resultado = pricingService.calcularPrecoEComissao(body);

    return NextResponse.json({ resultado });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Parâmetros de cálculo inválidos', details: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : 'Erro ao calcular alçada de preços';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
