import { TabelaPreco, AlcadaFaixa, CondicaoPagamento } from '@/types/domain';
import { CreateTabelaPrecoDTO, UpdateTabelaPrecoDTO } from '@/types/pricing';

export const alcadasPadraoCRM: AlcadaFaixa[] = [
  {
    descontoMaximoPct: 5.0,
    fatorComissaoPct: 100.0,
    requerAutorizacao: false,
    descricao: 'Faixa 1 (0% a 5%): Comissão Integral (100%)',
  },
  {
    descontoMaximoPct: 10.0,
    fatorComissaoPct: 80.0,
    requerAutorizacao: false,
    descricao: 'Faixa 2 (5.1% a 10%): Redução de 20% na comissão (80% efetiva)',
  },
  {
    descontoMaximoPct: 15.0,
    fatorComissaoPct: 50.0,
    requerAutorizacao: false,
    descricao: 'Faixa 3 (10.1% a 15%): Redução de 50% na comissão (50% efetiva)',
  },
  {
    descontoMaximoPct: 100.0,
    fatorComissaoPct: 0.0,
    requerAutorizacao: true,
    descricao: 'Faixa 4 (> 15%): Requer autorização prévia da fábrica (bloqueio de pedido)',
  },
];

const condicoesPadrao: CondicaoPagamento[] = [
  {
    id: 'cond_vista',
    descricao: 'À Vista (PIX / TED Antecipado)',
    diasPrazos: [0],
    descontoAdicionalPct: 3.0,
    ativo: true,
  },
  {
    id: 'cond_30ddl',
    descricao: '30 DDL (Boleto Bancário)',
    diasPrazos: [30],
    pedidoMinimoValor: 500.0,
    ativo: true,
  },
  {
    id: 'cond_28_42_56',
    descricao: '28 / 42 / 56 dias (Boleto Faturado)',
    diasPrazos: [28, 42, 56],
    pedidoMinimoValor: 2000.0,
    ativo: true,
  },
  {
    id: 'cond_30_60_90',
    descricao: '30 / 60 / 90 dias (Grandes Contas)',
    diasPrazos: [30, 60, 90],
    pedidoMinimoValor: 5000.0,
    ativo: true,
  },
];

const tabelasPrecoTable: TabelaPreco[] = [
  // Tintas Real (rep_1)
  {
    id: 'tab_tr_balcao',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_1',
    nome: 'Tabela Padrão Balcão - Tintas Real',
    descricao: 'Preço de tabela oficial para pequenos lojistas e depósitos de bairro.',
    fatorAjustePadraoPct: 0.0,
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    padrao: true,
    ativo: true,
    condicoesPagamento: [...condicoesPadrao],
    alcadasDesconto: [...alcadasPadraoCRM],
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'tab_tr_distribuidor',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_1',
    nome: 'Tabela Distribuidor (-10%) - Tintas Real',
    descricao: 'Condições comerciais para revendas e redes regionais com faturamento médio.',
    fatorAjustePadraoPct: -10.0,
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    padrao: false,
    ativo: true,
    condicoesPagamento: [...condicoesPadrao],
    alcadasDesconto: [...alcadasPadraoCRM],
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },

  // Ferramentas Fort (rep_2)
  {
    id: 'tab_ff_padrao',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_2',
    nome: 'Tabela Base 2026 - Ferramentas Fort',
    descricao: 'Tabela de ferramentas elétricas e manuais para varejo da construção civil.',
    fatorAjustePadraoPct: 0.0,
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    padrao: true,
    ativo: true,
    condicoesPagamento: [...condicoesPadrao],
    alcadasDesconto: [...alcadasPadraoCRM],
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },
  {
    id: 'tab_ff_atacado',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_2',
    nome: 'Tabela Grandes Atacadistas (-15%) - Ferramentas Fort',
    descricao: 'Destinada a compras em grandes volumes com pedido mínimo de R$ 10.000,00.',
    fatorAjustePadraoPct: -15.0,
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    padrao: false,
    ativo: true,
    condicoesPagamento: [...condicoesPadrao],
    alcadasDesconto: [...alcadasPadraoCRM],
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },
];

export const pricingRepository = {
  async listByTenant(
    tenantId: string,
    filters?: { representadaId?: string; ativo?: boolean }
  ): Promise<TabelaPreco[]> {
    return tabelasPrecoTable.filter((item) => {
      if (item.tenantId !== tenantId) return false;
      if (filters?.representadaId && item.representadaId !== filters.representadaId) {
        return false;
      }
      if (filters?.ativo !== undefined && item.ativo !== filters.ativo) {
        return false;
      }
      return true;
    });
  },

  async findById(id: string, tenantId: string): Promise<TabelaPreco | null> {
    const item = tabelasPrecoTable.find((t) => t.id === id && t.tenantId === tenantId);
    return item ? { ...item } : null;
  },

  async findByNome(
    nome: string,
    representadaId: string,
    tenantId: string
  ): Promise<TabelaPreco | null> {
    const item = tabelasPrecoTable.find(
      (t) =>
        t.tenantId === tenantId &&
        t.representadaId === representadaId &&
        t.nome.trim().toLowerCase() === nome.trim().toLowerCase()
    );
    return item ? { ...item } : null;
  },

  async create(tenantId: string, data: CreateTabelaPrecoDTO): Promise<TabelaPreco> {
    const condicoesPagamentoMapeadas: CondicaoPagamento[] = data.condicoesPagamento?.length
      ? data.condicoesPagamento.map((c) => ({
          id: c.id,
          descricao: c.descricao,
          diasPrazos: c.diasPrazos,
          descontoAdicionalPct: c.descontoAdicionalPct,
          acrescimoPct: c.acrescimoPct,
          pedidoMinimoValor: c.pedidoMinimoValor,
          ativo: c.ativo ?? true,
        }))
      : [...condicoesPadrao];

    const alcadasDescontoMapeadas: AlcadaFaixa[] = data.alcadasDesconto?.length
      ? data.alcadasDesconto.map((a) => ({
          descontoMaximoPct: a.descontoMaximoPct,
          fatorComissaoPct: a.fatorComissaoPct,
          requerAutorizacao: a.requerAutorizacao ?? false,
          descricao: a.descricao,
        }))
      : [...alcadasPadraoCRM];

    const newTabela: TabelaPreco = {
      id: `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      representadaId: data.representadaId,
      nome: data.nome.trim(),
      descricao: data.descricao?.trim() || undefined,
      fatorAjustePadraoPct: data.fatorAjustePadraoPct ?? 0,
      vigenciaInicio: data.vigenciaInicio || undefined,
      vigenciaFim: data.vigenciaFim || undefined,
      padrao: data.padrao ?? false,
      ativo: data.ativo ?? true,
      condicoesPagamento: condicoesPagamentoMapeadas,
      alcadasDesconto: alcadasDescontoMapeadas,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tabelasPrecoTable.push(newTabela);
    return { ...newTabela };
  },

  async update(
    id: string,
    tenantId: string,
    data: UpdateTabelaPrecoDTO
  ): Promise<TabelaPreco | null> {
    const index = tabelasPrecoTable.findIndex((t) => t.id === id && t.tenantId === tenantId);
    if (index === -1) return null;

    const current = tabelasPrecoTable[index];

    const condicoesPagamentoMapeadas: CondicaoPagamento[] | undefined = data.condicoesPagamento
      ? data.condicoesPagamento.map((c) => ({
          id: c.id,
          descricao: c.descricao,
          diasPrazos: c.diasPrazos,
          descontoAdicionalPct: c.descontoAdicionalPct,
          acrescimoPct: c.acrescimoPct,
          pedidoMinimoValor: c.pedidoMinimoValor,
          ativo: c.ativo ?? true,
        }))
      : undefined;

    const alcadasDescontoMapeadas: AlcadaFaixa[] | undefined = data.alcadasDesconto
      ? data.alcadasDesconto.map((a) => ({
          descontoMaximoPct: a.descontoMaximoPct,
          fatorComissaoPct: a.fatorComissaoPct,
          requerAutorizacao: a.requerAutorizacao ?? false,
          descricao: a.descricao,
        }))
      : undefined;

    const updated: TabelaPreco = {
      ...current,
      ...data,
      nome: data.nome ? data.nome.trim() : current.nome,
      condicoesPagamento: condicoesPagamentoMapeadas ?? current.condicoesPagamento,
      alcadasDesconto: alcadasDescontoMapeadas ?? current.alcadasDesconto,
      updatedAt: new Date().toISOString(),
    };

    tabelasPrecoTable[index] = updated;
    return { ...updated };
  },

  async delete(id: string, tenantId: string): Promise<boolean> {
    const index = tabelasPrecoTable.findIndex((t) => t.id === id && t.tenantId === tenantId);
    if (index === -1) return false;
    tabelasPrecoTable.splice(index, 1);
    return true;
  },

  async resetDemoData(tenantId: string) {
    const filtered = tabelasPrecoTable.filter((t) => t.tenantId !== tenantId);
    tabelasPrecoTable.length = 0;
    tabelasPrecoTable.push(...filtered);
  },
};
