import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft, KeyRound, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setActiveView } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Por favor, preencha o nome de usuário e a senha.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(username, password);
      setIsLoading(false);
      if (success) {
        setActiveView('admin_panel');
      } else {
        setError('Usuário ou senha incorretos. Acesso restrito a administradores cadastrados.');
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900/95 text-slate-100 relative overflow-hidden">
      
      {/* Background Subtle Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Back button */}
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Site Principal</span>
        </button>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Header with Padlock */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Área Restrita</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Acesso Administrativo
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Autenticação do Painel de Controle NCodes
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field (No email) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Nome de Usuário / Login
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Informe seu usuário admin (ex: admin)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Painel Admin'}</span>
            </button>
          </form>

          {/* Informational notice box - Strict restriction notice as requested */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Aviso de Segurança & Cadastro Restrito</span>
            </div>
            <p className="leading-relaxed">
              O acesso a esta área é exclusivo para administradores devidamente cadastrados. 
              <strong> Não há formulário de auto-cadastro ou solicitação externa nesta página.</strong>
            </p>
            <p className="text-slate-500 text-[10px]">
              * Novos usuários administrativos só podem ser incluídos manualmente por um Administrador através do painel de gestão.
            </p>
          </div>

          {/* Quick Demo Helper Hint */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <p className="text-[10px] text-slate-500 font-mono">
              Usuário inicial para testes: <span className="text-blue-400 font-bold">admin</span> | Senha: <span className="text-blue-400 font-bold">admin123</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
