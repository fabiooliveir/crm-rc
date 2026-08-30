import { z } from 'zod';
import { FreteTipo } from './domain';

export const BaseCalculoComissaoEnum = z.enum(['FATURAMENTO', 'LIQUIDACAO']);

export const CreateRepresentadaSchema = z.object({
  razaoSocial: z.string().min(2, 'Razão Social deve ter pelo menos 2 caracteres'),
  nomeFantasia: z.string().min(2, 'Nome Fantasia deve ter pelo menos 2 caracteres'),
  cnpj: z.string().min(11, 'CNPJ ou CPF inválido'),
  inscricaoEstadual: z.string().optional(),
  emailPedidos: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefoneFabrica: z.string().optional(),
  whatsappFabrica: z.string().optional(),
  nomeContatoGerente: z.string().optional(),
  comissaoPadraoPct: z
    .number()
    .min(0, 'Comissão não pode ser negativa')
    .max(100, 'Comissão máxima de 100%'),
  baseCalculoComissao: BaseCalculoComissaoEnum.default('FATURAMENTO'),
  tipoFretePadrao: z.nativeEnum(FreteTipo).default(FreteTipo.CIF),
  prazoMedioEntregaDias: z.number().int().min(0).optional(),
  prazoMedioFaturamentoDias: z.number().int().min(0).optional(),
  pedidoMinimoValor: z.number().min(0).optional(),
  segmento: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const UpdateRepresentadaSchema = CreateRepresentadaSchema.partial();

export type CreateRepresentadaDTO = z.infer<typeof CreateRepresentadaSchema>;
export type UpdateRepresentadaDTO = z.infer<typeof UpdateRepresentadaSchema>;
