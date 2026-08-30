import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDocument,
  formatPhone,
  calculateCommission,
  calculateIrrfRetention,
  validatePackagingMultiple,
} from './formatters';

describe('Formatters & Business Calculation Utils', () => {
  it('deve formatar valores monetários em Real (BRL)', () => {
    const formatted = formatCurrency(148500.5);
    expect(formatted).toContain('148.500,50');
  });

  it('deve formatar CNPJ e CPF corretamente', () => {
    expect(formatDocument('12345678000190')).toBe('12.345.678/0001-90');
    expect(formatDocument('12345678901')).toBe('123.456.789-01');
  });

  it('deve formatar telefone e WhatsApp', () => {
    expect(formatPhone('16998881122')).toBe('(16) 99888-1122');
  });

  it('deve calcular a comissão prevista corretamente', () => {
    const comissao = calculateCommission(4732.0, 5.0);
    expect(comissao).toBe(236.6);
  });

  it('deve calcular a retenção de IRRF de 1.5%', () => {
    const { irrfRetido, comissaoLiquida } = calculateIrrfRetention(1000.0);
    expect(irrfRetido).toBe(15.0);
    expect(comissaoLiquida).toBe(985.0);
  });

  it('deve validar e ajustar múltiplos de embalagem', () => {
    const valid = validatePackagingMultiple(20, 2);
    expect(valid.isValid).toBe(true);
    expect(valid.caixasFechadas).toBe(10);

    const invalid = validatePackagingMultiple(7, 4);
    expect(invalid.isValid).toBe(false);
    expect(invalid.caixasFechadas).toBe(2);
    expect(invalid.unidadesAjustadas).toBe(8);
  });
});
