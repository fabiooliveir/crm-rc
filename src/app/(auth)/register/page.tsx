'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, User, Shield, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpjCpf: '',
    registroCore: '',
    nome: '',
    email: '',
    whatsapp: '',
    password: '',
  });
  const [soberaniaAceita, setSoberaniaAceita] = useState(true);
  const [lgpdAceita, setLgpdAceita] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soberaniaAceita || !lgpdAceita) {
      setError('Por favor, aceite os termos de soberania e privacidade.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao cadastrar');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao realizar cadastro';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-16 max-w-md mx-auto relative shadow-2xl">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 bg-[#f7f9fb]/95 backdrop-blur-md z-40 border-b border-slate-200/60 px-4 h-16 flex items-center justify-between">
        <Link
          href="/login"
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
          <Shield className="w-5 h-5 text-[#006c49]" />
          <span>CRM-RC Soberania</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="px-4 pt-4 flex flex-col gap-5">
        {/* Título */}
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Criar Conta Soberana</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre seu escritório ou representação autônoma em menos de 1 minuto.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-500/40 rounded-xl text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Dados da Representação */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-[#006c49]" />
              <span>Dados da Representação</span>
            </h2>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="razaoSocial"
              >
                Razão Social da Empresa *
              </label>
              <input
                id="razaoSocial"
                type="text"
                required
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                placeholder="Ex: Silveira Representações Ltda"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                htmlFor="nomeFantasia"
              >
                Nome Fantasia (Marca do Escritório)
              </label>
              <input
                id="nomeFantasia"
                type="text"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                placeholder="Ex: Silveira Reps"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="cnpjCpf"
                >
                  CNPJ ou CPF *
                </label>
                <input
                  id="cnpjCpf"
                  type="text"
                  required
                  value={formData.cnpjCpf}
                  onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1"
                  htmlFor="registroCore"
                >
                  Registro CORE
                </label>
                <input
                  id="registroCore"
                  type="text"
                  value={formData.registroCore}
                  onChange={(e) => setFormData({ ...formData, registroCore: e.target.value })}
                  placeholder="Ex: CORE-SP 12345"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Dados do Titular */}
          <section className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#006c49]" />
              <span>Dados do Titular</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="nome">
                Nome Completo *
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Roberto Silveira"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
                E-mail Profissional *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com.br"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="whatsapp">
                WhatsApp de Atendimento
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(16) 99888-1122"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
                Senha de Acesso *
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </section>

          {/* Section 3: Termos e Soberania */}
          <section className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 flex flex-col gap-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={soberaniaAceita}
                onChange={(e) => setSoberaniaAceita(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-800 leading-snug">
                <strong className="text-[#006c49] block font-bold">
                  Garantia de Soberania da Carteira:
                </strong>
                Seus clientes e históricos pertencem a você e nunca serão compartilhados com as
                indústrias representadas.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-emerald-200/60">
              <input
                type="checkbox"
                checked={lgpdAceita}
                onChange={(e) => setLgpdAceita(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                Concordo com os Termos de Uso e Política de Privacidade de Dados (LGPD).
              </span>
            </label>
          </section>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0px_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-1"
          >
            <span>{loading ? 'CADASTRANDO...' : 'CADASTRAR E COMEÇAR'}</span>
            {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </form>

        {/* Rodapé */}
        <div className="text-center py-4">
          <Link href="/login" className="text-xs text-[#3B82F6] hover:underline font-bold">
            Já possui uma conta? Fazer login
          </Link>
        </div>
      </main>
    </div>
  );
}
