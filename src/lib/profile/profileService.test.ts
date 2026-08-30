import { describe, it, expect, beforeEach } from 'vitest';
import { profileService } from './profileService';
import { authRepository } from '@/lib/auth/authRepository';
import { UserRole } from '@/types/domain';

describe('ProfileService - Gestão de Perfil e Configurações (SDLC 3.3)', () => {
  let tenantId: string;
  let userId: string;

  beforeEach(async () => {
    authRepository.clear();

    const tenant = await authRepository.createTenant({
      razaoSocial: 'Silveira Representações Ltda',
      nomeFantasia: 'Silveira Reps',
      cnpjCpf: '12.345.678/0001-90',
      email: 'contato@silveirarep.com.br',
      plano: 'AUTONOMO',
      status: 'ACTIVE',
    });
    tenantId = tenant.id;

    const user = await authRepository.createUser({
      tenantId: tenant.id,
      nome: 'Roberto Silveira',
      email: 'roberto@silveirarep.com.br',
      role: UserRole.ADMIN_TITULAR,
      whatsapp: '16998881122',
      ativo: true,
      passwordHash: 'hash:123',
    });
    userId = user.id;
  });

  it('deve obter os dados de perfil e configurações de tenant consolidados', async () => {
    const profile = await profileService.getProfile(userId, tenantId);

    expect(profile.user.nome).toBe('Roberto Silveira');
    expect(profile.user.email).toBe('roberto@silveirarep.com.br');
    expect(profile.tenant.razaoSocial).toBe('Silveira Representações Ltda');
    expect(profile.tenant.cnpjCpf).toBe('12.345.678/0001-90');
  });

  it('deve atualizar as informações pessoais do representante', async () => {
    const updated = await profileService.updateUserProfile(userId, {
      nome: 'Roberto Silveira de Oliveira',
      whatsapp: '16999998888',
      telefone: '1633445566',
      bio: 'Especialista em representação comercial há mais de uma década.',
    });

    expect(updated.nome).toBe('Roberto Silveira de Oliveira');
    expect(updated.whatsapp).toBe('16999998888');
    expect(updated.bio).toContain('Especialista');

    const fresh = await profileService.getProfile(userId, tenantId);
    expect(fresh.user.nome).toBe('Roberto Silveira de Oliveira');
  });

  it('deve atualizar os dados cadastrais, endereço, CORE, logomarca e PIX do tenant', async () => {
    const updatedTenant = await profileService.updateTenantSettings(tenantId, {
      razaoSocial: 'Silveira & Filhos Representações Ltda',
      nomeFantasia: 'Silveira Representações',
      cnpjCpf: '12.345.678/0001-90',
      registroCore: 'CORE-SP 987654',
      email: 'financeiro@silveirarep.com.br',
      telefone: '1633221100',
      whatsapp: '16998881122',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
      chavePix: 'financeiro@silveirarep.com.br',
      logoUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      fusoHorario: 'America/Sao_Paulo',
      aliquotaStPadrao: 18.0,
    });

    expect(updatedTenant.razaoSocial).toBe('Silveira & Filhos Representações Ltda');
    expect(updatedTenant.registroCore).toBe('CORE-SP 987654');
    expect(updatedTenant.logoUrl).toContain('data:image/png');
    expect(updatedTenant.chavePix).toBe('financeiro@silveirarep.com.br');
    expect(updatedTenant.cidade).toBe('São Paulo');
  });

  it('deve lançar erro ao tentar consultar perfil de usuário inexistente', async () => {
    await expect(profileService.getProfile('id-inexistente', tenantId)).rejects.toThrow(
      'Usuário não encontrado.'
    );
  });
});
