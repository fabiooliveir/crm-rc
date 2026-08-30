'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Produto, Representada } from '@/types/domain';
import { formatCurrency } from '@/lib/formatters';
import {
  ArrowLeft,
  Search,
  Grid,
  List,
  Plus,
  Package,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [representadas, setRepresentadas] = useState<Representada[]>([]);
  const [selectedRepresentadaId, setSelectedRepresentadaId] = useState<string>('TODAS');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // Carrega lista de representadas para o carrossel superior
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

  // Carrega produtos com filtros
  const fetchProdutos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedRepresentadaId !== 'TODAS') {
        params.set('representadaId', selectedRepresentadaId);
      }
      if (search) {
        params.set('search', search);
      }

      const res = await fetch(`/api/produtos?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.produtos) {
        setProdutos(data.produtos);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRepresentadaId, search]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/produtos/${id}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchProdutos();
      }
    } catch (err) {
      console.error('Erro ao alterar status do produto:', err);
    }
  };

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
                Catálogo de Produtos
              </h1>
              <p className="text-xs text-[#006c49] font-semibold">
                {produtos.length} itens cadastrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Alternador de Visualização Grade / Lista */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Modo Grade com Fotos"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Modo Lista Compacta"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/catalogo/novo"
              className="w-10 h-10 rounded-full bg-emerald-50 text-[#006c49] border border-emerald-200/60 flex items-center justify-center hover:bg-emerald-100 transition-colors ml-1"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Barra de Busca Instantânea */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por SKU, EAN ou Nome do Produto..."
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

      {/* Conteúdo do Catálogo */}
      <main className="px-4 pt-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Carregando produtos do catálogo...
          </div>
        ) : produtos.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm flex flex-col items-center gap-3">
            <Package className="w-12 h-12 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">Nenhum produto encontrado</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Tente selecionar outra representada ou cadastre um novo produto no catálogo.
            </p>
            <Link
              href="/catalogo/novo"
              className="mt-2 h-10 px-4 bg-[#006c49] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Produto</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          /* Visualização em Grade (Showroom com Fotos) */
          <div className="grid grid-cols-2 gap-3">
            {produtos.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-[0px_4px_12px_rgba(15,23,42,0.06)] flex flex-col justify-between transition-all ${
                  prod.ativo
                    ? 'border-slate-100 hover:border-slate-300'
                    : 'border-slate-200 opacity-75 bg-slate-50'
                }`}
              >
                {/* Imagem do Produto */}
                <div className="relative w-full h-36 bg-slate-100 overflow-hidden group">
                  {prod.fotoUrl ? (
                    <Image
                      src={prod.fotoUrl}
                      alt={prod.descricao}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50">
                      <ShoppingBag className="w-8 h-8 opacity-40" />
                      <span className="text-[10px]">Sem Foto</span>
                    </div>
                  )}

                  {/* Badge de SKU no Topo da Imagem */}
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {prod.codigoFabrica}
                  </span>

                  {/* Botão de Ativação Rápida */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(prod.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-slate-900"
                  >
                    {prod.ativo ? (
                      <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Detalhes do Produto */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#006c49] uppercase tracking-wider block mb-0.5 truncate">
                      {getRepresentadaNome(prod.representadaId)}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight mb-1">
                      {prod.descricao}
                    </h3>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Múltiplo (RN-03):</span>
                      <strong className="text-slate-800 font-bold">
                        {prod.multiploEmbalagem} {prod.unidadeMedida}
                      </strong>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <p className="text-sm font-bold text-[#006c49] tracking-tight">
                        {formatCurrency(prod.precoBase)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        /{prod.unidadeMedida}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Visualização em Lista Compacta */
          <div className="flex flex-col gap-2.5">
            {produtos.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white rounded-xl p-3 border shadow-sm flex items-center gap-3 transition-all ${
                  prod.ativo ? 'border-slate-100' : 'border-slate-200 opacity-75 bg-slate-50'
                }`}
              >
                {/* Miniatura */}
                <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0">
                  {prod.fotoUrl ? (
                    <Image
                      src={prod.fotoUrl}
                      alt={prod.descricao}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-6 h-6 opacity-40" />
                    </div>
                  )}
                </div>

                {/* Dados */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                      {prod.codigoFabrica}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {getRepresentadaNome(prod.representadaId)}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {prod.descricao}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="text-[#006c49] font-bold">
                      {formatCurrency(prod.precoBase)}/{prod.unidadeMedida}
                    </span>
                    <span>• Emb: {prod.multiploEmbalagem}</span>
                  </div>
                </div>

                {/* Switch de Status */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(prod.id)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  {prod.ativo ? (
                    <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/catalogo/novo"
        className="fixed bottom-20 right-4 h-14 px-5 bg-[#006c49] text-white rounded-full shadow-[0px_8px_24px_rgba(0,108,73,0.35)] flex items-center gap-2 hover:bg-[#005a3c] active:scale-95 transition-all z-40"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Novo Produto</span>
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

          {/* Active: Catálogo */}
          <Link
            href="/catalogo"
            className="flex flex-col items-center justify-center w-16 h-14 group"
          >
            <div className="flex items-center justify-center bg-[#6cf8bb]/40 text-[#006c49] rounded-full px-4 py-1 mb-0.5 transition-colors">
              <span className="material-symbols-outlined text-[20px] font-bold">menu_book</span>
            </div>
            <span className="text-[11px] font-bold text-[#006c49]">Catálogo</span>
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
