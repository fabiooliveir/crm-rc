'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, User, Building, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpjCpf: '',
    nome: '',
    email: '',
    whatsapp: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-900 text-slate-100 justify-between p-6">
      {/* Topo */}
      <div className="pt-6">
        <Link href="/login" className="flex items-center space-x-2 text-emerald-400 mb-4">
          <ShieldCheck className="w-7 h-7" />
          <span className="text-lg font-bold tracking-tight text-white">CRM-RC</span>
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Comece agora sua gestão soberana
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cadastre seu escritório ou representação autônoma em menos de 1 minuto.
        </p>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3.5 my-6 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl"
      >
        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="razaoSocial">
            Nome da Empresa / Razão Social
          </label>
          <div className="relative">
            <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="razaoSocial"
              type="text"
              required
              value={formData.razaoSocial}
              onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              placeholder="Ex: Silveira Representações Ltda"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-touch"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="cnpjCpf">
            CNPJ ou CPF
          </label>
          <input
            id="cnpjCpf"
            type="text"
            required
            value={formData.cnpjCpf}
            onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
            placeholder="00.000.000/0001-00 ou 000.000.000-00"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-touch"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="nome">
            Seu Nome Completo
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="nome"
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Roberto Silveira"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-touch"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="email">
            E-mail Profissional
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu.email@exemplo.com.br"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-touch"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="password">
            Senha (mín. 8 caracteres, 1 maiúscula, 1 número)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-touch"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all min-h-touch mt-3"
        >
          <span>{loading ? 'Criando Conta...' : 'Cadastrar e Acessar'}</span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Rodapé */}
      <div className="text-center pb-4">
        <p className="text-xs text-slate-400">
          Já tem cadastro?{' '}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
