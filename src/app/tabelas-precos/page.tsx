'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TabelaPreco, Representada, AlcadaStatus } from '@/types/domain';
import { formatCurrency } from '@/lib/formatters';
import {
  ArrowLeft,
  BadgePercent,
  Plus,
  Calendar,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Sliders,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';

export default function TabelasPrecosPage() {
  const [tabelas, setTabelas] = useState<TabelaPreco[]>([]);
  const [representadas, setRepresentadas] = useState<Representada[]>([]);
  const [selectedRepresentadaId, setSelectedRepresentadaId] = useState<string>('TODAS');
  const [loading, setLoading] = useState(true);

  // Simulador de Desconto & Alçada em Tempo Real
  const [simulador, setSimulador] = useState({
    precoBase: 100.0,
    descontoPct: 8.0,
    comissaoContratualPct: 5.0,
    fatorAjusteTabelaPct: 0.0,
  });

  const [simulacaoResultado, setSimulacaoResultado] = useState<{
    precoTabelaUnitario: number;
    precoLiquidoUnitario: number;
    comissaoEfetivaPct: number;
    fatorReducaoComissaoPct: number;
    statusAlcada: AlcadaStatus;
    mensagemAlcada: string;
  } | null>(null);

  useEffect(() => {
    async function loadRepresentadas() {
      try {
        const res = await fetch('/api/representadas?status=ativos');
        const data = await res.json();
        if (res.ok && data.representadas) {
          setRepresentadas(data.representadas);
        }
      } catch (err) {
        console.error('Erro ao carregar representadas:', err);
      }
    }
    loadRepresentadas();
  }, []);

  const fetchTabelas = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedRepresentadaId !== 'TODAS') {
        params.set('representadaId', selectedRepresentadaId);
      }

      const res = await fetch(`/api/pricing/tabelas?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.tabelas) {
        setTabelas(data.tabelas);
      }
    } catch (err) {
      console.error('Erro ao carregar tabelas de preço:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRepresentadaId]);

  useEffect(() => {
    fetchTabelas();
  }, [fetchTabelas]);

  // Executa o cálculo da simulação em tempo real
  const calcularSimulacao = useCallback(async () => {
    try {
      const res = await fetch('/api/pricing/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          precoBaseTabela: simulador.precoBase,
          fatorAjusteTabelaPct: simulador.fatorAjusteTabelaPct,
          descontoComercialPct: simulador.descontoPct,
          comissaoPadraoPct: simulador.comissaoContratualPct,
          quantidade: 1,
        }),
      });
      const data = await res.json();
      if (res.ok && data.resultado) {
        setSimulacaoResultado(data.resultado);
      }
    } catch (err) {
      console.error('Erro na simulação de preços:', err);
    }
  }, [simulador]);

  useEffect(() => {
    calcularSimulacao();
  }, [calcularSimulacao]);

  const getRepresentadaNome = (repId: string) => {
    const rep = representadas.find((r) => r.id === repId);
    return rep ? rep.nomeFantasia : 'Representada';
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-28 selection:bg-[#006c49] selection:text-white max-w-md mx-auto relative shadow-2xl">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-[#f7f9fb]/95 backdrop-blur-md shadow-sm z-40 border-b border-slate-200/60">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Tabelas &amp; Alçadas
              </h1>
              <p className="text-xs text-[#006c49] font-semibold">
                Políticas Comerciais e Descontos
              </p>
            </div>
          </div>

          <Link
            href="/tabelas-precos/nova"
            className="w-10 h-10 rounded-full bg-emerald-50 text-[#006c49] border border-emerald-200/60 flex items-center justify-center hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>

        {/* Carrossel Horizontal de Representadas */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedRepresentadaId('TODAS')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors border ${
              selectedRepresentadaId === 'TODAS'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todas as Fábricas
          </button>

          {representadas.map((rep) => (
            <button
              key={rep.id}
              type="button"
              onClick={() => setSelectedRepresentadaId(rep.id)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                selectedRepresentadaId === rep.id
                  ? 'bg-[#006c49] text-white border-[#006c49]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{rep.nomeFantasia}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="px-4 pt-4 flex flex-col gap-4">
        {/* Simulador Interativo de Alçada de Desconto (RN-05) */}
        <section className="bg-white p-4 rounded-2xl shadow-[0px_4px_16px_rgba(15,23,42,0.06)] border border-slate-200/80 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#006c49]" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Simulador de Alçada &amp; Comissão (RN-05)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Tempo Real
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Preço Base Tabela
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  R$
                </span>
                <input
                  type="number"
                  step="1"
                  value={simulador.precoBase}
                  onChange={(e) =>
                    setSimulador({ ...simulador, precoBase: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-10 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Desconto Aplicado (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={simulador.descontoPct}
                  onChange={(e) =>
                    setSimulador({ ...simulador, descontoPct: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-10 pl-3 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Slider de Desconto */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>0% (Integral)</span>
              <span>5% (Limite F1)</span>
              <span>10% (F2)</span>
              <span>15% (Bloqueio)</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={simulador.descontoPct}
              onChange={(e) =>
                setSimulador({ ...simulador, descontoPct: parseFloat(e.target.value) || 0 })
              }
              className="w-full accent-[#006c49] cursor-pointer"
            />
          </div>

          {/* Card de Resultado da Alçada */}
          {simulacaoResultado && (
            <div
              className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                simulacaoResultado.statusAlcada === AlcadaStatus.LIBERADO
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : simulacaoResultado.statusAlcada === AlcadaStatus.REDUCAO_COMISSAO
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                    : 'bg-red-50/60 border-red-200 text-red-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {simulacaoResultado.statusAlcada === AlcadaStatus.LIBERADO ? (
                    <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    {simulacaoResultado.statusAlcada === AlcadaStatus.LIBERADO
                      ? 'Desconto Liberado (Comissão 100%)'
                      : simulacaoResultado.statusAlcada === AlcadaStatus.REDUCAO_COMISSAO
                        ? 'Comissão com Redução Proporcional'
                        : 'Requer Autorização da Fábrica'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/40">
                <div>
                  <span className="text-[10px] text-slate-500 block">Preço Líquido Unitário:</span>
                  <strong className="text-sm font-bold text-slate-900">
                    {formatCurrency(simulacaoResultado.precoLiquidoUnitario)}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Comissão Efetiva:</span>
                  <strong
                    className={`text-sm font-bold ${
                      simulacaoResultado.fatorReducaoComissaoPct < 100
                        ? 'text-amber-700'
                        : 'text-[#006c49]'
                    }`}
                  >
                    {simulacaoResultado.comissaoEfetivaPct.toFixed(2)}% (
                    {simulacaoResultado.fatorReducaoComissaoPct}% da base)
                  </strong>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 mt-0.5">
                {simulacaoResultado.mensagemAlcada}
              </p>
            </div>
          )}
        </section>

        {/* Listagem de Tabelas de Preços Cadastradas */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BadgePercent className="w-4 h-4 text-[#006c49]" />
              <span>Tabelas de Preços Vigentes ({tabelas.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Carregando tabelas comerciais...
            </div>
          ) : tabelas.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-slate-200 text-xs text-slate-500">
              Nenhuma tabela cadastrada para esta representada.
            </div>
          ) : (
            tabelas.map((tab) => (
              <div
                key={tab.id}
                className="bg-white rounded-2xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-200/80 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#006c49] uppercase tracking-wider block mb-0.5">
                      {getRepresentadaNome(tab.representadaId)}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{tab.nome}</h3>
                    {tab.descricao && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tab.descricao}</p>
                    )}
                  </div>
                  {tab.padrao && (
                    <span className="bg-emerald-50 text-[#006c49] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Padrão
                    </span>
                  )}
                </div>

                {/* Badges de Vigência e Ajuste */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1 text-slate-700">
                    <TrendingDown className="w-3.5 h-3.5 text-[#006c49]" />
                    <span className="font-bold">
                      Ajuste Base:{' '}
                      {tab.fatorAjustePadraoPct > 0
                        ? `+${tab.fatorAjustePadraoPct}%`
                        : `${tab.fatorAjustePadraoPct}%`}
                    </span>
                  </div>

                  {tab.vigenciaFim && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Até {tab.vigenciaFim}</span>
                    </div>
                  )}
                </div>

                {/* Condições de Pagamento Vinculadas */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    <span>Condições de Pagamento Aceitas</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tab.condicoesPagamento.map((cond) => (
                      <span
                        key={cond.id}
                        className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {cond.descricao}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/tabelas-precos/nova"
        className="fixed bottom-20 right-4 h-14 px-5 bg-[#006c49] text-white rounded-full shadow-[0px_8px_24px_rgba(0,108,73,0.35)] flex items-center gap-2 hover:bg-[#005a3c] active:scale-95 transition-all z-40"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Nova Tabela</span>
      </Link>
    </div>
  );
}
