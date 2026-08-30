'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Representada } from '@/types/domain';
import {
  ArrowLeft,
  BadgePercent,
  Calendar,
  CreditCard,
  Check,
  AlertCircle,
  Building2,
  Sliders,
} from 'lucide-react';

export default function NovaTabelaPrecoPage() {
  const router = useRouter();
  const [representadas, setRepresentadas] = useState<Representada[]>([]);
  const [formData, setFormData] = useState({
    representadaId: '',
    nome: '',
    descricao: '',
    fatorAjustePadraoPct: '0',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    padrao: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRepresentadas() {
      try {
        const res = await fetch('/api/representadas?status=ativos');
        const data = await res.json();
        if (res.ok && data.representadas && data.representadas.length > 0) {
          setRepresentadas(data.representadas);
          setFormData((prev) => ({
            ...prev,
            representadaId: data.representadas[0].id,
          }));
        }
      } catch (err) {
        console.error('Erro ao carregar representadas:', err);
      }
    }
    loadRepresentadas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.representadaId) {
      setError('Selecione uma representada parceira.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        representadaId: formData.representadaId,
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        fatorAjustePadraoPct: parseFloat(formData.fatorAjustePadraoPct) || 0,
        vigenciaInicio: formData.vigenciaInicio || undefined,
        vigenciaFim: formData.vigenciaFim || undefined,
        padrao: formData.padrao,
      };

      const res = await fetch('/api/pricing/tabelas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao cadastrar tabela de preços');
      }

      router.push('/tabelas-precos');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar tabela';
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
          href="/tabelas-precos"
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-slate-900 text-sm">Nova Tabela de Preços</h1>
          <p className="text-[11px] text-slate-500">Política Comercial e Vigência</p>
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
          {/* Seção 1: Vínculo e Nome da Tabela */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-[#006c49]" />
              <span>Identificação da Tabela</span>
            </h2>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="representadaId"
              >
                Indústria Representada *
              </label>
              <select
                id="representadaId"
                required
                value={formData.representadaId}
                onChange={(e) => setFormData({ ...formData, representadaId: e.target.value })}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-bold"
              >
                {representadas.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.nomeFantasia} ({rep.cnpj})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="nome">
                Nome da Tabela de Preços *
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Tabela Distribuidor Regional (-10%)"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-bold"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="descricao"
              >
                Descrição e Regras de Elegibilidade
              </label>
              <textarea
                id="descricao"
                rows={2}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Exclusiva para redes com faturamento mensal acima de R$ 50k."
                className="w-full p-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="fatorAjustePadraoPct"
              >
                Fator de Ajuste Base (%) sobre Catálogo
              </label>
              <div className="relative">
                <input
                  id="fatorAjustePadraoPct"
                  type="number"
                  step="0.5"
                  value={formData.fatorAjustePadraoPct}
                  onChange={(e) =>
                    setFormData({ ...formData, fatorAjustePadraoPct: e.target.value })
                  }
                  placeholder="-10.0"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-8 font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  %
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Valores negativos representam desconto base (ex: -10%); positivos, acréscimo.
              </p>
            </div>
          </section>

          {/* Seção 2: Período de Vigência */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-[#006c49]" />
              <span>Prazo de Vigência da Tabela</span>
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="vigenciaInicio"
                >
                  Data Início
                </label>
                <input
                  id="vigenciaInicio"
                  type="date"
                  value={formData.vigenciaInicio}
                  onChange={(e) => setFormData({ ...formData, vigenciaInicio: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="vigenciaFim"
                >
                  Data Término
                </label>
                <input
                  id="vigenciaFim"
                  type="date"
                  value={formData.vigenciaFim}
                  onChange={(e) => setFormData({ ...formData, vigenciaFim: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                id="padrao"
                type="checkbox"
                checked={formData.padrao}
                onChange={(e) => setFormData({ ...formData, padrao: e.target.checked })}
                className="w-4 h-4 text-[#006c49] rounded border-slate-300 focus:ring-emerald-500"
              />
              <label
                htmlFor="padrao"
                className="text-xs font-semibold text-slate-800 cursor-pointer"
              >
                Definir como Tabela Padrão desta Representada
              </label>
            </div>
          </section>

          {/* Botão de Salvar Tabela */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0px_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
          >
            {loading ? (
              <span>SALVANDO TABELA...</span>
            ) : (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>SALVAR TABELA DE PREÇOS</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
