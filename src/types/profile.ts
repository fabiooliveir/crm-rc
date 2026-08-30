import { z } from 'zod';

export const UpdateUserProfileSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  whatsapp: z.string().optional(),
  telefone: z.string().optional(),
  bio: z.string().max(300, 'A biografia deve ter no máximo 300 caracteres').optional(),
  avatarUrl: z.string().optional(),
});

export const UpdateTenantSettingsSchema = z.object({
  razaoSocial: z.string().min(3, 'A Razão Social deve ter no mínimo 3 caracteres'),
  nomeFantasia: z.string().optional(),
  cnpjCpf: z.string().min(11, 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido'),
  registroCore: z.string().optional(),
  email: z.string().email('Informe um e-mail válido'),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  logoUrl: z.string().optional(), // Base64 data URL ou link
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().max(2, 'Informe a sigla do estado com 2 letras (ex: SP)').optional(),
  cep: z.string().optional(),
  chavePix: z.string().optional(),
  fusoHorario: z.string().default('America/Sao_Paulo'),
  aliquotaStPadrao: z.number().min(0).max(100).optional(),
});

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateTenantSettingsInput = z.infer<typeof UpdateTenantSettingsSchema>;

export interface ProfileDetailsResponse {
  user: {
    id: string;
    tenantId: string;
    nome: string;
    email: string;
    role: string;
    whatsapp?: string;
    telefone?: string;
    bio?: string;
    avatarUrl?: string;
  };
  tenant: {
    id: string;
    razaoSocial: string;
    nomeFantasia?: string;
    cnpjCpf: string;
    registroCore?: string;
    email: string;
    telefone?: string;
    whatsapp?: string;
    logoUrl?: string;
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
    plano: string;
    status: string;
  };
}
