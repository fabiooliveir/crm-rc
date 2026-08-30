import { BaseCalculoComissao, FreteTipo, Representada } from '@/types/domain';
import { CreateRepresentadaDTO, UpdateRepresentadaDTO } from '@/types/representada';

// Armazenamento em memória com isolamento multi-tenant (simulando persistência local/SQLite/PostgreSQL)
const representadasTable: Representada[] = [
  {
    id: 'rep_1',
    tenantId: 'tenant_demo_1',
    razaoSocial: 'Tintas Real Indústria e Comércio S.A.',
    nomeFantasia: 'Tintas Real',
    cnpj: '12.345.678/0001-90',
    inscricaoEstadual: '112.334.556.789',
    emailPedidos: 'pedidos@tintasreal.com.br',
    telefoneFabrica: '(11) 3456-7890',
    whatsappFabrica: '5511988881234',
    nomeContatoGerente: 'Carlos Eduardo (Gerente Regional)',
    comissaoPadraoPct: 5.0,
    baseCalculoComissao: BaseCalculoComissao.FATURAMENTO,
    tipoFretePadrao: FreteTipo.CIF,
    prazoMedioEntregaDias: 5,
    prazoMedioFaturamentoDias: 28,
    pedidoMinimoValor: 2000.0,
    segmento: 'Tintas & Químicos',
    ativo: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'rep_2',
    tenantId: 'tenant_demo_1',
    razaoSocial: 'Ferramentas Fort do Brasil Ltda.',
    nomeFantasia: 'Ferramentas Fort',
    cnpj: '98.765.432/0001-10',
    inscricaoEstadual: '987.654.321.000',
    emailPedidos: 'faturamento@ferramentasfort.com.br',
    telefoneFabrica: '(19) 3888-4400',
    whatsappFabrica: '5519977774433',
    nomeContatoGerente: 'Mariana Costa (Suporte Comercial)',
    comissaoPadraoPct: 6.5,
    baseCalculoComissao: BaseCalculoComissao.LIQUIDACAO,
    tipoFretePadrao: FreteTipo.FOB,
    prazoMedioEntregaDias: 7,
    prazoMedioFaturamentoDias: 30,
    pedidoMinimoValor: 1500.0,
    segmento: 'Ferramentas & Ferragens',
    ativo: true,
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },
  {
    id: 'rep_3',
    tenantId: 'tenant_demo_1',
    razaoSocial: 'Argamassas & Impermeabilizantes Master S/A',
    nomeFantasia: 'Master Imper',
    cnpj: '45.678.901/0001-23',
    inscricaoEstadual: '456.789.012.345',
    emailPedidos: 'pedidos@masterimper.com.br',
    telefoneFabrica: '(16) 3322-1100',
    whatsappFabrica: '5516991112233',
    nomeContatoGerente: 'Rodrigo Pires (Gerente de Vendas)',
    comissaoPadraoPct: 4.0,
    baseCalculoComissao: BaseCalculoComissao.FATURAMENTO,
    tipoFretePadrao: FreteTipo.CIF,
    prazoMedioEntregaDias: 3,
    prazoMedioFaturamentoDias: 21,
    pedidoMinimoValor: 3500.0,
    segmento: 'Construção Civil',
    ativo: true,
    createdAt: '2026-08-10T09:15:00.000Z',
    updatedAt: '2026-08-10T09:15:00.000Z',
  },
  {
    id: 'rep_4',
    tenantId: 'tenant_demo_1',
    razaoSocial: 'Pincéis & Acessórios Atlas Brasil Ltda.',
    nomeFantasia: 'Atlas Pincéis',
    cnpj: '33.222.111/0001-88',
    inscricaoEstadual: '332.221.118.800',
    emailPedidos: 'comercial@atlaspinceis.com.br',
    telefoneFabrica: '(51) 3200-5500',
    whatsappFabrica: '5551984445566',
    nomeContatoGerente: 'Fernanda Lima (Atendimento)',
    comissaoPadraoPct: 7.0,
    baseCalculoComissao: BaseCalculoComissao.FATURAMENTO,
    tipoFretePadrao: FreteTipo.CIF,
    prazoMedioEntregaDias: 6,
    prazoMedioFaturamentoDias: 28,
    pedidoMinimoValor: 1200.0,
    segmento: 'Acessórios de Pintura',
    ativo: true,
    createdAt: '2026-08-15T11:00:00.000Z',
    updatedAt: '2026-08-15T11:00:00.000Z',
  },
];

export const representadaRepository = {
  async listByTenant(
    tenantId: string,
    filters?: { ativo?: boolean; search?: string; segmento?: string }
  ): Promise<Representada[]> {
    return representadasTable.filter((item) => {
      if (item.tenantId !== tenantId) return false;
      if (filters?.ativo !== undefined && item.ativo !== filters.ativo) return false;
      if (filters?.segmento && filters.segmento !== 'TODOS' && item.segmento !== filters.segmento) {
        return false;
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchNome = item.nomeFantasia.toLowerCase().includes(query);
        const matchRazao = item.razaoSocial.toLowerCase().includes(query);
        const cleanDigits = query.replace(/\D/g, '');
        const matchCnpj =
          cleanDigits.length > 0 && item.cnpj.replace(/\D/g, '').includes(cleanDigits);
        if (!matchNome && !matchRazao && !matchCnpj) return false;
      }
      return true;
    });
  },

  async findById(id: string, tenantId: string): Promise<Representada | null> {
    const item = representadasTable.find((r) => r.id === id && r.tenantId === tenantId);
    return item ? { ...item } : null;
  },

  async findByCnpj(cnpj: string, tenantId: string): Promise<Representada | null> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const item = representadasTable.find(
      (r) => r.tenantId === tenantId && r.cnpj.replace(/\D/g, '') === cleanCnpj
    );
    return item ? { ...item } : null;
  },

  async create(tenantId: string, data: CreateRepresentadaDTO): Promise<Representada> {
    const newRepresentada: Representada = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      razaoSocial: data.razaoSocial,
      nomeFantasia: data.nomeFantasia,
      cnpj: data.cnpj,
      inscricaoEstadual: data.inscricaoEstadual,
      emailPedidos: data.emailPedidos || undefined,
      telefoneFabrica: data.telefoneFabrica,
      whatsappFabrica: data.whatsappFabrica,
      nomeContatoGerente: data.nomeContatoGerente,
      comissaoPadraoPct: data.comissaoPadraoPct,
      baseCalculoComissao:
        (data.baseCalculoComissao as BaseCalculoComissao) || BaseCalculoComissao.FATURAMENTO,
      tipoFretePadrao: data.tipoFretePadrao || FreteTipo.CIF,
      prazoMedioEntregaDias: data.prazoMedioEntregaDias,
      prazoMedioFaturamentoDias: data.prazoMedioFaturamentoDias,
      pedidoMinimoValor: data.pedidoMinimoValor,
      segmento: data.segmento || 'Geral',
      ativo: data.ativo ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    representadasTable.push(newRepresentada);
    return { ...newRepresentada };
  },

  async update(
    id: string,
    tenantId: string,
    data: UpdateRepresentadaDTO
  ): Promise<Representada | null> {
    const index = representadasTable.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) return null;

    const current = representadasTable[index];
    const updated: Representada = {
      ...current,
      ...data,
      emailPedidos:
        data.emailPedidos !== undefined ? data.emailPedidos || undefined : current.emailPedidos,
      baseCalculoComissao:
        (data.baseCalculoComissao as BaseCalculoComissao) || current.baseCalculoComissao,
      updatedAt: new Date().toISOString(),
    };

    representadasTable[index] = updated;
    return { ...updated };
  },

  async toggleStatus(id: string, tenantId: string): Promise<Representada | null> {
    const item = await this.findById(id, tenantId);
    if (!item) return null;
    return this.update(id, tenantId, { ativo: !item.ativo });
  },

  async delete(id: string, tenantId: string): Promise<boolean> {
    const index = representadasTable.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) return false;
    representadasTable.splice(index, 1);
    return true;
  },

  // Método auxiliar para testes e resets controlados
  async resetDemoData(tenantId: string) {
    const filtered = representadasTable.filter((r) => r.tenantId !== tenantId);
    representadasTable.length = 0;
    representadasTable.push(...filtered);
  },
};
