import { TabelaPreco, AlcadaStatus, AlcadaFaixa } from '@/types/domain';
import {
  CreateTabelaPrecoDTO,
  CreateTabelaPrecoSchema,
  UpdateTabelaPrecoDTO,
  UpdateTabelaPrecoSchema,
  CalculoPrecoItemDTO,
  CalculoPrecoItemSchema,
} from '@/types/pricing';
import { pricingRepository, alcadasPadraoCRM } from './pricingRepository';

export interface CalculoPrecoItemResultado {
  precoBaseOriginal: number;
  fatorAjusteTabelaPct: number;
  precoTabelaUnitario: number;
  descontoComercialPct: number;
  precoLiquidoUnitario: number;
  quantidade: number;
  subtotalBruto: number;
  subtotalLiquido: number;
  totalDescontoValor: number;
  comissaoPadraoPct: number;
  comissaoEfetivaPct: number;
  fatorReducaoComissaoPct: number;
  comissaoEstimadaValor: number;
  statusAlcada: AlcadaStatus;
  faixaAplicada: AlcadaFaixa;
  mensagemAlcada: string;
}

export class PricingService {
  async listTabelas(
    tenantId: string,
    filters?: { representadaId?: string; ativo?: boolean }
  ): Promise<TabelaPreco[]> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    return pricingRepository.listByTenant(tenantId, filters);
  }

  async getTabelaById(id: string, tenantId: string): Promise<TabelaPreco> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const item = await pricingRepository.findById(id, tenantId);
    if (!item) {
      throw new Error('Tabela de preços não encontrada.');
    }
    return item;
  }

  async createTabela(tenantId: string, payload: CreateTabelaPrecoDTO): Promise<TabelaPreco> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }

    const validated = CreateTabelaPrecoSchema.parse(payload);

    const existing = await pricingRepository.findByNome(
      validated.nome,
      validated.representadaId,
      tenantId
    );
    if (existing) {
      throw new Error(
        `Já existe uma tabela de preços com o nome "${validated.nome}" para esta representada.`
      );
    }

    return pricingRepository.create(tenantId, validated);
  }

  async updateTabela(
    id: string,
    tenantId: string,
    payload: UpdateTabelaPrecoDTO
  ): Promise<TabelaPreco> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }

    const validated = UpdateTabelaPrecoSchema.parse(payload);

    if (validated.nome && validated.representadaId) {
      const existing = await pricingRepository.findByNome(
        validated.nome,
        validated.representadaId,
        tenantId
      );
      if (existing && existing.id !== id) {
        throw new Error(
          `Já existe outra tabela de preços com o nome "${validated.nome}" para esta representada.`
        );
      }
    }

    const updated = await pricingRepository.update(id, tenantId, validated);
    if (!updated) {
      throw new Error('Tabela de preços não encontrada para atualização.');
    }
    return updated;
  }

  async deleteTabela(id: string, tenantId: string): Promise<boolean> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const success = await pricingRepository.delete(id, tenantId);
    if (!success) {
      throw new Error('Tabela de preços não encontrada para exclusão.');
    }
    return true;
  }

  /**
   * Motor de Cálculo de Preço Líquido, Alçadas de Desconto e Redução de Comissão (RN-05)
   */
  calcularPrecoEComissao(input: CalculoPrecoItemDTO): CalculoPrecoItemResultado {
    const data = CalculoPrecoItemSchema.parse(input);

    const alcadas = data.alcadasDesconto?.length ? data.alcadasDesconto : alcadasPadraoCRM;

    // 1. Aplica o fator de ajuste da tabela de preço
    const precoTabelaUnitario = Number(
      (data.precoBaseTabela * (1 + data.fatorAjusteTabelaPct / 100)).toFixed(2)
    );

    // 2. Aplica o desconto comercial concedido pelo representante
    const precoLiquidoUnitario = Number(
      (precoTabelaUnitario * (1 - data.descontoComercialPct / 100)).toFixed(2)
    );

    const subtotalBruto = Number((precoTabelaUnitario * data.quantidade).toFixed(2));
    const subtotalLiquido = Number((precoLiquidoUnitario * data.quantidade).toFixed(2));
    const totalDescontoValor = Number((subtotalBruto - subtotalLiquido).toFixed(2));

    // 3. Avaliação da Política de Alçadas de Desconto (RN-05)
    // Ordena as faixas de menor para maior desconto
    const faixasOrdenadas = [...alcadas].sort((a, b) => a.descontoMaximoPct - b.descontoMaximoPct);

    let faixaAplicada = faixasOrdenadas.find(
      (f) => data.descontoComercialPct <= f.descontoMaximoPct
    );

    if (!faixaAplicada) {
      faixaAplicada = faixasOrdenadas[faixasOrdenadas.length - 1];
    }

    let statusAlcada: AlcadaStatus = AlcadaStatus.LIBERADO;
    let comissaoEfetivaPct = data.comissaoPadraoPct;
    let mensagemAlcada = 'Desconto dentro da alçada normal com comissão integral.';

    if (faixaAplicada.requerAutorizacao) {
      statusAlcada = AlcadaStatus.REQUER_AUTORIZACAO;
      comissaoEfetivaPct = Number(
        (data.comissaoPadraoPct * (faixaAplicada.fatorComissaoPct / 100)).toFixed(2)
      );
      mensagemAlcada = `⚠️ Desconto de ${data.descontoComercialPct.toFixed(1)}% excede a alçada permitida. Requer autorização prévia da fábrica!`;
    } else if (faixaAplicada.fatorComissaoPct < 100) {
      statusAlcada = AlcadaStatus.REDUCAO_COMISSAO;
      comissaoEfetivaPct = Number(
        (data.comissaoPadraoPct * (faixaAplicada.fatorComissaoPct / 100)).toFixed(2)
      );
      mensagemAlcada = `ℹ️ Desconto de ${data.descontoComercialPct.toFixed(1)}% enquadrado na política de redução: comissão ajustada para ${comissaoEfetivaPct.toFixed(2)}% (${faixaAplicada.fatorComissaoPct}% da comissão integral).`;
    }

    const comissaoEstimadaValor = Number((subtotalLiquido * (comissaoEfetivaPct / 100)).toFixed(2));

    return {
      precoBaseOriginal: data.precoBaseTabela,
      fatorAjusteTabelaPct: data.fatorAjusteTabelaPct,
      precoTabelaUnitario,
      descontoComercialPct: data.descontoComercialPct,
      precoLiquidoUnitario,
      quantidade: data.quantidade,
      subtotalBruto,
      subtotalLiquido,
      totalDescontoValor,
      comissaoPadraoPct: data.comissaoPadraoPct,
      comissaoEfetivaPct,
      fatorReducaoComissaoPct: faixaAplicada.fatorComissaoPct,
      comissaoEstimadaValor,
      statusAlcada,
      faixaAplicada,
      mensagemAlcada,
    };
  }
}

export const pricingService = new PricingService();
