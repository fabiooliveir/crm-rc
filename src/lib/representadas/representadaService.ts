import { Representada } from '@/types/domain';
import {
  CreateRepresentadaDTO,
  CreateRepresentadaSchema,
  UpdateRepresentadaDTO,
  UpdateRepresentadaSchema,
} from '@/types/representada';
import { representadaRepository } from './representadaRepository';

export class RepresentadaService {
  async listRepresentadas(
    tenantId: string,
    filters?: { ativo?: boolean; search?: string; segmento?: string }
  ): Promise<Representada[]> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    return representadaRepository.listByTenant(tenantId, filters);
  }

  async getRepresentadaById(id: string, tenantId: string): Promise<Representada> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const item = await representadaRepository.findById(id, tenantId);
    if (!item) {
      throw new Error('Representada não encontrada.');
    }
    return item;
  }

  async createRepresentada(
    tenantId: string,
    payload: CreateRepresentadaDTO
  ): Promise<Representada> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }

    const validated = CreateRepresentadaSchema.parse(payload);

    // Validação de duplicidade de CNPJ por tenant
    const existing = await representadaRepository.findByCnpj(validated.cnpj, tenantId);
    if (existing) {
      throw new Error(`Já existe uma representada cadastrada com o CNPJ/CPF ${validated.cnpj}.`);
    }

    return representadaRepository.create(tenantId, validated);
  }

  async updateRepresentada(
    id: string,
    tenantId: string,
    payload: UpdateRepresentadaDTO
  ): Promise<Representada> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }

    const validated = UpdateRepresentadaSchema.parse(payload);

    if (validated.cnpj) {
      const existing = await representadaRepository.findByCnpj(validated.cnpj, tenantId);
      if (existing && existing.id !== id) {
        throw new Error(
          `Já existe outra representada cadastrada com o CNPJ/CPF ${validated.cnpj}.`
        );
      }
    }

    const updated = await representadaRepository.update(id, tenantId, validated);
    if (!updated) {
      throw new Error('Representada não encontrada para atualização.');
    }
    return updated;
  }

  async toggleRepresentadaStatus(id: string, tenantId: string): Promise<Representada> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const updated = await representadaRepository.toggleStatus(id, tenantId);
    if (!updated) {
      throw new Error('Representada não encontrada para alteração de status.');
    }
    return updated;
  }

  async deleteRepresentada(id: string, tenantId: string): Promise<boolean> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const success = await representadaRepository.delete(id, tenantId);
    if (!success) {
      throw new Error('Representada não encontrada para exclusão.');
    }
    return true;
  }
}

export const representadaService = new RepresentadaService();
