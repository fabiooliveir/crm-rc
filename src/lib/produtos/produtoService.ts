import { Produto } from '@/types/domain';
import {
  CreateProdutoDTO,
  CreateProdutoSchema,
  UpdateProdutoDTO,
  UpdateProdutoSchema,
} from '@/types/produto';
import { produtoRepository } from './produtoRepository';

export class ProdutoService {
  async listProdutos(
    tenantId: string,
    filters?: {
      representadaId?: string;
      search?: string;
      categoria?: string;
      ativo?: boolean;
    }
  ): Promise<Produto[]> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    return produtoRepository.listByTenant(tenantId, filters);
  }

  async getProdutoById(id: string, tenantId: string): Promise<Produto> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const item = await produtoRepository.findById(id, tenantId);
    if (!item) {
      throw new Error('Produto não encontrado no catálogo.');
    }
    return item;
  }

  async createProduto(tenantId: string, payload: CreateProdutoDTO): Promise<Produto> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }

    const validated = CreateProdutoSchema.parse(payload);

    // Validação de unicidade do SKU dentro da mesma representada
    const existing = await produtoRepository.findBySku(
      validated.codigoFabrica,
      validated.representadaId,
      tenantId
    );
    if (existing) {
      throw new Error(
        `Já existe um produto cadastrado com o código SKU ${validated.codigoFabrica} para esta representada.`
      );
    }

    return produtoRepository.create(tenantId, validated);
  }

  async updateProduto(id: string, tenantId: string, payload: UpdateProdutoDTO): Promise<Produto> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }

    const validated = UpdateProdutoSchema.parse(payload);

    if (validated.codigoFabrica && validated.representadaId) {
      const existing = await produtoRepository.findBySku(
        validated.codigoFabrica,
        validated.representadaId,
        tenantId
      );
      if (existing && existing.id !== id) {
        throw new Error(
          `Já existe outro produto cadastrado com o código SKU ${validated.codigoFabrica} para esta representada.`
        );
      }
    }

    const updated = await produtoRepository.update(id, tenantId, validated);
    if (!updated) {
      throw new Error('Produto não encontrado para atualização.');
    }
    return updated;
  }

  async toggleProdutoStatus(id: string, tenantId: string): Promise<Produto> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const updated = await produtoRepository.toggleStatus(id, tenantId);
    if (!updated) {
      throw new Error('Produto não encontrado para alteração de status.');
    }
    return updated;
  }

  async deleteProduto(id: string, tenantId: string): Promise<boolean> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório.');
    }
    const success = await produtoRepository.delete(id, tenantId);
    if (!success) {
      throw new Error('Produto não encontrado para exclusão.');
    }
    return true;
  }
}

export const produtoService = new ProdutoService();
