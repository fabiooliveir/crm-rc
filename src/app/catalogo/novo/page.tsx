'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Representada } from '@/types/domain';
import {
  ArrowLeft,
  Package,
  Barcode,
  Layers,
  DollarSign,
  Camera,
  Check,
  AlertCircle,
  Building2,
} from 'lucide-react';

export default function NovoProdutoPage() {
  const router = useRouter();
  const [representadas, setRepresentadas] = useState<Representada[]>([]);
  const [formData, setFormData] = useState({
    representadaId: '',
    codigoFabrica: '',
    ean: '',
    descricao: '',
    descricaoDetalhada: '',
    ncm: '',
    categoria: 'Geral',
    unidadeMedida: 'UN',
    multiploEmbalagem: '1',
    precoBase: '',
    aliquotaIpiPct: '0.0',
    fotoUrl: '',
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega representadas ativas para o dropdown
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
        codigoFabrica: formData.codigoFabrica,
        ean: formData.ean || undefined,
        descricao: formData.descricao,
        descricaoDetalhada: formData.descricaoDetalhada || undefined,
        ncm: formData.ncm || undefined,
        categoria: formData.categoria || undefined,
        unidadeMedida: formData.unidadeMedida,
        multiploEmbalagem: parseInt(formData.multiploEmbalagem, 10) || 1,
        precoBase: parseFloat(formData.precoBase) || 0,
        aliquotaIpiPct: parseFloat(formData.aliquotaIpiPct) || 0,
        fotoUrl: formData.fotoUrl || undefined,
        ativo: formData.ativo,
      };

      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao cadastrar produto');
      }

      router.push('/catalogo');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao cadastrar produto';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const unidades = ['UN', 'CX', 'L', 'KG', 'SC', 'PALLET', 'M2', 'PC'];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-20 max-w-md mx-auto relative shadow-2xl">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 bg-[#f7f9fb]/95 backdrop-blur-md z-40 border-b border-slate-200/60 px-4 h-16 flex items-center justify-between">
        <Link
          href="/catalogo"
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-slate-900 text-sm">Novo Produto</h1>
          <p className="text-[11px] text-slate-500">Catálogo de Representadas</p>
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
          {/* Seção 1: Identificação & Representada */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-[#006c49]" />
              <span>Vínculo &amp; Identificação</span>
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

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="codigoFabrica"
                >
                  Código SKU da Fábrica *
                </label>
                <input
                  id="codigoFabrica"
                  type="text"
                  required
                  value={formData.codigoFabrica}
                  onChange={(e) => setFormData({ ...formData, codigoFabrica: e.target.value })}
                  placeholder="Ex: TR-2040"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="ean">
                  Código de Barras (EAN)
                </label>
                <div className="relative">
                  <input
                    id="ean"
                    type="text"
                    value={formData.ean}
                    onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                    placeholder="7891234567890"
                    className="w-full h-11 pl-3 pr-8 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  <Barcode className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="descricao"
              >
                Descrição Comercial do Produto *
              </label>
              <input
                id="descricao"
                type="text"
                required
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Tinta Acrílica Premium Fosco Branco 18L"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="categoria"
                >
                  Categoria / Linha
                </label>
                <input
                  id="categoria"
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Linha Imobiliária"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="ncm">
                  NCM Fiscal
                </label>
                <input
                  id="ncm"
                  type="text"
                  value={formData.ncm}
                  onChange={(e) => setFormData({ ...formData, ncm: e.target.value })}
                  placeholder="3209.10.10"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Seção 2: Embalagem, Preço e Regras de Venda (RN-03) */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Package className="w-4 h-4 text-[#006c49]" />
              <span>Embalagem &amp; Regras de Venda (RN-03)</span>
            </h2>

            {/* Seletor de Unidades em Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unidade de Venda
              </label>
              <div className="flex flex-wrap gap-1.5">
                {unidades.map((un) => (
                  <button
                    key={un}
                    type="button"
                    onClick={() => setFormData({ ...formData, unidadeMedida: un })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      formData.unidadeMedida === un
                        ? 'bg-[#006c49] text-white border-[#006c49] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {un}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="multiploEmbalagem"
                >
                  Múltiplo de Emb. (RN-03) *
                </label>
                <input
                  id="multiploEmbalagem"
                  type="number"
                  min="1"
                  required
                  value={formData.multiploEmbalagem}
                  onChange={(e) => setFormData({ ...formData, multiploEmbalagem: e.target.value })}
                  placeholder="Ex: 6"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-bold"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="precoBase"
                >
                  Preço Base Tabela (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                    R$
                  </span>
                  <input
                    id="precoBase"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.precoBase}
                    onChange={(e) => setFormData({ ...formData, precoBase: e.target.value })}
                    placeholder="289.90"
                    className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="aliquotaIpiPct"
              >
                Alíquota de IPI (%)
              </label>
              <div className="relative">
                <input
                  id="aliquotaIpiPct"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.aliquotaIpiPct}
                  onChange={(e) => setFormData({ ...formData, aliquotaIpiPct: e.target.value })}
                  placeholder="0.0"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-8 font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  %
                </span>
              </div>
            </div>
          </section>

          {/* Seção 3: Showroom & Imagem do Produto */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Camera className="w-4 h-4 text-[#006c49]" />
              <span>Foto do Produto (Showroom Digital)</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="fotoUrl">
                URL da Imagem / Foto
              </label>
              <input
                id="fotoUrl"
                type="url"
                value={formData.fotoUrl}
                onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                placeholder="https://exemplo.com/foto-produto.jpg"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {formData.fotoUrl && (
              <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src={formData.fotoUrl}
                  alt="Prévia do Produto"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </section>

          {/* Botão de Salvar Produto */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0px_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
          >
            {loading ? (
              <span>SALVANDO PRODUTO...</span>
            ) : (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>SALVAR PRODUTO NO CATÁLOGO</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
