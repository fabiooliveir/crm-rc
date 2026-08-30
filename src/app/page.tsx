import { formatCurrency } from '@/lib/formatters';
import {
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  Building2,
  Package,
  Users,
  LayoutDashboard,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 pb-20 select-none">
      {/* Header Mobile com Identificação e Status de Rede */}
      <header className="bg-slate-900 text-white p-4 pt-6 rounded-b-2xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-900">
              RS
            </div>
            <div>
              <p className="text-xs text-slate-400">Bom dia,</p>
              <h1 className="text-lg font-bold">Roberto Silveira</h1>
            </div>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Modo Campo</span>
          </div>
        </div>

        {/* Resumo Financeiro Hero */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Vendas do Mês</span>
            </div>
            <p className="text-base font-bold text-white tracking-tight">
              {formatCurrency(148500.0)}
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Comissão Prevista</span>
            </div>
            <p className="text-base font-bold text-emerald-400 tracking-tight">
              {formatCurrency(7425.0)}
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Faturado a Receber</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatCurrency(4850.0)}</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recebido no Mês</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatCurrency(5920.0)}</p>
          </div>
        </div>
      </header>

      {/* Botão de Ação Rápida no Polegar */}
      <section className="px-4 -mt-3">
        <button
          type="button"
          className="w-full bg-emerald-500 active:bg-emerald-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-base transition-transform active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>EMITIR NOVO PEDIDO EXPRESS</span>
        </button>
      </section>

      {/* Agenda de Visitas de Hoje */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Visitas Agendadas para Hoje (2)
          </h2>
          <span className="text-xs text-blue-600 font-semibold">Ver todas</span>
        </div>

        <div className="space-y-3">
          {/* Card Visita 1 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Depósito São José</h3>
                <p className="text-xs text-slate-500 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                  Centro • Ribeirão Preto / SP
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                10:00
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href="https://wa.me/5516998881122"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:16998881122"
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Ligar</span>
              </a>
              <button
                type="button"
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center"
                title="GPS Rota"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Card Visita 2 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Tintas & Cores</h3>
                <p className="text-xs text-slate-500 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                  Jd. Paulista • Ribeirão Preto / SP
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                14:30
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href="https://wa.me/5516997773344"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:16997773344"
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Ligar</span>
              </a>
              <button
                type="button"
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center"
                title="GPS Rota"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metas por Representada */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Metas por Representada
        </h2>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-800">Tintas Real</span>
              <span className="text-emerald-600">85% (R$ 85.000 / R$ 100.000)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-emerald-500 h-2.5 rounded-full w-[85%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-800">Ferramentas Fort</span>
              <span className="text-amber-600">62% (R$ 31.000 / R$ 50.000)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-amber-500 h-2.5 rounded-full w-[62%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Navegação Inferior Mobile Fixa */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-6 py-2 flex justify-between items-center z-50">
        <button
          type="button"
          className="flex flex-col items-center text-slate-900 font-bold text-xs"
        >
          <LayoutDashboard className="w-5 h-5 text-slate-900 mb-1" />
          <span>Início</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center text-slate-400 hover:text-slate-900 text-xs font-medium"
        >
          <Package className="w-5 h-5 mb-1" />
          <span>Pedidos</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center text-slate-400 hover:text-slate-900 text-xs font-medium"
        >
          <Users className="w-5 h-5 mb-1" />
          <span>Clientes</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center text-slate-400 hover:text-slate-900 text-xs font-medium"
        >
          <Building2 className="w-5 h-5 mb-1" />
          <span>Catálogo</span>
        </button>
      </nav>
    </main>
  );
}
