'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Shield, ArrowRight, Fingerprint, Mail, Lock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao autenticar');
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao realizar login';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex flex-col justify-between text-[#191c1e] font-sans antialiased max-w-md mx-auto relative px-4 py-8 shadow-2xl">
      {/* Background Ambient Element (Subtle Gradient) */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-emerald-50/50 via-[#f7f9fb]/80 to-transparent pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col items-center mt-4 mb-6 z-10">
        <div className="w-16 h-16 mb-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-[0px_4px_12px_rgba(15,23,42,0.06)]">
          <Shield className="w-8 h-8 text-[#006c49]" />
        </div>
        <p className="text-[#006c49] text-[11px] font-bold uppercase tracking-widest mb-2">
          Soberania da sua carteira
        </p>
        <h1 className="text-2xl font-bold text-slate-950 text-center tracking-tight mb-1">
          Acesse sua conta profissional
        </h1>
        <p className="text-xs text-slate-500 text-center">
          Gerencie suas representadas, pedidos e comissões
        </p>
      </div>

      {/* Form Section Card */}
      <div className="bg-white p-5 rounded-2xl shadow-[0px_4px_16px_rgba(15,23,42,0.06)] border border-slate-200/80 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {error && (
            <div className="p-3 bg-red-50 border border-red-500/40 rounded-xl text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
              E-mail Profissional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 focus:outline-none transition-all text-xs font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="password">
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-[#3B82F6] hover:underline text-xs font-semibold"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 focus:outline-none transition-all text-xs font-medium"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-1 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0px_4px_16px_rgba(16,185,129,0.3)] active:scale-[0.98]"
          >
            <span>{loading ? 'ENTRANDO...' : 'ENTRAR NO SISTEMA'}</span>
            {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          </button>

          {/* Biometric Action Button */}
          <button
            type="button"
            onClick={() => {
              setEmail('roberto@silveirarep.com.br');
              setPassword('SenhaForte123!');
            }}
            className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all"
          >
            <Fingerprint className="w-4 h-4 text-[#006c49]" />
            <span>Entrar com Biometria / Touch ID (Demo)</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full flex justify-center py-4 z-10 mt-4">
        <Link
          href="/register"
          className="text-[#3B82F6] hover:underline text-xs font-bold transition-colors text-center"
        >
          Ainda não possui conta? Criar minha conta gratuita
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center text-slate-600 text-sm">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
