/**
 * Tipos e Enums de Domínio do CRM-RC (SDLC 1.4 & SDLC 3.1)
 */

export enum UserRole {
  ADMIN_TITULAR = 'ADMIN_TITULAR',
  PREPOSTO_CAMPO = 'PREPOSTO_CAMPO',
  ASSISTENTE_BACKOFFICE = 'ASSISTENTE_BACKOFFICE',
}

export enum PessoaTipo {
  PF = 'PF',
  PJ = 'PJ',
}

export enum ClienteStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  PROSPECT = 'PROSPECT',
  BLOQUEADO = 'BLOQUEADO',
}

export enum PedidoStatus {
  RASCUNHO = 'RASCUNHO',
  EMITIDO = 'EMITIDO',
  ENVIADO_FABRICA = 'ENVIADO_FABRICA',
  FATURADO_PARCIAL = 'FATURADO_PARCIAL',
  FATURADO_TOTAL = 'FATURADO_TOTAL',
  CANCELADO = 'CANCELADO',
  RECUSADO = 'RECUSADO',
}

export enum FreteTipo {
  CIF = 'CIF',
  FOB = 'FOB',
}

export enum ComissaoStatus {
  PREVISTA = 'PREVISTA',
  FATURADA = 'FATURADA',
  LIQUIDADA = 'LIQUIDADA',
  GLOSADA = 'GLOSADA',
}

export enum InteracaoTipo {
  VISITA_PRESENCIAL = 'VISITA_PRESENCIAL',
  LIGACAO = 'LIGACAO',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  REUNIAO_ONLINE = 'REUNIAO_ONLINE',
  LEMBRETE_RETORNO = 'LEMBRETE_RETORNO',
}

export interface Tenant {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpjCpf: string;
  registroCore?: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  logoUrl?: string; // Base64 data URL ou CDN
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  chavePix?: string;
  fusoHorario?: string;
  aliquotaStPadrao?: number;
  plano: 'AUTONOMO' | 'ESCRITORIO_PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  nome: string;
  email: string;
  role: UserRole;
  whatsapp?: string;
  telefone?: string;
  avatarUrl?: string;
  bio?: string;
  ativo: boolean;
}

export interface Cliente {
  id: string;
  tenantId: string;
  tipoPessoa: PessoaTipo;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpjCpf: string;
  inscricaoEstadual?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  cidade: string;
  uf: string;
  status: ClienteStatus;
  limiteCredito?: number;
  tags?: string[];
}

export enum BaseCalculoComissao {
  FATURAMENTO = 'FATURAMENTO',
  LIQUIDACAO = 'LIQUIDACAO',
}

export interface Representada {
  id: string;
  tenantId: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  emailPedidos?: string;
  telefoneFabrica?: string;
  whatsappFabrica?: string;
  nomeContatoGerente?: string;
  comissaoPadraoPct: number;
  baseCalculoComissao: BaseCalculoComissao;
  tipoFretePadrao: FreteTipo;
  prazoMedioEntregaDias?: number;
  prazoMedioFaturamentoDias?: number;
  pedidoMinimoValor?: number;
  segmento?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Produto {
  id: string;
  tenantId: string;
  representadaId: string;
  codigoFabrica: string;
  ean?: string;
  descricao: string;
  ncm?: string;
  unidadeMedida: string;
  multiploEmbalagem: number;
  precoBase: number;
  ativo: boolean;
}

export interface PedidoItem {
  id: string;
  produtoId: string;
  descricao: string;
  codigoFabrica: string;
  quantidade: number;
  quantidadeCaixas: number;
  precoUnitario: number;
  descontoPct: number;
  subtotal: number;
  comissaoPctAplicada: number;
}

export interface PedidoVenda {
  id: string;
  tenantId: string;
  prepostoId: string;
  clienteId: string;
  representadaId: string;
  tabelaPrecoId?: string;
  dataEmissao: string;
  tipoFrete: FreteTipo;
  condicaoPagamento: string;
  totalBruto: number;
  totalDescontos: number;
  totalLiquido: number;
  comissaoPrevista: number;
  status: PedidoStatus;
  uuidOffline?: string;
  itens: PedidoItem[];
}
