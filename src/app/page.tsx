'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/formatters';

export default function HomePage() {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-28 selection:bg-[#006c49] selection:text-white max-w-md mx-auto relative shadow-2xl">
      {/* TopAppBar com Foto, Saudação, Status Offline e Ações */}
      <header className="w-full top-0 sticky bg-[#f7f9fb]/95 backdrop-blur-md shadow-sm z-40 transition-opacity duration-200 border-b border-slate-200/60">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center gap-3">
            <Link href="/configuracoes" className="relative group">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center border-2 border-slate-200 shadow-sm text-sm">
                RS
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#006c49] border-2 border-white" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-[#000000] leading-tight">
                Bom dia, Roberto!
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
                <span className="text-xs text-[#006c49] font-semibold tracking-tight">
                  Modo Campo (Offline Ativo)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/configuracoes"
              aria-label="Configurações"
              className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-black hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </Link>
            <button
              type="button"
              aria-label="Notificações"
              className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-black hover:bg-slate-200/60 rounded-full transition-colors relative"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Dashboard */}
      <main className="px-4 pt-4 flex flex-col gap-6">
        {/* Hero KPI Grid (Resumo Financeiro) */}
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Resumo Financeiro
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Agosto / 2026</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Vendas do Mês */}
            <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="absolute -right-3 -top-3 w-14 h-14 bg-slate-50 rounded-full group-hover:scale-125 transition-transform" />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-[#006c49] text-[22px] mb-1 block">
                  trending_up
                </span>
                <p className="text-xs text-slate-500 font-medium">Vendas do Mês</p>
              </div>
              <p className="text-base text-slate-950 font-bold tracking-tight relative z-10">
                {formatCurrency(148500.0)}
              </p>
            </div>

            {/* Comissões Previstas */}
            <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="absolute -right-3 -top-3 w-14 h-14 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform" />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-[#006c49] text-[22px] mb-1 block">
                  payments
                </span>
                <p className="text-xs text-slate-500 font-medium">Comissões Previstas</p>
              </div>
              <p className="text-base text-[#006c49] font-bold tracking-tight relative z-10">
                {formatCurrency(7425.0)}
              </p>
            </div>

            {/* Faturado a Receber */}
            <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="absolute -right-3 -top-3 w-14 h-14 bg-amber-50 rounded-full group-hover:scale-125 transition-transform" />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-amber-600 text-[22px] mb-1 block">
                  receipt_long
                </span>
                <p className="text-xs text-slate-500 font-medium">Faturado a Receber</p>
              </div>
              <p className="text-base text-slate-900 font-bold tracking-tight relative z-10">
                {formatCurrency(4850.0)}
              </p>
            </div>

            {/* Recebido no Mês */}
            <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="absolute -right-3 -top-3 w-14 h-14 bg-slate-50 rounded-full group-hover:scale-125 transition-transform" />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-slate-600 text-[22px] mb-1 block">
                  account_balance_wallet
                </span>
                <p className="text-xs text-slate-500 font-medium">Recebido no Mês</p>
              </div>
              <p className="text-base text-slate-900 font-bold tracking-tight relative z-10">
                {formatCurrency(5920.0)}
              </p>
            </div>
          </div>
        </section>

        {/* Agenda de Visitas de Hoje */}
        <section>
          <div className="flex justify-between items-end mb-2.5 px-1">
            <h2 className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Agenda de Visitas de Hoje (2)
            </h2>
            <a
              href="#"
              className="text-xs text-[#006c49] font-bold flex items-center hover:opacity-80 transition-opacity"
            >
              Ver todas
              <span className="material-symbols-outlined text-[16px] ml-0.5">chevron_right</span>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {/* Card Visita 1 */}
            <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 hover:border-slate-200 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      schedule
                    </span>
                    <span className="text-xs font-bold text-slate-900">10:00</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">Depósito São José</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                    Revisão de Estoque • Tintas Real
                  </p>
                </div>
                <span className="bg-emerald-50 text-[#006c49] text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200/60">
                  Planejada
                </span>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <a
                  href="https://wa.me/5516998881122"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-11 bg-[#006c49] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#005a3c] active:scale-[0.98] transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:16998881122"
                  aria-label="Ligar"
                  className="w-11 h-11 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </a>
                <button
                  type="button"
                  aria-label="GPS"
                  className="w-11 h-11 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
                </button>
              </div>
            </div>

            {/* Card Visita 2 */}
            <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 hover:border-slate-200 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      schedule
                    </span>
                    <span className="text-xs font-bold text-slate-900">14:30</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">Tintas &amp; Cores</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Apresentação Linha 2026 • Ferramentas Fort
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200/60">
                  Confirmada
                </span>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <a
                  href="https://wa.me/5516997773344"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-11 bg-[#006c49] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#005a3c] active:scale-[0.98] transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:16997773344"
                  aria-label="Ligar"
                  className="w-11 h-11 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </a>
                <button
                  type="button"
                  aria-label="GPS"
                  className="w-11 h-11 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Metas por Representada (Mês) */}
        <section>
          <h2 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2.5 px-1">
            Metas por Representada (Mês)
          </h2>
          <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col gap-4">
            {/* Tintas Real */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-900">Tintas Real</span>
                <span className="text-xs font-bold text-[#006c49]">85%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#006c49] h-2.5 rounded-full transition-all duration-1000 ease-out w-[85%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 text-right font-medium">
                R$ 85.000 / R$ 100.000
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Ferramentas Fort */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-900">Ferramentas Fort</span>
                <span className="text-xs font-bold text-slate-700">62%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-slate-800 h-2.5 rounded-full transition-all duration-1000 ease-out w-[62%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 text-right font-medium">
                R$ 31.000 / R$ 50.000
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) - NOVO PEDIDO EXPRESS */}
      <button
        type="button"
        className="fixed bottom-20 right-4 max-w-[calc(100%-2rem)] h-14 px-5 bg-[#006c49] text-white rounded-full shadow-[0px_8px_24px_rgba(0,108,73,0.35)] flex items-center gap-2 hover:bg-[#005a3c] active:scale-95 transition-all z-40 group"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">
          add
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">Novo Pedido Express</span>
      </button>

      {/* BottomNavBar Fixa no Polegar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0px_-4px_12px_rgba(15,23,42,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Active: Dashboard */}
          <button
            type="button"
            className="flex flex-col items-center justify-center w-16 h-14 group"
          >
            <div className="flex items-center justify-center bg-[#6cf8bb]/40 text-[#006c49] rounded-full px-4 py-1 mb-0.5 transition-colors group-active:scale-95">
              <span className="material-symbols-outlined text-[20px] font-bold">dashboard</span>
            </div>
            <span className="text-[11px] font-bold text-[#006c49]">Início</span>
          </button>

          {/* Pedidos */}
          <button
            type="button"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 rounded-lg transition-colors group"
          >
            <div className="flex items-center justify-center px-4 py-1 mb-0.5 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="text-[11px] font-medium">Pedidos</span>
          </button>

          {/* Clientes */}
          <button
            type="button"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 rounded-lg transition-colors group"
          >
            <div className="flex items-center justify-center px-4 py-1 mb-0.5 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </div>
            <span className="text-[11px] font-medium">Clientes</span>
          </button>

          {/* Catálogo */}
          <button
            type="button"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 rounded-lg transition-colors group"
          >
            <div className="flex items-center justify-center px-4 py-1 mb-0.5 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <span className="text-[11px] font-medium">Catálogo</span>
          </button>

          {/* Configurações */}
          <Link
            href="/configuracoes"
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 rounded-lg transition-colors group"
          >
            <div className="flex items-center justify-center px-4 py-1 mb-0.5 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </div>
            <span className="text-[11px] font-medium">Ajustes</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
