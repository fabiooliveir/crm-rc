'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FreteTipo } from '@/types/domain';
import { ArrowLeft, Building2, Phone, DollarSign, Check, AlertCircle } from 'lucide-react';

export default function NovaRepresentadaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    emailPedidos: '',
    telefoneFabrica: '',
    whatsappFabrica: '',
    nomeContatoGerente: '',
    comissaoPadraoPct: '5.0',
    baseCalculoComissao: 'FATURAMENTO',
    tipoFretePadrao: FreteTipo.CIF,
    prazoMedioEntregaDias: '5',
    prazoMedioFaturamentoDias: '28',
    pedidoMinimoValor: '1000.00',
    segmento: 'Tintas & Químicos',
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        razaoSocial: formData.razaoSocial,
        nomeFantasia: formData.nomeFantasia,
        cnpj: formData.cnpj,
        inscricaoEstadual: formData.inscricaoEstadual || undefined,
        emailPedidos: formData.emailPedidos || undefined,
        telefoneFabrica: formData.telefoneFabrica || undefined,
        whatsappFabrica: formData.whatsappFabrica || undefined,
        nomeContatoGerente: formData.nomeContatoGerente || undefined,
        comissaoPadraoPct: parseFloat(formData.comissaoPadraoPct) || 0,
        baseCalculoComissao: formData.baseCalculoComissao,
        tipoFretePadrao: formData.tipoFretePadrao,
        prazoMedioEntregaDias: parseInt(formData.prazoMedioEntregaDias, 10) || undefined,
        prazoMedioFaturamentoDias: parseInt(formData.prazoMedioFaturamentoDias, 10) || undefined,
        pedidoMinimoValor: parseFloat(formData.pedidoMinimoValor) || undefined,
        segmento: formData.segmento || undefined,
        ativo: formData.ativo,
      };

      const res = await fetch('/api/representadas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao cadastrar representada');
      }

      router.push('/representadas');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao cadastrar representada';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-20 max-w-md mx-auto relative shadow-2xl">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 bg-[#f7f9fb]/95 backdrop-blur-md z-40 border-b border-slate-200/60 px-4 h-16 flex items-center justify-between">
        <Link
          href="/representadas"
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-slate-900 text-sm">Nova Representada</h1>
          <p className="text-[11px] text-slate-500">Cadastro de Fábrica Parceira</p>
        </div>
        <div className="w-10" />
      </header>

      <main className="px-4 pt-4 flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-500/40 rounded-xl text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Seção 1: Dados da Fábrica */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-[#006c49]" />
              <span>Dados Cadastrais da Fábrica</span>
            </h2>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="nomeFantasia"
              >
                Nome Fantasia (Marca) *
              </label>
              <input
                id="nomeFantasia"
                type="text"
                required
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                placeholder="Ex: Tintas Real"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="razaoSocial"
              >
                Razão Social Completa *
              </label>
              <input
                id="razaoSocial"
                type="text"
                required
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                placeholder="Ex: Real Tintas & Químicos Indústria S.A."
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cnpj">
                  CNPJ *
                </label>
                <input
                  id="cnpj"
                  type="text"
                  required
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="inscricaoEstadual"
                >
                  Inscrição Estadual
                </label>
                <input
                  id="inscricaoEstadual"
                  type="text"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                  placeholder="000.000.000.000"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="segmento">
                Segmento Principal
              </label>
              <select
                id="segmento"
                value={formData.segmento}
                onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="Tintas & Químicos">Tintas &amp; Químicos</option>
                <option value="Ferramentas & Ferragens">Ferramentas &amp; Ferragens</option>
                <option value="Construção Civil">Construção Civil</option>
                <option value="Acessórios de Pintura">Acessórios de Pintura</option>
                <option value="Geral">Geral / Outros</option>
              </select>
            </div>
          </section>

          {/* Seção 2: Contatos na Indústria */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Phone className="w-4 h-4 text-[#006c49]" />
              <span>Contatos na Fábrica</span>
            </h2>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="nomeContatoGerente"
              >
                Gerente Comercial Regional / Suporte
              </label>
              <input
                id="nomeContatoGerente"
                type="text"
                value={formData.nomeContatoGerente}
                onChange={(e) => setFormData({ ...formData, nomeContatoGerente: e.target.value })}
                placeholder="Ex: Carlos Eduardo (Gerente Regional)"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="whatsappFabrica"
              >
                WhatsApp do Faturamento / Pedidos
              </label>
              <input
                id="whatsappFabrica"
                type="tel"
                value={formData.whatsappFabrica}
                onChange={(e) => setFormData({ ...formData, whatsappFabrica: e.target.value })}
                placeholder="(11) 98888-1234"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="telefoneFabrica"
                >
                  Telefone Fixo
                </label>
                <input
                  id="telefoneFabrica"
                  type="tel"
                  value={formData.telefoneFabrica}
                  onChange={(e) => setFormData({ ...formData, telefoneFabrica: e.target.value })}
                  placeholder="(11) 3456-7890"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="emailPedidos"
                >
                  E-mail de Pedidos
                </label>
                <input
                  id="emailPedidos"
                  type="email"
                  value={formData.emailPedidos}
                  onChange={(e) => setFormData({ ...formData, emailPedidos: e.target.value })}
                  placeholder="pedidos@fabrica.com.br"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Seção 3: Regras de Comissão & Políticas Comerciais */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <DollarSign className="w-4 h-4 text-[#006c49]" />
              <span>Regras Comerciais &amp; Comissões</span>
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="comissaoPadraoPct"
                >
                  % Comissão Padrão *
                </label>
                <div className="relative">
                  <input
                    id="comissaoPadraoPct"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={formData.comissaoPadraoPct}
                    onChange={(e) =>
                      setFormData({ ...formData, comissaoPadraoPct: e.target.value })
                    }
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-8 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="baseCalculoComissao"
                >
                  Base de Cálculo *
                </label>
                <select
                  id="baseCalculoComissao"
                  value={formData.baseCalculoComissao}
                  onChange={(e) =>
                    setFormData({ ...formData, baseCalculoComissao: e.target.value })
                  }
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="FATURAMENTO">Sobre Faturamento</option>
                  <option value="LIQUIDACAO">Sobre Liquidação</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="tipoFretePadrao"
                >
                  Frete Padrão *
                </label>
                <select
                  id="tipoFretePadrao"
                  value={formData.tipoFretePadrao}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoFretePadrao: e.target.value as FreteTipo })
                  }
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value={FreteTipo.CIF}>CIF (Pago pela Fábrica)</option>
                  <option value={FreteTipo.FOB}>FOB (Pago pelo Cliente)</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="prazoMedioEntregaDias"
                >
                  Entrega Média (dias)
                </label>
                <input
                  id="prazoMedioEntregaDias"
                  type="number"
                  min="0"
                  value={formData.prazoMedioEntregaDias}
                  onChange={(e) =>
                    setFormData({ ...formData, prazoMedioEntregaDias: e.target.value })
                  }
                  placeholder="Ex: 5"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-bold"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="pedidoMinimoValor"
              >
                Valor de Pedido Mínimo (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  R$
                </span>
                <input
                  id="pedidoMinimoValor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pedidoMinimoValor}
                  onChange={(e) => setFormData({ ...formData, pedidoMinimoValor: e.target.value })}
                  placeholder="1000.00"
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-bold"
                />
              </div>
            </div>
          </section>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0px_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
          >
            {loading ? (
              <span>SALVANDO...</span>
            ) : (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>SALVAR REPRESENTADA</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
