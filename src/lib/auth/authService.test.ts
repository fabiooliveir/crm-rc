import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from './authService';
import { authRepository } from './authRepository';
import { authRateLimiter } from './rateLimiter';
import { verifyJwt } from './crypto';

describe('AuthService - Fluxos de Autenticação Segura (SDLC 3.2)', () => {
  beforeEach(() => {
    authRepository.clear();
    authRateLimiter.clear('127.0.0.1:teste@rep.com.br');
  });

  const mockRegisterInput = {
    razaoSocial: 'Silveira Representações Ltda',
    cnpjCpf: '12.345.678/0001-90',
    nome: 'Roberto Silveira',
    email: 'teste@rep.com.br',
    whatsapp: '16998881122',
    password: 'SenhaForte123!',
  };

  it('deve registrar um novo Tenant e Usuário Administrador com sucesso', async () => {
    const response = await authService.register(mockRegisterInput);

    expect(response.user).toBeDefined();
    expect(response.user.email).toBe('teste@rep.com.br');
    expect(response.user.role).toBe('ADMIN_TITULAR');
    expect(response.user.tenantName).toBe('Silveira Representações Ltda');

    expect(response.tokens.accessToken).toBeDefined();
    expect(response.tokens.refreshToken).toBeDefined();

    const decoded = verifyJwt(response.tokens.accessToken);
    expect(decoded?.email).toBe('teste@rep.com.br');
    expect(decoded?.tenantId).toBe(response.user.tenantId);
  });

  it('não deve permitir registro com e-mail duplicado', async () => {
    await authService.register(mockRegisterInput);

    await expect(authService.register(mockRegisterInput)).rejects.toThrow(
      'Já existe um usuário cadastrado com este endereço de e-mail.'
    );
  });

  it('deve realizar login com credenciais corretas', async () => {
    await authService.register(mockRegisterInput);

    const loginResponse = await authService.login({
      email: 'teste@rep.com.br',
      password: 'SenhaForte123!',
    });

    expect(loginResponse.user.email).toBe('teste@rep.com.br');
    expect(loginResponse.tokens.accessToken).toBeDefined();
  });

  it('deve rejeitar login com senha incorreta', async () => {
    await authService.register(mockRegisterInput);

    await expect(
      authService.login({
        email: 'teste@rep.com.br',
        password: 'SenhaIncorreta999!',
      })
    ).rejects.toThrow('E-mail ou senha incorretos.');
  });

  it('deve bloquear login por rate limiting após 5 tentativas falhas consecutivas', async () => {
    await authService.register(mockRegisterInput);
    const ip = '192.168.1.100';

    for (let i = 0; i < 5; i++) {
      try {
        await authService.login({ email: 'teste@rep.com.br', password: 'err' }, ip);
      } catch {
        // Ignora falhas esperadas
      }
    }

    await expect(
      authService.login({ email: 'teste@rep.com.br', password: 'SenhaForte123!' }, ip)
    ).rejects.toThrow('Muitas tentativas inválidas. Por favor, aguarde 1 minuto');
  });

  it('deve renovar os tokens a partir de um Refresh Token válido', async () => {
    const registerResponse = await authService.register(mockRegisterInput);
    const newTokens = await authService.refresh(registerResponse.tokens.refreshToken);

    expect(newTokens.accessToken).toBeDefined();
    expect(newTokens.refreshToken).toBeDefined();

    const decoded = verifyJwt(newTokens.accessToken);
    expect(decoded?.sub).toBe(registerResponse.user.id);
  });

  it('deve processar o fluxo de recuperação de senha com token temporário', async () => {
    await authService.register(mockRegisterInput);

    const { resetToken } = await authService.forgotPassword('teste@rep.com.br');
    expect(resetToken).toBeDefined();

    const resetSuccess = await authService.resetPassword({
      token: resetToken!,
      newPassword: 'NovaSenha12345!',
    });
    expect(resetSuccess).toBe(true);

    // Login com a nova senha
    const loginResponse = await authService.login({
      email: 'teste@rep.com.br',
      password: 'NovaSenha12345!',
    });
    expect(loginResponse.user.email).toBe('teste@rep.com.br');
  });
});
