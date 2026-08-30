'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

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
    <div className="bg-[#0F172A] min-h-screen flex flex-col justify-between text-white font-sans antialiased max-w-md mx-auto relative px-5 py-8 overflow-hidden shadow-2xl">
      {/* Background Ambient Element (Subtle Gradient) */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#131b2e]/60 via-[#0F172A]/40 to-transparent pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col items-center mt-6 mb-8 z-10">
        <div className="w-16 h-16 mb-3 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="material-symbols-outlined text-[#10B981] text-[34px]">
            shield_person
          </span>
        </div>
        <p className="text-[#adc6ff] text-[11px] font-bold uppercase tracking-widest mb-4">
          Soberania da sua carteira
        </p>
        <h1 className="text-2xl font-bold text-white text-center tracking-tight mb-1">
          Acesse sua conta profissional
        </h1>
        <p className="text-sm text-slate-400 text-center">
          Gerencie suas representadas, pedidos e comissões
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full z-10">
        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="relative">
          <label className="sr-only" htmlFor="email">
            E-mail
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full h-12 pl-11 pr-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none transition-colors text-sm"
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <label className="sr-only" htmlFor="password">
              Senha
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 pl-11 pr-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-[#3B82F6] hover:text-[#adc6ff] text-xs font-semibold transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0px_4px_16px_rgba(16,185,129,0.3)] active:scale-[0.98]"
        >
          <span>{loading ? 'ENTRANDO...' : 'ENTRAR NO SISTEMA'}</span>
          {!loading && (
            <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
          )}
        </button>

        {/* Biometric Action Button */}
        <button
          type="button"
          onClick={() => {
            setEmail('roberto@silveirarep.com.br');
            setPassword('SenhaForte123!');
          }}
          className="w-full h-12 bg-transparent border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all mt-1"
        >
          <span className="material-symbols-outlined text-[20px] text-emerald-400">
            fingerprint
          </span>
          <span>Entrar com Biometria / Touch ID (Demo)</span>
        </button>
      </form>

      {/* Footer */}
      <div className="w-full flex justify-center py-4 z-10 mt-6">
        <Link
          href="/register"
          className="text-[#3B82F6] hover:text-[#adc6ff] text-xs font-semibold transition-colors text-center"
        >
          Ainda não possui conta?{' '}
          <span className="underline font-bold">Criar minha conta gratuita</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white text-sm">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
