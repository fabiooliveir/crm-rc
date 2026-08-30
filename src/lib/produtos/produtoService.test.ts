import { describe, it, expect, beforeEach } from 'vitest';
import { produtoService } from './produtoService';
import { produtoRepository } from './produtoRepository';

describe('ProdutoService (SDLC 4.2)', () => {
  const TEST_TENANT = 'tenant_test_4_2';
  const REP_A = 'rep_test_alpha';
  const REP_B = 'rep_test_beta';

  beforeEach(async () => {
    await produtoRepository.resetDemoData(TEST_TENANT);
  });

  it('deve cadastrar um novo produto com regras de embalagem (RN-03) e dados fiscais válidos', async () => {
    const criado = await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_A,
      codigoFabrica: 'SKU-100',
      ean: '7891234567890',
      descricao: 'Tinta Esmalte Sintético Premium 3.6L',
      descricaoDetalhada: 'Acabamento brilhante de alto rendimento.',
      ncm: '3208.10.10',
      categoria: 'Esmaltes',
      unidadeMedida: 'CX',
      multiploEmbalagem: 4,
      precoBase: 89.9,
      aliquotaIpiPct: 5.0,
      fotoUrl: 'https://exemplo.com/foto.jpg',
      ativo: true,
    });

    expect(criado).toBeDefined();
    expect(criado.id).toBeDefined();
    expect(criado.codigoFabrica).toBe('SKU-100');
    expect(criado.multiploEmbalagem).toBe(4);
    expect(criado.precoBase).toBe(89.9);
    expect(criado.ativo).toBe(true);
  });

  it('deve impedir o cadastro de múltiplo de embalagem menor que 1 (RN-03)', async () => {
    await expect(
      produtoService.createProduto(TEST_TENANT, {
        representadaId: REP_A,
        codigoFabrica: 'SKU-INV',
        descricao: 'Produto Múltiplo Inválido',
        multiploEmbalagem: 0,
        precoBase: 50.0,
        ativo: true,
      })
    ).rejects.toThrow();
  });

  it('deve impedir a duplicação de SKU dentro da mesma representada', async () => {
    await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_A,
      codigoFabrica: 'SKU-DUP',
      descricao: 'Produto Original',
      multiploEmbalagem: 1,
      precoBase: 100.0,
      ativo: true,
    });

    await expect(
      produtoService.createProduto(TEST_TENANT, {
        representadaId: REP_A,
        codigoFabrica: 'SKU-DUP',
        descricao: 'Produto Duplicado',
        multiploEmbalagem: 2,
        precoBase: 120.0,
        ativo: true,
      })
    ).rejects.toThrow(
      'Já existe um produto cadastrado com o código SKU SKU-DUP para esta representada.'
    );
  });

  it('deve permitir o mesmo SKU em representadas diferentes sem conflito', async () => {
    const p1 = await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_A,
      codigoFabrica: 'SKU-COMMON',
      descricao: 'Item da Fábrica Alpha',
      multiploEmbalagem: 1,
      precoBase: 50.0,
      ativo: true,
    });

    const p2 = await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_B,
      codigoFabrica: 'SKU-COMMON',
      descricao: 'Item da Fábrica Beta',
      multiploEmbalagem: 6,
      precoBase: 75.0,
      ativo: true,
    });

    expect(p1.id).not.toBe(p2.id);
    expect(p1.codigoFabrica).toBe('SKU-COMMON');
    expect(p2.codigoFabrica).toBe('SKU-COMMON');
  });

  it('deve listar e filtrar produtos por representada e busca textual', async () => {
    await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_A,
      codigoFabrica: 'SKU-ALFA-1',
      ean: '7890001112223',
      descricao: 'Argamassa AC-I Interior 20kg',
      categoria: 'Argamassas',
      multiploEmbalagem: 50,
      precoBase: 19.9,
      ativo: true,
    });

    await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_A,
      codigoFabrica: 'SKU-ALFA-2',
      ean: '7890003334445',
      descricao: 'Argamassa AC-III Flexível 20kg',
      categoria: 'Argamassas',
      multiploEmbalagem: 50,
      precoBase: 39.9,
      ativo: false,
    });

    await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_B,
      codigoFabrica: 'SKU-BETA-1',
      descricao: 'Rolo de Pintura 23cm',
      categoria: 'Acessórios',
      multiploEmbalagem: 12,
      precoBase: 25.0,
      ativo: true,
    });

    const repAProdutos = await produtoService.listProdutos(TEST_TENANT, { representadaId: REP_A });
    expect(repAProdutos.length).toBe(2);

    const ativas = await produtoService.listProdutos(TEST_TENANT, {
      representadaId: REP_A,
      ativo: true,
    });
    expect(ativas.length).toBe(1);
    expect(ativas[0].codigoFabrica).toBe('SKU-ALFA-1');

    const busca = await produtoService.listProdutos(TEST_TENANT, { search: 'Flexível' });
    expect(busca.length).toBe(1);
    expect(busca[0].descricao).toContain('Flexível');

    const buscaEan = await produtoService.listProdutos(TEST_TENANT, { search: '111222' });
    expect(buscaEan.length).toBe(1);
    expect(buscaEan[0].codigoFabrica).toBe('SKU-ALFA-1');
  });

  it('deve atualizar e alternar status ativo/inativo de um produto', async () => {
    const prod = await produtoService.createProduto(TEST_TENANT, {
      representadaId: REP_A,
      codigoFabrica: 'SKU-UPD',
      descricao: 'Furadeira 500W',
      multiploEmbalagem: 1,
      precoBase: 199.9,
      ativo: true,
    });

    const atualizado = await produtoService.updateProduto(prod.id, TEST_TENANT, {
      descricao: 'Furadeira de Impacto 750W',
      precoBase: 249.9,
      multiploEmbalagem: 2,
    });

    expect(atualizado.descricao).toBe('Furadeira de Impacto 750W');
    expect(atualizado.precoBase).toBe(249.9);
    expect(atualizado.multiploEmbalagem).toBe(2);

    const inativado = await produtoService.toggleProdutoStatus(prod.id, TEST_TENANT);
    expect(inativado.ativo).toBe(false);

    const reativado = await produtoService.toggleProdutoStatus(prod.id, TEST_TENANT);
    expect(reativado.ativo).toBe(true);

    const excluido = await produtoService.deleteProduto(prod.id, TEST_TENANT);
    expect(excluido).toBe(true);

    await expect(produtoService.getProdutoById(prod.id, TEST_TENANT)).rejects.toThrow(
      'Produto não encontrado no catálogo.'
    );
  });
});
