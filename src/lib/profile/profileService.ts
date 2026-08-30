import { authRepository } from '@/lib/auth/authRepository';
import {
  UpdateUserProfileInput,
  UpdateTenantSettingsInput,
  ProfileDetailsResponse,
} from '@/types/profile';

export class ProfileService {
  /**
   * Obtém os detalhes consolidados de perfil do usuário e da empresa/tenant.
   */
  async getProfile(userId: string, tenantId: string): Promise<ProfileDetailsResponse> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const tenant = await authRepository.findTenantById(tenantId);
    if (!tenant) {
      throw new Error('Empresa/Representação não encontrada.');
    }

    return {
      user: {
        id: user.id,
        tenantId: user.tenantId,
        nome: user.nome,
        email: user.email,
        role: user.role,
        whatsapp: user.whatsapp,
        telefone: user.telefone,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
      tenant: {
        id: tenant.id,
        razaoSocial: tenant.razaoSocial,
        nomeFantasia: tenant.nomeFantasia,
        cnpjCpf: tenant.cnpjCpf,
        registroCore: tenant.registroCore,
        email: tenant.email,
        telefone: tenant.telefone,
        whatsapp: tenant.whatsapp,
        logoUrl: tenant.logoUrl,
        logradouro: tenant.logradouro,
        numero: tenant.numero,
        complemento: tenant.complemento,
        bairro: tenant.bairro,
        cidade: tenant.cidade,
        uf: tenant.uf,
        cep: tenant.cep,
        chavePix: tenant.chavePix,
        fusoHorario: tenant.fusoHorario,
        aliquotaStPadrao: tenant.aliquotaStPadrao,
        plano: tenant.plano,
        status: tenant.status,
      },
    };
  }

  /**
   * Atualiza as informações pessoais do representante.
   */
  async updateUserProfile(userId: string, input: UpdateUserProfileInput) {
    const updatedUser = await authRepository.updateUser(userId, input);
    if (!updatedUser) {
      throw new Error('Usuário não encontrado.');
    }
    return updatedUser;
  }

  /**
   * Atualiza as configurações cadastrais, fiscais, endereço e logomarca do Tenant.
   */
  async updateTenantSettings(tenantId: string, input: UpdateTenantSettingsInput) {
    const updatedTenant = await authRepository.updateTenant(tenantId, input);
    if (!updatedTenant) {
      throw new Error('Empresa/Representação não encontrada.');
    }
    return updatedTenant;
  }
}

export const profileService = new ProfileService();
