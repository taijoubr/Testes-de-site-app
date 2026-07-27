import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  LogIn, 
  UserPlus, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ClientAuthPage: React.FC = () => {
  const { 
    loginClient, 
    registerClient, 
    checkEmailExists,
    setActiveView 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginClient(loginEmail, loginPassword);
    if (success) {
      setActiveView('client_portal');
    } else {
      setLoginError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (checkEmailExists(regEmail)) {
      setRegError(`O e-mail "${regEmail.trim()}" já possui cadastro no portal.`);
      return;
    }

    setIsSubmitting(true);
    
    const result = await registerClient({
      name: regName,
      email: regEmail,
      phone: regPhone,
      company: regCompany || 'Pessoa Física / Startup',
      city: regCity,
      state: regState,
      passwordHash: regPassword
    });

    setIsSubmitting(false);

    if (result.success) {
      setActiveView('client_portal');
    } else {
      setRegError(result.error || 'Erro ao realizar o cadastro.');
    }
  };

  const fillDemoClient = (email: string, pass: string) => {
    setMode('login');
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoginError('');
    const success = loginClient(email, pass);
    if (success) {
      setActiveView('client_portal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-4 py-2.5 rounded-2xl transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Site Principal</span>
        </button>

        <div className="flex items-center gap-3">
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto my-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Information & Value Proposition */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Cadastre-se e solicite seu orçamento</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Cadastre-se e solicite seu <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">orçamento sob medida</span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Crie sua conta gratuitamente para solicitar e aprovar orçamentos em minutos, contar com análise inteligente por IA, acompanhar o avanço das tarefas e interagir com nossa equipe em tempo real.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Solicitação de Orçamentos:</strong> Crie novos orçamentos com estimativa detalhada e análise por Inteligência Artificial.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Acompanhamento de Projetos:</strong> Veja o andamento em porcentagem, horários investidos e arquivos disponibilizados.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Aceite de Propostas & Contratos:</strong> Assinatura digital direta sem burocracia ou papelada.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Tabs header */}
          <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800/80 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Já Tenho Conta (Login)</span>
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastro Completo</span>
            </button>
          </div>

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-extrabold text-white">Acesse o Portal do Cliente</h3>
                <p className="text-xs text-slate-400 mt-1">Informe seu e-mail e senha de acesso previamente cadastrados.</p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                  {loginError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    E-mail de Cadastro
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="seu.email@empresa.com.br"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar na Área do Cliente</span>
              </button>
            </form>
          )}

          {/* MODE: REGISTER (CADASTRO COMPLETO) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-extrabold text-white">Criar Conta de Cliente</h3>
                <p className="text-xs text-slate-400 mt-1">Preencha o cadastro completo para solicitar orçamentos e gerenciar seus projetos.</p>
              </div>

              {(regError || (regEmail.trim() && checkEmailExists(regEmail))) && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium space-y-2 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-200">
                        {regError || `O e-mail "${regEmail.trim()}" já possui cadastro no portal.`}
                      </p>
                      <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                        Se você já se cadastrou anteriormente, clique no botão abaixo para ir direto para a tela de login.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(regEmail);
                      setMode('login');
                      setRegError('');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Fazer Login com este E-mail</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo da Silva"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    E-mail Principal *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="carlos@minhaempresa.com.br"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Empresa / Negócio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regCompany}
                      onChange={e => setRegCompany(e.target.value)}
                      placeholder="Ex: Silva Tech Startups"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={regCity}
                      onChange={e => setRegCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      UF
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={regState}
                      onChange={e => setRegState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all uppercase text-center font-bold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Crie uma Senha de Acesso *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 6 caracteres"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro & Acessar'}</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 z-10 pt-4 border-t border-slate-900">
        © {new Date().getFullYear()} NCodes Technologies. Todos os direitos reservados. Ambiente com criptografia end-to-end.
      </div>
    </div>
  );
};
