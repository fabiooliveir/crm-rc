import { describe, it, expect, beforeEach } from 'vitest';
import { pricingService } from './pricingService';
import { pricingRepository } from './pricingRepository';
import { AlcadaStatus } from '@/types/domain';

describe('PricingService (SDLC 4.3 - Precificação & Alçadas RN-05)', () => {
  const TEST_TENANT = 'tenant_test_4_3';
  const REP_A = 'rep_test_alpha';
  const REP_B = 'rep_test_beta';

  beforeEach(async () => {
    await pricingRepository.resetDemoData(TEST_TENANT);
  });

  it('deve cadastrar uma nova tabela de preços com vigência e condições válidas', async () => {
    const criada = await pricingService.createTabela(TEST_TENANT, {
      representadaId: REP_A,
      nome: 'Tabela Grandes Contas (-12%)',
      descricao: 'Exclusiva para clientes com compras acima de R$ 30.000,00',
      fatorAjustePadraoPct: -12.0,
      vigenciaInicio: '2026-01-01',
      vigenciaFim: '2026-12-31',
      padrao: false,
      ativo: true,
    });

    expect(criada).toBeDefined();
    expect(criada.id).toBeDefined();
    expect(criada.fatorAjustePadraoPct).toBe(-12.0);
    expect(criada.condicoesPagamento.length).toBeGreaterThan(0);
    expect(criada.alcadasDesconto.length).toBeGreaterThan(0);
  });

  it('deve impedir duplicação de nome de tabela dentro da mesma representada', async () => {
    await pricingService.createTabela(TEST_TENANT, {
      representadaId: REP_A,
      nome: 'Tabela Padrão',
      fatorAjustePadraoPct: 0,
      ativo: true,
    });

    await expect(
      pricingService.createTabela(TEST_TENANT, {
        representadaId: REP_A,
        nome: 'Tabela Padrão',
        fatorAjustePadraoPct: -5,
        ativo: true,
      })
    ).rejects.toThrow(
      'Já existe uma tabela de preços com o nome "Tabela Padrão" para esta representada.'
    );
  });

  it('deve calcular comissão 100% integral para descontos na Faixa 1 (0% a 5% - RN-05)', () => {
    const resultado = pricingService.calcularPrecoEComissao({
      precoBaseTabela: 200.0,
      fatorAjusteTabelaPct: 0.0,
      descontoComercialPct: 4.0, // Faixa 1
      comissaoPadraoPct: 5.0,
      quantidade: 2,
    });

    expect(resultado.precoTabelaUnitario).toBe(200.0);
    expect(resultado.precoLiquidoUnitario).toBe(192.0);
    expect(resultado.subtotalLiquido).toBe(384.0);
    expect(resultado.statusAlcada).toBe(AlcadaStatus.LIBERADO);
    expect(resultado.comissaoEfetivaPct).toBe(5.0); // 100% integral
    expect(resultado.comissaoEstimadaValor).toBe(19.2);
  });

  it('deve calcular redução proporcional para descontos na Faixa 2 (5.1% a 10% - 80% da comissão - RN-05)', () => {
    const resultado = pricingService.calcularPrecoEComissao({
      precoBaseTabela: 100.0,
      fatorAjusteTabelaPct: 0.0,
      descontoComercialPct: 8.0, // Faixa 2
      comissaoPadraoPct: 5.0,
      quantidade: 10,
    });

    expect(resultado.precoLiquidoUnitario).toBe(92.0);
    expect(resultado.subtotalLiquido).toBe(920.0);
    expect(resultado.statusAlcada).toBe(AlcadaStatus.REDUCAO_COMISSAO);
    expect(resultado.fatorReducaoComissaoPct).toBe(80.0);
    expect(resultado.comissaoEfetivaPct).toBe(4.0); // 5.0 * 80% = 4.0%
    expect(resultado.comissaoEstimadaValor).toBe(36.8);
  });

  it('deve calcular redução de 50% para descontos na Faixa 3 (10.1% a 15% - 50% da comissão - RN-05)', () => {
    const resultado = pricingService.calcularPrecoEComissao({
      precoBaseTabela: 100.0,
      fatorAjusteTabelaPct: 0.0,
      descontoComercialPct: 14.0, // Faixa 3
      comissaoPadraoPct: 6.0,
      quantidade: 1,
    });

    expect(resultado.precoLiquidoUnitario).toBe(86.0);
    expect(resultado.statusAlcada).toBe(AlcadaStatus.REDUCAO_COMISSAO);
    expect(resultado.fatorReducaoComissaoPct).toBe(50.0);
    expect(resultado.comissaoEfetivaPct).toBe(3.0); // 6.0 * 50% = 3.0%
    expect(resultado.comissaoEstimadaValor).toBe(2.58);
  });

  it('deve bloquear e exigir autorização prévia da fábrica para descontos acima de 15% (Faixa 4 - RN-05)', () => {
    const resultado = pricingService.calcularPrecoEComissao({
      precoBaseTabela: 100.0,
      fatorAjusteTabelaPct: 0.0,
      descontoComercialPct: 18.0, // Faixa 4
      comissaoPadraoPct: 5.0,
      quantidade: 1,
    });

    expect(resultado.statusAlcada).toBe(AlcadaStatus.REQUER_AUTORIZACAO);
    expect(resultado.faixaAplicada.requerAutorizacao).toBe(true);
    expect(resultado.mensagemAlcada).toContain('Requer autorização prévia da fábrica');
  });

  it('deve aplicar corretamente o fator de ajuste da tabela de preços antes do desconto', () => {
    // Tabela com 10% de desconto base (-10%) e representante concedendo mais 5% comercial
    const resultado = pricingService.calcularPrecoEComissao({
      precoBaseTabela: 100.0,
      fatorAjusteTabelaPct: -10.0, // Tabela Distribuidor
      descontoComercialPct: 5.0,
      comissaoPadraoPct: 5.0,
      quantidade: 1,
    });

    expect(resultado.precoTabelaUnitario).toBe(90.0); // 100 - 10%
    expect(resultado.precoLiquidoUnitario).toBe(85.5); // 90 - 5%
    expect(resultado.statusAlcada).toBe(AlcadaStatus.LIBERADO);
  });

  it('deve atualizar e excluir tabelas de preços', async () => {
    const tab = await pricingService.createTabela(TEST_TENANT, {
      representadaId: REP_B,
      nome: 'Tabela Temporária',
      fatorAjustePadraoPct: 0,
      ativo: true,
    });

    const atualizada = await pricingService.updateTabela(tab.id, TEST_TENANT, {
      nome: 'Tabela Atualizada',
      fatorAjustePadraoPct: -5.0,
    });

    expect(atualizada.nome).toBe('Tabela Atualizada');
    expect(atualizada.fatorAjustePadraoPct).toBe(-5.0);

    const excluida = await pricingService.deleteTabela(tab.id, TEST_TENANT);
    expect(excluida).toBe(true);
  });
});
