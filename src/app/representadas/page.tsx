'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Representada } from '@/types/domain';
import { formatCurrency } from '@/lib/formatters';
import {
  ArrowLeft,
  Search,
  Building2,
  Phone,
  MessageSquare,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  DollarSign,
  Package,
} from 'lucide-react';

export default function RepresentadasPage() {
  const [representadas, setRepresentadas] = useState<Representada[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSegmento, setSelectedSegmento] = useState('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const fetchRepresentadas = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedSegmento !== 'TODOS') params.set('segmento', selectedSegmento);
      if (selectedStatus !== 'todos') params.set('status', selectedStatus);

      const res = await fetch(`/api/representadas?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.representadas) {
        setRepresentadas(data.representadas);
      }
    } catch (err) {
      console.error('Erro ao buscar representadas:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedSegmento, selectedStatus]);

  useEffect(() => {
    fetchRepresentadas();
  }, [fetchRepresentadas]);

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/representadas/${id}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchRepresentadas();
      }
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const segmentos = [
    'TODOS',
    'Tintas & Químicos',
    'Ferramentas & Ferragens',
    'Construção Civil',
    'Acessórios de Pintura',
  ];

  const ativasCount = representadas.filter((r) => r.ativo).length;

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
                Indústrias Representadas
              </h1>
              <p className="text-xs text-[#006c49] font-semibold">
                {ativasCount} fábricas ativas na carteira
              </p>
            </div>
          </div>

          <Link
            href="/representadas/nova"
            className="w-10 h-10 rounded-full bg-emerald-50 text-[#006c49] border border-emerald-200/60 flex items-center justify-center hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>

        {/* Barra de Busca Instantânea */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por marca, razão social ou CNPJ..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Carrossel de Filtros Rápidos (Chips) */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedStatus(
                selectedStatus === 'todos'
                  ? 'ativos'
                  : selectedStatus === 'ativos'
                    ? 'inativos'
                    : 'todos'
              );
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors border ${
              selectedStatus !== 'todos'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              {selectedStatus === 'todos'
                ? 'Status: Todos'
                : selectedStatus === 'ativos'
                  ? 'Só Ativas'
                  : 'Só Inativas'}
            </span>
          </button>

          {segmentos.map((seg) => (
            <button
              key={seg}
              type="button"
              onClick={() => setSelectedSegmento(seg)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors border ${
                selectedSegmento === seg
                  ? 'bg-[#006c49] text-white border-[#006c49]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </header>

      {/* Lista de Cards de Representadas */}
      <main className="px-4 pt-4 flex flex-col gap-3.5">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Carregando representadas parceiras...
          </div>
        ) : representadas.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm flex flex-col items-center gap-3">
            <Building2 className="w-12 h-12 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">Nenhuma representada encontrada</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Tente alterar os termos de busca ou cadastre uma nova indústria parceira.
            </p>
            <Link
              href="/representadas/nova"
              className="mt-2 h-10 px-4 bg-[#006c49] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Representada</span>
            </Link>
          </div>
        ) : (
          representadas.map((rep) => (
            <div
              key={rep.id}
              className={`bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border transition-all ${
                rep.ativo ? 'border-slate-100' : 'border-slate-200 opacity-75 bg-slate-50/50'
              }`}
            >
              {/* Header do Card */}
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {rep.nomeFantasia}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        rep.ativo
                          ? 'bg-emerald-50 text-[#006c49] border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {rep.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">{rep.razaoSocial}</p>
                </div>

                {/* Switch de Ativação Rápida */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(rep.id)}
                  title={rep.ativo ? 'Inativar Representada' : 'Ativar Representada'}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {rep.ativo ? (
                    <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Informações Fiscais & Cadastrais */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>
                  <strong className="text-slate-800">CNPJ:</strong> {rep.cnpj}
                </span>
                {rep.inscricaoEstadual && (
                  <span>
                    <strong className="text-slate-800">IE:</strong> {rep.inscricaoEstadual}
                  </span>
                )}
                {rep.segmento && (
                  <span className="text-blue-700 font-semibold">• {rep.segmento}</span>
                )}
              </div>

              {/* Badges de Regras Comerciais */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded-lg flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#006c49] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">Comissão</p>
                    <p className="text-xs font-bold text-[#006c49] mt-0.5">
                      {rep.comissaoPadraoPct.toFixed(1)}% (
                      {rep.baseCalculoComissao === 'FATURAMENTO' ? 'Fat.' : 'Liq.'})
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">
                      Frete Padrão
                    </p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      Frete {rep.tipoFretePadrao}
                    </p>
                  </div>
                </div>

                {rep.prazoMedioEntregaDias && (
                  <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium leading-none">
                        Entrega Média
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {rep.prazoMedioEntregaDias} dias úteis
                      </p>
                    </div>
                  </div>
                )}

                {rep.pedidoMinimoValor && (
                  <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium leading-none">
                        Pedido Mínimo
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                        {formatCurrency(rep.pedidoMinimoValor)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contatos do Gerente & Botões de Ação */}
              {rep.nomeContatoGerente && (
                <div className="text-xs text-slate-700 mb-3 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                  <span>Contato: {rep.nomeContatoGerente}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                {rep.whatsappFabrica && (
                  <a
                    href={`https://wa.me/${rep.whatsappFabrica.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 h-11 bg-[#006c49] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#005a3c] active:scale-[0.98] transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Fábrica</span>
                  </a>
                )}

                {rep.telefoneFabrica && (
                  <a
                    href={`tel:${rep.telefoneFabrica.replace(/\D/g, '')}`}
                    aria-label="Ligar"
                    className="w-11 h-11 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/representadas/nova"
        className="fixed bottom-20 right-4 h-14 px-5 bg-[#006c49] text-white rounded-full shadow-[0px_8px_24px_rgba(0,108,73,0.35)] flex items-center gap-2 hover:bg-[#005a3c] active:scale-95 transition-all z-40"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Nova Representada</span>
      </Link>

      {/* BottomNavBar Fixa */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0px_-4px_12px_rgba(15,23,42,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-[11px] font-medium">Início</span>
          </Link>

          <button
            type="button"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span className="text-[11px] font-medium">Pedidos</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="text-[11px] font-medium">Clientes</span>
          </button>

          {/* Active: Representadas / Catálogo */}
          <Link
            href="/representadas"
            className="flex flex-col items-center justify-center w-16 h-14 group"
          >
            <div className="flex items-center justify-center bg-[#6cf8bb]/40 text-[#006c49] rounded-full px-4 py-1 mb-0.5 transition-colors">
              <span className="material-symbols-outlined text-[20px] font-bold">domain</span>
            </div>
            <span className="text-[11px] font-bold text-[#006c49]">Fábricas</span>
          </Link>

          <Link
            href="/configuracoes"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-[11px] font-medium">Ajustes</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
