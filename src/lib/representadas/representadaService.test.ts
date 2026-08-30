import { describe, it, expect, beforeEach } from 'vitest';
import { representadaService } from './representadaService';
import { representadaRepository } from './representadaRepository';
import { FreteTipo } from '@/types/domain';

describe('RepresentadaService (SDLC 4.1)', () => {
  const TEST_TENANT = 'tenant_test_4_1';

  beforeEach(async () => {
    await representadaRepository.resetDemoData(TEST_TENANT);
  });

  it('deve cadastrar uma nova representada com dados e regras comerciais válidas', async () => {
    const criada = await representadaService.createRepresentada(TEST_TENANT, {
      razaoSocial: 'Indústria Química Brasil S.A.',
      nomeFantasia: 'Química Brasil',
      cnpj: '11.222.333/0001-44',
      inscricaoEstadual: '111.222.333.444',
      emailPedidos: 'pedidos@quimicabrasil.com.br',
      telefoneFabrica: '(11) 3344-5566',
      whatsappFabrica: '551199887766',
      nomeContatoGerente: 'Marcos Vinicius',
      comissaoPadraoPct: 5.5,
      baseCalculoComissao: 'FATURAMENTO',
      tipoFretePadrao: FreteTipo.CIF,
      prazoMedioEntregaDias: 4,
      prazoMedioFaturamentoDias: 28,
      pedidoMinimoValor: 2500.0,
      segmento: 'Tintas & Químicos',
      ativo: true,
    });

    expect(criada).toBeDefined();
    expect(criada.id).toBeDefined();
    expect(criada.nomeFantasia).toBe('Química Brasil');
    expect(criada.comissaoPadraoPct).toBe(5.5);
    expect(criada.baseCalculoComissao).toBe('FATURAMENTO');
    expect(criada.tipoFretePadrao).toBe(FreteTipo.CIF);
    expect(criada.ativo).toBe(true);
  });

  it('deve impedir o cadastro de duas representadas com o mesmo CNPJ no mesmo tenant', async () => {
    await representadaService.createRepresentada(TEST_TENANT, {
      razaoSocial: 'Metalúrgica Alfa Ltda',
      nomeFantasia: 'Alfa Metais',
      cnpj: '22.333.444/0001-55',
      comissaoPadraoPct: 4.0,
      baseCalculoComissao: 'LIQUIDACAO',
      tipoFretePadrao: FreteTipo.FOB,
      ativo: true,
    });

    await expect(
      representadaService.createRepresentada(TEST_TENANT, {
        razaoSocial: 'Outra Empresa Com Mesmo CNPJ',
        nomeFantasia: 'Alfa Metais Copia',
        cnpj: '22.333.444/0001-55',
        comissaoPadraoPct: 6.0,
        baseCalculoComissao: 'FATURAMENTO',
        tipoFretePadrao: FreteTipo.CIF,
        ativo: true,
      })
    ).rejects.toThrow('Já existe uma representada cadastrada com o CNPJ/CPF');
  });

  it('deve listar representadas aplicando filtros de busca por nome e status', async () => {
    await representadaService.createRepresentada(TEST_TENANT, {
      razaoSocial: 'TuboMax Conexões Ltda',
      nomeFantasia: 'TuboMax',
      cnpj: '33.444.555/0001-66',
      comissaoPadraoPct: 5.0,
      baseCalculoComissao: 'FATURAMENTO',
      tipoFretePadrao: FreteTipo.CIF,
      segmento: 'Construção Civil',
      ativo: true,
    });

    await representadaService.createRepresentada(TEST_TENANT, {
      razaoSocial: 'Plásticos Delta S.A.',
      nomeFantasia: 'Delta Plásticos',
      cnpj: '44.555.666/0001-77',
      comissaoPadraoPct: 3.5,
      baseCalculoComissao: 'LIQUIDACAO',
      tipoFretePadrao: FreteTipo.FOB,
      segmento: 'Construção Civil',
      ativo: false,
    });

    const todas = await representadaService.listRepresentadas(TEST_TENANT);
    expect(todas.length).toBe(2);

    const ativas = await representadaService.listRepresentadas(TEST_TENANT, { ativo: true });
    expect(ativas.length).toBe(1);
    expect(ativas[0].nomeFantasia).toBe('TuboMax');

    const busca = await representadaService.listRepresentadas(TEST_TENANT, { search: 'Delta' });
    expect(busca.length).toBe(1);
    expect(busca[0].nomeFantasia).toBe('Delta Plásticos');
  });

  it('deve atualizar dados cadastrais e regras comerciais de uma representada', async () => {
    const rep = await representadaService.createRepresentada(TEST_TENANT, {
      razaoSocial: 'Ferramentas Beta Ltda',
      nomeFantasia: 'Beta Tools',
      cnpj: '55.666.777/0001-88',
      comissaoPadraoPct: 5.0,
      baseCalculoComissao: 'FATURAMENTO',
      tipoFretePadrao: FreteTipo.CIF,
      ativo: true,
    });

    const atualizada = await representadaService.updateRepresentada(rep.id, TEST_TENANT, {
      nomeFantasia: 'Beta Tools Brasil',
      comissaoPadraoPct: 6.5,
      tipoFretePadrao: FreteTipo.FOB,
      prazoMedioEntregaDias: 10,
    });

    expect(atualizada.nomeFantasia).toBe('Beta Tools Brasil');
    expect(atualizada.comissaoPadraoPct).toBe(6.5);
    expect(atualizada.tipoFretePadrao).toBe(FreteTipo.FOB);
    expect(atualizada.prazoMedioEntregaDias).toBe(10);
  });

  it('deve alternar status ativo/inativo e excluir uma representada com sucesso', async () => {
    const rep = await representadaService.createRepresentada(TEST_TENANT, {
      razaoSocial: 'Tintas Gama Ltda',
      nomeFantasia: 'Gama Tintas',
      cnpj: '66.777.888/0001-99',
      comissaoPadraoPct: 4.5,
      baseCalculoComissao: 'FATURAMENTO',
      tipoFretePadrao: FreteTipo.CIF,
      ativo: true,
    });

    const inativada = await representadaService.toggleRepresentadaStatus(rep.id, TEST_TENANT);
    expect(inativada.ativo).toBe(false);

    const reativada = await representadaService.toggleRepresentadaStatus(rep.id, TEST_TENANT);
    expect(reativada.ativo).toBe(true);

    const deletada = await representadaService.deleteRepresentada(rep.id, TEST_TENANT);
    expect(deletada).toBe(true);

    await expect(representadaService.getRepresentadaById(rep.id, TEST_TENANT)).rejects.toThrow(
      'Representada não encontrada.'
    );
  });
});
