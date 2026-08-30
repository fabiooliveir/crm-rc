'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao solicitar recuperação');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-900 text-slate-100 justify-between p-6">
      {/* Topo */}
      <div className="pt-8">
        <Link
          href="/login"
          className="flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold">Voltar para o login</span>
        </Link>
        <div className="flex items-center space-x-2 text-emerald-400 mb-4">
          <ShieldCheck className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-white">CRM-RC</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Recuperar sua senha</h1>
        <p className="text-xs text-slate-400 mt-1">
          Informe seu e-mail cadastrado para receber as instruções de redefinição de acesso.
        </p>
      </div>

      {/* Conteúdo / Formulário */}
      <div className="my-8">
        {submitted ? (
          <div className="bg-slate-800/90 p-6 rounded-2xl border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-base font-bold text-white">E-mail de recuperação enviado!</h2>
            <p className="text-xs text-slate-300">
              Se o endereço <strong>{email}</strong> estiver cadastrado em nosso sistema, você
              receberá um link com validade de 1 hora.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-xs font-bold text-emerald-400 hover:underline"
            >
              Retornar à tela de login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl"
          >
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="email">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com.br"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-touch"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all min-h-touch mt-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Enviando instruções...' : 'Enviar Link de Recuperação'}</span>
            </button>
          </form>
        )}
      </div>

      <div className="text-center pb-6" />
    </div>
  );
}
