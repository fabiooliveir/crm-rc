import { Produto } from '@/types/domain';
import { CreateProdutoDTO, UpdateProdutoDTO } from '@/types/produto';

const produtosTable: Produto[] = [
  // Tintas Real (rep_1)
  {
    id: 'prod_1',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_1',
    codigoFabrica: 'TR-1010',
    ean: '7891234560011',
    descricao: 'Tinta Látex Acrílica Premium Fosco Branco Neve 18L',
    descricaoDetalhada:
      'Alta cobertura, lavável, secagem rápida e baixo odor para ambientes internos e externos.',
    ncm: '3209.10.10',
    categoria: 'Tintas Imobiliárias',
    unidadeMedida: 'L',
    multiploEmbalagem: 1,
    precoBase: 289.9,
    aliquotaIpiPct: 0.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'prod_2',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_1',
    codigoFabrica: 'TR-1020',
    ean: '7891234560028',
    descricao: 'Esmalte Sintético Brilhante Preto 3.6L',
    descricaoDetalhada:
      'Película protetora antiferrugem de alta durabilidade para metais e madeiras.',
    ncm: '3208.10.10',
    categoria: 'Esmaltes & Vernizes',
    unidadeMedida: 'CX',
    multiploEmbalagem: 4,
    precoBase: 94.5,
    aliquotaIpiPct: 5.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'prod_3',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_1',
    codigoFabrica: 'TR-1030',
    ean: '7891234560035',
    descricao: 'Selador Acrílico Concentrado Incolor 18L',
    descricaoDetalhada:
      'Uniformiza a absorção da alvenaria e aumenta o rendimento da tinta de acabamento.',
    ncm: '3209.10.20',
    categoria: 'Preparação de Superfície',
    unidadeMedida: 'UN',
    multiploEmbalagem: 1,
    precoBase: 145.0,
    aliquotaIpiPct: 0.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },

  // Ferramentas Fort (rep_2)
  {
    id: 'prod_4',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_2',
    codigoFabrica: 'FF-2010',
    ean: '7899876540019',
    descricao: 'Furadeira de Impacto Profissional 750W 1/2 Pol',
    descricaoDetalhada:
      'Motor blindado de alto torque com controle de velocidade e reversão para perfuração em concreto e aço.',
    ncm: '8467.21.00',
    categoria: 'Ferramentas Elétricas',
    unidadeMedida: 'UN',
    multiploEmbalagem: 2,
    precoBase: 349.9,
    aliquotaIpiPct: 10.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },
  {
    id: 'prod_5',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_2',
    codigoFabrica: 'FF-2020',
    ean: '7899876540026',
    descricao: 'Jogo de Chaves Combinadas Cromo Vanádio 8 a 22mm (12 peças)',
    descricaoDetalhada:
      'Aço cromo vanádio forjado com acabamento fosfatizado e estojo organizador.',
    ncm: '8204.11.00',
    categoria: 'Ferramentas Manuais',
    unidadeMedida: 'CX',
    multiploEmbalagem: 6,
    precoBase: 129.0,
    aliquotaIpiPct: 8.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },
  {
    id: 'prod_6',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_2',
    codigoFabrica: 'FF-2030',
    ean: '7899876540033',
    descricao: 'Trena Laser Digital Profissional Alcance 50m',
    descricaoDetalhada:
      'Medição precisa de distância, área e volume com visor retroiluminado e memória.',
    ncm: '9017.80.10',
    categoria: 'Instrumentos de Medição',
    unidadeMedida: 'UN',
    multiploEmbalagem: 3,
    precoBase: 219.0,
    aliquotaIpiPct: 5.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },

  // Master Imper (rep_3)
  {
    id: 'prod_7',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_3',
    codigoFabrica: 'MI-3010',
    ean: '7894567890014',
    descricao: 'Argamassa Colante AC-III Flexível Cinza 20kg',
    descricaoDetalhada:
      'Para assentamento de porcelanatos e placas de grandes formatos em áreas internas e externas.',
    ncm: '3824.50.00',
    categoria: 'Argamassas & Cimentos',
    unidadeMedida: 'SC',
    multiploEmbalagem: 50,
    precoBase: 38.9,
    aliquotaIpiPct: 0.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-10T09:15:00.000Z',
    updatedAt: '2026-08-10T09:15:00.000Z',
  },

  // Atlas Pincéis (rep_4)
  {
    id: 'prod_8',
    tenantId: 'tenant_demo_1',
    representadaId: 'rep_4',
    codigoFabrica: 'AT-4010',
    ean: '7893322110018',
    descricao: 'Rolo de Lã de Carneiro Antigota 23cm com Cabo',
    descricaoDetalhada: 'Manta especial que não respinga, ideal para tintas acrílicas e látex.',
    ncm: '9603.40.00',
    categoria: 'Acessórios de Pintura',
    unidadeMedida: 'CX',
    multiploEmbalagem: 12,
    precoBase: 24.9,
    aliquotaIpiPct: 0.0,
    fotoUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    ativo: true,
    createdAt: '2026-08-15T11:00:00.000Z',
    updatedAt: '2026-08-15T11:00:00.000Z',
  },
];

export const produtoRepository = {
  async listByTenant(
    tenantId: string,
    filters?: {
      representadaId?: string;
      search?: string;
      categoria?: string;
      ativo?: boolean;
    }
  ): Promise<Produto[]> {
    return produtosTable.filter((item) => {
      if (item.tenantId !== tenantId) return false;
      if (filters?.representadaId && item.representadaId !== filters.representadaId) {
        return false;
      }
      if (filters?.ativo !== undefined && item.ativo !== filters.ativo) {
        return false;
      }
      if (
        filters?.categoria &&
        filters.categoria !== 'TODAS' &&
        item.categoria !== filters.categoria
      ) {
        return false;
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchDesc = item.descricao.toLowerCase().includes(query);
        const matchSku = item.codigoFabrica.toLowerCase().includes(query);
        const matchCategoria = item.categoria?.toLowerCase().includes(query) ?? false;
        const cleanDigits = query.replace(/\D/g, '');
        const matchEan = cleanDigits.length > 0 && (item.ean?.includes(cleanDigits) ?? false);
        if (!matchDesc && !matchSku && !matchCategoria && !matchEan) return false;
      }
      return true;
    });
  },

  async findById(id: string, tenantId: string): Promise<Produto | null> {
    const item = produtosTable.find((p) => p.id === id && p.tenantId === tenantId);
    return item ? { ...item } : null;
  },

  async findBySku(
    codigoFabrica: string,
    representadaId: string,
    tenantId: string
  ): Promise<Produto | null> {
    const item = produtosTable.find(
      (p) =>
        p.tenantId === tenantId &&
        p.representadaId === representadaId &&
        p.codigoFabrica.trim().toUpperCase() === codigoFabrica.trim().toUpperCase()
    );
    return item ? { ...item } : null;
  },

  async create(tenantId: string, data: CreateProdutoDTO): Promise<Produto> {
    const newProduto: Produto = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      representadaId: data.representadaId,
      codigoFabrica: data.codigoFabrica.trim().toUpperCase(),
      ean: data.ean || undefined,
      descricao: data.descricao.trim(),
      descricaoDetalhada: data.descricaoDetalhada?.trim() || undefined,
      ncm: data.ncm?.trim() || undefined,
      categoria: data.categoria?.trim() || 'Geral',
      unidadeMedida: data.unidadeMedida || 'UN',
      multiploEmbalagem: data.multiploEmbalagem || 1,
      precoBase: data.precoBase,
      aliquotaIpiPct: data.aliquotaIpiPct,
      fotoUrl: data.fotoUrl || undefined,
      ativo: data.ativo ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    produtosTable.push(newProduto);
    return { ...newProduto };
  },

  async update(id: string, tenantId: string, data: UpdateProdutoDTO): Promise<Produto | null> {
    const index = produtosTable.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) return null;

    const current = produtosTable[index];
    const updated: Produto = {
      ...current,
      ...data,
      codigoFabrica: data.codigoFabrica
        ? data.codigoFabrica.trim().toUpperCase()
        : current.codigoFabrica,
      ean: data.ean !== undefined ? data.ean || undefined : current.ean,
      descricao: data.descricao ? data.descricao.trim() : current.descricao,
      fotoUrl: data.fotoUrl !== undefined ? data.fotoUrl || undefined : current.fotoUrl,
      updatedAt: new Date().toISOString(),
    };

    produtosTable[index] = updated;
    return { ...updated };
  },

  async toggleStatus(id: string, tenantId: string): Promise<Produto | null> {
    const item = await this.findById(id, tenantId);
    if (!item) return null;
    return this.update(id, tenantId, { ativo: !item.ativo });
  },

  async delete(id: string, tenantId: string): Promise<boolean> {
    const index = produtosTable.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) return false;
    produtosTable.splice(index, 1);
    return true;
  },

  async resetDemoData(tenantId: string) {
    const filtered = produtosTable.filter((p) => p.tenantId !== tenantId);
    produtosTable.length = 0;
    produtosTable.push(...filtered);
  },
};
