import { z } from 'zod';
import { UserRole } from './domain';

// Schemas Zod de Validação
export const RegisterSchema = z.object({
  razaoSocial: z.string().min(3, 'A Razão Social deve ter no mínimo 3 caracteres'),
  nomeFantasia: z.string().optional(),
  cnpjCpf: z.string().min(11, 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido'),
  registroCore: z.string().optional(),
  nome: z.string().min(3, 'O nome completo deve ter no mínimo 3 caracteres'),
  email: z.string().email('Informe um endereço de e-mail válido'),
  whatsapp: z.string().optional(),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número'),
});

export const LoginSchema = z.object({
  email: z.string().email('Informe um endereço de e-mail válido'),
  password: z.string().min(1, 'Informe sua senha de acesso'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Informe um endereço de e-mail válido'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token de recuperação inválido'),
  newPassword: z
    .string()
    .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A nova senha deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'A nova senha deve conter ao menos um número'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export interface SessionPayload {
  sub: string; // User ID
  tenantId: string; // Tenant ID
  email: string;
  nome: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    tenantId: string;
    nome: string;
    email: string;
    role: UserRole;
    tenantName: string;
  };
  tokens: AuthTokens;
}
