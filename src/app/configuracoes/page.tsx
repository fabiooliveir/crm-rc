'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Building2,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  CreditCard,
  Trash2,
} from 'lucide-react';

type TabType = 'perfil' | 'empresa' | 'logomarca' | 'financeiro';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('perfil');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de Usuário
  const [userData, setUserData] = useState({
    nome: 'Roberto Silveira',
    email: 'roberto@silveirarep.com.br',
    whatsapp: '(16) 99888-1122',
    telefone: '(16) 3322-4455',
    bio: 'Representante Comercial com 12 anos de experiência nos setores de tintas, materiais de construção e ferragens.',
  });

  // Estados de Tenant / Escritório
  const [tenantData, setTenantData] = useState({
    razaoSocial: 'Silveira Representações Comerciais Ltda',
    nomeFantasia: 'Silveira Reps',
    cnpjCpf: '12.345.678/0001-90',
    registroCore: 'CORE-SP 123456/2018',
    email: 'contato@silveirarep.com.br',
    telefone: '(16) 3322-4455',
    whatsapp: '(16) 99888-1122',
    logradouro: 'Av. Presidente Vargas',
    numero: '1500',
    complemento: 'Sala 402',
    bairro: 'Jardim Paulista',
    cidade: 'Ribeirão Preto',
    uf: 'SP',
    cep: '14020-260',
    chavePix: '12.345.678/0001-90',
    fusoHorario: 'America/Sao_Paulo',
    aliquotaStPadrao: 18.0,
    logoUrl: '',
  });

  useEffect(() => {
    // Busca dados iniciais da API
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) {
          if (json.data.user) {
            setUserData((prev) => ({
              ...prev,
              ...json.data.user,
            }));
          }
          if (json.data.tenant) {
            setTenantData((prev) => ({
              ...prev,
              ...json.data.tenant,
            }));
          }
        }
      })
      .catch(() => {
        // Mantém valores padrão se offline ou mock
      });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('A imagem deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setTenantData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (activeTab === 'perfil') {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao salvar perfil');
        }
      } else {
        const res = await fetch('/api/tenant/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tenantData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao salvar configurações');
        }
      }

      setSuccessMsg('Alterações salvas com sucesso!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar alteração';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 pb-24 select-none">
      {/* Header Mobile */}
      <header className="bg-slate-900 text-white p-4 pt-6 rounded-b-2xl shadow-md">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-slate-400">Minha Conta</p>
            <h1 className="text-lg font-bold">Perfil & Configurações</h1>
          </div>
        </div>

        {/* Abas de Navegação Ergonômicas */}
        <div className="flex space-x-1 bg-slate-800/90 p-1 rounded-xl mt-4 border border-slate-700 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'perfil'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('empresa')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'empresa'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Escritório</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logomarca')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'logomarca'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financeiro')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'financeiro'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>PIX / Fiscal</span>
          </button>
        </div>
      </header>

      {/* Alertas de Feedback */}
      <div className="px-4 mt-4 space-y-2">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-500/40 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-500/40 rounded-xl text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleSave} className="px-4 mt-2 space-y-4">
        {/* ABA 1: PERFIL PESSOAL */}
        {activeTab === 'perfil' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Dados do Representante
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="userNome">
                Nome Completo
              </label>
              <input
                id="userNome"
                type="text"
                required
                value={userData.nome}
                onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-600 mb-1"
                htmlFor="userEmail"
              >
                E-mail (Login)
              </label>
              <input
                id="userEmail"
                type="email"
                disabled
                value={userData.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed min-h-touch"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-600 mb-1"
                htmlFor="userWhatsapp"
              >
                WhatsApp Comercial
              </label>
              <input
                id="userWhatsapp"
                type="text"
                value={userData.whatsapp}
                onChange={(e) => setUserData({ ...userData, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="userBio">
                Apresentação Profissional / Bio
              </label>
              <textarea
                id="userBio"
                rows={3}
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* ABA 2: ESCRITÓRIO & CORE */}
        {activeTab === 'empresa' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Dados Cadastrais da Representação
            </h2>

            <div>
              <label
                className="block text-xs font-semibold text-slate-600 mb-1"
                htmlFor="razaoSocial"
              >
                Razão Social
              </label>
              <input
                id="razaoSocial"
                type="text"
                required
                value={tenantData.razaoSocial}
                onChange={(e) => setTenantData({ ...tenantData, razaoSocial: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-slate-600 mb-1"
                htmlFor="nomeFantasia"
              >
                Nome Fantasia (Marca do Escritório)
              </label>
              <input
                id="nomeFantasia"
                type="text"
                value={tenantData.nomeFantasia}
                onChange={(e) => setTenantData({ ...tenantData, nomeFantasia: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-600 mb-1"
                  htmlFor="cnpjCpf"
                >
                  CNPJ / CPF
                </label>
                <input
                  id="cnpjCpf"
                  type="text"
                  required
                  value={tenantData.cnpjCpf}
                  onChange={(e) => setTenantData({ ...tenantData, cnpjCpf: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-600 mb-1"
                  htmlFor="registroCore"
                >
                  Registro CORE
                </label>
                <input
                  id="registroCore"
                  type="text"
                  value={tenantData.registroCore}
                  onChange={(e) => setTenantData({ ...tenantData, registroCore: e.target.value })}
                  placeholder="Ex: CORE-SP 12345"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
              Endereço Comercial
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label
                  className="block text-xs font-semibold text-slate-600 mb-1"
                  htmlFor="logradouro"
                >
                  Logradouro
                </label>
                <input
                  id="logradouro"
                  type="text"
                  value={tenantData.logradouro}
                  onChange={(e) => setTenantData({ ...tenantData, logradouro: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 min-h-touch"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="numero">
                  Número
                </label>
                <input
                  id="numero"
                  type="text"
                  value={tenantData.numero}
                  onChange={(e) => setTenantData({ ...tenantData, numero: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 min-h-touch"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="cidade">
                  Cidade
                </label>
                <input
                  id="cidade"
                  type="text"
                  value={tenantData.cidade}
                  onChange={(e) => setTenantData({ ...tenantData, cidade: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 min-h-touch"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="uf">
                  UF (Estado)
                </label>
                <input
                  id="uf"
                  type="text"
                  maxLength={2}
                  value={tenantData.uf}
                  onChange={(e) =>
                    setTenantData({ ...tenantData, uf: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 min-h-touch"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: LOGOMARCA */}
        {activeTab === 'logomarca' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Logomarca para Pedidos e Orçamentos em PDF
            </h2>
            <p className="text-xs text-slate-500">
              Sua logomarca será aplicada automaticamente no topo de todos os orçamentos e pedidos
              gerados pelo CRM-RC.
            </p>

            {/* Preview do Cabeçalho de Pedido */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50">
              {tenantData.logoUrl ? (
                <div className="space-y-3 text-center">
                  <div className="max-h-24 max-w-full overflow-hidden mx-auto flex items-center justify-center bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tenantData.logoUrl}
                      alt="Logo do Representante"
                      className="max-h-20 object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTenantData({ ...tenantData, logoUrl: '' })}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center justify-center space-x-1 mx-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover Logomarca</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Nenhuma imagem carregada</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG ou SVG até 2MB</p>
                </div>
              )}
            </div>

            <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs cursor-pointer border border-slate-300 min-h-touch">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Selecionar Arquivo de Imagem</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* ABA 4: PIX & CONFIGURAÇÕES FISCAIS */}
        {activeTab === 'financeiro' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Preferências Comerciais & Recebimento
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="chavePix">
                Chave PIX para Comissões
              </label>
              <input
                id="chavePix"
                type="text"
                value={tenantData.chavePix}
                onChange={(e) => setTenantData({ ...tenantData, chavePix: e.target.value })}
                placeholder="CNPJ, E-mail, Telefone ou Chave Aleatória"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Utilizada nos relatórios de conciliação enviados às indústrias representadas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-600 mb-1"
                  htmlFor="aliquotaSt"
                >
                  Alíquota ST Estimada (%)
                </label>
                <input
                  id="aliquotaSt"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={tenantData.aliquotaStPadrao}
                  onChange={(e) =>
                    setTenantData({
                      ...tenantData,
                      aliquotaStPadrao: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-600 mb-1"
                  htmlFor="fusoHorario"
                >
                  Fuso Horário
                </label>
                <select
                  id="fusoHorario"
                  value={tenantData.fusoHorario}
                  onChange={(e) => setTenantData({ ...tenantData, fusoHorario: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-touch"
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Cuiaba">Cuiabá (GMT-4)</option>
                  <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Salvar Alterações */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all min-h-touch"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </form>
    </main>
  );
}
