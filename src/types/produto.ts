import { z } from 'zod';

export const UnidadeMedidaEnum = z.enum(['UN', 'CX', 'L', 'KG', 'SC', 'PALLET', 'M2', 'PC']);

export const CreateProdutoSchema = z.object({
  representadaId: z.string().min(1, 'Representada é obrigatória'),
  codigoFabrica: z.string().min(1, 'Código SKU da fábrica é obrigatório'),
  ean: z.string().optional().or(z.literal('')),
  descricao: z.string().min(2, 'Descrição do produto deve ter pelo menos 2 caracteres'),
  descricaoDetalhada: z.string().optional(),
  ncm: z.string().optional(),
  categoria: z.string().optional(),
  unidadeMedida: UnidadeMedidaEnum.optional().default('UN'),
  multiploEmbalagem: z
    .number()
    .int('Múltiplo de embalagem deve ser um número inteiro')
    .min(1, 'Múltiplo de embalagem deve ser no mínimo 1 (RN-03)')
    .optional()
    .default(1),
  precoBase: z.number().min(0, 'Preço base não pode ser negativo'),
  aliquotaIpiPct: z.number().min(0).max(100).optional(),
  fotoUrl: z.string().optional(),
  ativo: z.boolean().optional().default(true),
});

export const UpdateProdutoSchema = CreateProdutoSchema.partial();

export type CreateProdutoDTO = z.input<typeof CreateProdutoSchema>;
export type UpdateProdutoDTO = z.input<typeof UpdateProdutoSchema>;
export type ProdutoParsed = z.infer<typeof CreateProdutoSchema>;
