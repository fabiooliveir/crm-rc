import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  AuthResponse,
  AuthTokens,
  SessionPayload,
} from '@/types/auth';
import { UserRole } from '@/types/domain';
import { hashPassword, verifyPassword, createJwt, verifyJwt, generateSecureToken } from './crypto';
import { authRepository } from './authRepository';
import { authRateLimiter } from './rateLimiter';

export class AuthService {
  private generateTokens(payload: SessionPayload): AuthTokens {
    const accessToken = createJwt(payload, 900); // 15 minutos
    const refreshToken = createJwt(payload, 2592000, true); // 30 dias

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  /**
   * Registra um novo Tenant e o Usuário Administrador/Titular.
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new Error('Já existe um usuário cadastrado com este endereço de e-mail.');
    }

    // 1. Cria a Conta / Tenant Soberano
    const tenant = await authRepository.createTenant({
      razaoSocial: input.razaoSocial,
      nomeFantasia: input.nomeFantasia,
      cnpjCpf: input.cnpjCpf,
      registroCore: input.registroCore,
      email: input.email,
      telefone: input.whatsapp,
      plano: 'AUTONOMO',
      status: 'ACTIVE',
    });

    // 2. Hash da Senha
    const passwordHash = await hashPassword(input.password);

    // 3. Cria o Usuário Administrador / Titular da Carteira
    const user = await authRepository.createUser({
      tenantId: tenant.id,
      nome: input.nome,
      email: input.email,
      role: UserRole.ADMIN_TITULAR,
      whatsapp: input.whatsapp,
      ativo: true,
      passwordHash,
    });

    const sessionPayload: SessionPayload = {
      sub: user.id,
      tenantId: tenant.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };

    const tokens = this.generateTokens(sessionPayload);

    return {
      user: {
        id: user.id,
        tenantId: tenant.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        tenantName: tenant.razaoSocial,
      },
      tokens,
    };
  }

  /**
   * Autentica o usuário validando credenciais, rate limiting e gerando tokens JWT.
   */
  async login(input: LoginInput, clientIp = '127.0.0.1'): Promise<AuthResponse> {
    const rateLimitKey = `${clientIp}:${input.email.toLowerCase()}`;

    if (authRateLimiter.isRateLimited(rateLimitKey)) {
      throw new Error(
        'Muitas tentativas inválidas. Por favor, aguarde 1 minuto antes de tentar novamente.'
      );
    }

    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.ativo) {
      authRateLimiter.recordFailure(rateLimitKey);
      throw new Error('E-mail ou senha incorretos.');
    }

    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      authRateLimiter.recordFailure(rateLimitKey);
      throw new Error('E-mail ou senha incorretos.');
    }

    authRateLimiter.clear(rateLimitKey);

    const tenant = await authRepository.findTenantById(user.tenantId);
    if (!tenant || tenant.status === 'SUSPENDED') {
      throw new Error('Sua conta está suspensa ou inativa. Entre em contato com o suporte.');
    }

    const sessionPayload: SessionPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };

    const tokens = this.generateTokens(sessionPayload);

    return {
      user: {
        id: user.id,
        tenantId: user.tenantId,
        nome: user.nome,
        email: user.email,
        role: user.role,
        tenantName: tenant.razaoSocial,
      },
      tokens,
    };
  }

  /**
   * Renova o par de tokens a partir de um Refresh Token válido.
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyJwt(refreshToken, true);
    if (!payload) {
      throw new Error('Sessão expirada ou token inválido. Por favor, faça login novamente.');
    }

    const user = await authRepository.findUserById(payload.sub);
    if (!user || !user.ativo || user.tenantId !== payload.tenantId) {
      throw new Error('Usuário inválido ou inativo.');
    }

    const newSessionPayload: SessionPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };

    return this.generateTokens(newSessionPayload);
  }

  /**
   * Solicita link temporário de recuperação de senha.
   */
  async forgotPassword(email: string): Promise<{ success: boolean; resetToken?: string }> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      // Retorna sucesso para evitar enumeração de contas de usuários (OWASP A07)
      return { success: true };
    }

    const resetToken = generateSecureToken(32);
    await authRepository.savePasswordResetToken(resetToken, user.id, 3600000); // 1 hora de validade

    // Em produção: disparar e-mail transacional com o link https://crm-rc.app/reset-password?token=...
    return { success: true, resetToken };
  }

  /**
   * Redefine a senha do usuário utilizando o token temporário.
   */
  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const resetRecord = await authRepository.findPasswordResetToken(input.token);
    if (!resetRecord) {
      throw new Error('O token de recuperação é inválido ou já expirou.');
    }

    const newPasswordHash = await hashPassword(input.newPassword);
    await authRepository.updateUserPassword(resetRecord.userId, newPasswordHash);
    await authRepository.markPasswordResetTokenUsed(input.token);

    return true;
  }
}

export const authService = new AuthService();
