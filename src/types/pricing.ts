import { z } from 'zod';

export const AlcadaFaixaSchema = z.object({
  descontoMaximoPct: z.number().min(0).max(100),
  fatorComissaoPct: z.number().min(0).max(100),
  requerAutorizacao: z.boolean().default(false),
  descricao: z.string(),
});

export const CondicaoPagamentoSchema = z.object({
  id: z.string(),
  descricao: z.string().min(1, 'Descrição da condição é obrigatória'),
  diasPrazos: z.array(z.number().int().min(0)),
  descontoAdicionalPct: z.number().min(0).max(100).optional(),
  acrescimoPct: z.number().min(0).max(100).optional(),
  pedidoMinimoValor: z.number().min(0).optional(),
  ativo: z.boolean().default(true),
});

export const CreateTabelaPrecoSchema = z.object({
  representadaId: z.string().min(1, 'Representada é obrigatória'),
  nome: z.string().min(2, 'Nome da tabela deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  fatorAjustePadraoPct: z.number().min(-90).max(100).default(0), // Ex: -10 para 10% desc base
  vigenciaInicio: z.string().optional(),
  vigenciaFim: z.string().optional(),
  padrao: z.boolean().optional().default(false),
  ativo: z.boolean().optional().default(true),
  condicoesPagamento: z.array(CondicaoPagamentoSchema).optional().default([]),
  alcadasDesconto: z.array(AlcadaFaixaSchema).optional().default([]),
});

export const UpdateTabelaPrecoSchema = CreateTabelaPrecoSchema.partial();

export const CalculoPrecoItemSchema = z.object({
  precoBaseTabela: z.number().min(0),
  fatorAjusteTabelaPct: z.number().min(-90).max(100).default(0),
  descontoComercialPct: z.number().min(0).max(100).default(0),
  comissaoPadraoPct: z.number().min(0).max(100),
  alcadasDesconto: z.array(AlcadaFaixaSchema).optional(),
  quantidade: z.number().min(1).default(1),
});

export type CreateTabelaPrecoDTO = z.input<typeof CreateTabelaPrecoSchema>;
export type UpdateTabelaPrecoDTO = z.input<typeof UpdateTabelaPrecoSchema>;
export type CalculoPrecoItemDTO = z.infer<typeof CalculoPrecoItemSchema>;
