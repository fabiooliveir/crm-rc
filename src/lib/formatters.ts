/**
 * Utilitários de formatação para o CRM-RC (Moeda BRL, CNPJ/CPF, Datas e Comissões)
 */

/**
 * Formata um valor numérico para Moeda Brasileira (R$ 1.234,56).
 */
export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata uma string de CNPJ ou CPF para exibição mascarada.
 */
export function formatDocument(document: string): string {
  const clean = document.replace(/\D/g, '');

  if (clean.length === 11) {
    // CPF: 000.000.000-00
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (clean.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return document;
}

/**
 * Formata um número de telefone ou WhatsApp (11) 98888-7777.
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');

  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return phone;
}

/**
 * Calcula a comissão prevista com base no total líquido e percentual de comissão.
 */
export function calculateCommission(totalLiquido: number, comissaoPct: number): number {
  if (totalLiquido <= 0 || comissaoPct <= 0) return 0;
  return Number(((totalLiquido * comissaoPct) / 100).toFixed(2));
}

/**
 * Calcula a retenção de IRRF de 1,5% sobre a comissão bruta de PJ (Art. 651 RIR).
 */
export function calculateIrrfRetention(comissaoBruta: number): {
  irrfRetido: number;
  comissaoLiquida: number;
} {
  const irrfRetido = Number((comissaoBruta * 0.015).toFixed(2));
  const comissaoLiquida = Number((comissaoBruta - irrfRetido).toFixed(2));
  return { irrfRetido, comissaoLiquida };
}

/**
 * Valida se a quantidade pedida respeita o múltiplo de embalagem (caixa fechada).
 */
export function validatePackagingMultiple(
  quantidade: number,
  multiplo: number
): {
  isValid: boolean;
  caixasFechadas: number;
  unidadesAjustadas: number;
} {
  if (multiplo <= 1) {
    return { isValid: true, caixasFechadas: quantidade, unidadesAjustadas: quantidade };
  }

  const isValid = quantidade % multiplo === 0;
  const caixasFechadas = Math.ceil(quantidade / multiplo);
  const unidadesAjustadas = caixasFechadas * multiplo;

  return { isValid, caixasFechadas, unidadesAjustadas };
}
