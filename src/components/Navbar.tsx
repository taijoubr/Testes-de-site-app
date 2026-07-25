import React, { useState } from 'react';
import { 
  Code2, 
  UserCheck, 
  Menu, 
  X, 
  Lock,
  Unlock
} from 'lucide-react';
import { useApp, ActiveView } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    isAdminAuthenticated,
    isClientAuthenticated,
    siteConfig
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {siteConfig?.logoUrl ? (
              <div className="h-11 max-w-[180px] flex items-center justify-center p-1 rounded-xl bg-slate-900/10 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.companyName || 'Logo'} 
                  className="max-h-9 max-w-[160px] object-contain rounded"
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-200" />
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent">
                  {siteConfig?.companyName || 'NCodes'}
                </span>
                {!siteConfig?.logoUrl && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/50">
                    Tech
                  </span>
                )}
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                {siteConfig?.logoUrl ? 'Soluções Digitais' : 'Technologies'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === 'home' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === 'services' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Serviços
            </button>

            <button
              onClick={() => handleNavClick('portfolio')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === 'portfolio' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Portfólio
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === 'about' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sobre
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === 'contact' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Contato
            </button>
          </nav>

          {/* Action CTAs & Controls */}
          <div className="hidden xl:flex items-center gap-2.5">

            {/* Area Cliente & Admin Padlock */}
            <button
              onClick={() => handleNavClick(isClientAuthenticated ? 'client_portal' : 'client_auth')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all ${
                activeView === 'client_portal' || activeView === 'client_auth'
                  ? 'ring-2 ring-indigo-400'
                  : ''
              }`}
              title="Cadastre-se e Solicite seu Orçamento na Área do Cliente"
            >
              <UserCheck className="w-4 h-4" />
              <span>Cadastre-se & Solicite Orçamento</span>
            </button>

            {/* Padlock Icon for Admin Area */}
            <button
              onClick={() => handleNavClick(isAdminAuthenticated ? 'admin_panel' : 'admin_login')}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'admin_panel' || activeView === 'admin_login'
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 ring-2 ring-blue-500/20'
                  : isAdminAuthenticated
                  ? 'border-emerald-500/50 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isAdminAuthenticated ? "Painel Admin (Autenticado)" : "Área Restrita (Acesso Admin)"}
            >
              {isAdminAuthenticated ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4" />}
            </button>

          </div>

          {/* Mobile menu toggle button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-3 rounded-xl text-sm font-semibold text-left ${activeView === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
            >
              Início
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`p-3 rounded-xl text-sm font-semibold text-left ${activeView === 'services' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
            >
              Serviços
            </button>
            <button
              onClick={() => handleNavClick('portfolio')}
              className={`p-3 rounded-xl text-sm font-semibold text-left ${activeView === 'portfolio' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
            >
              Portfólio
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`p-3 rounded-xl text-sm font-semibold text-left ${activeView === 'about' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
            >
              Sobre Nós
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`p-3 rounded-xl text-sm font-semibold text-left ${activeView === 'contact' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
            >
              Contato
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick(isAdminAuthenticated ? 'admin_panel' : 'admin_login')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 text-slate-800 dark:text-slate-200"
            >
              {isAdminAuthenticated ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-blue-500" />}
              <span>Área Restrita</span>
            </button>
            <button
              onClick={() => handleNavClick(isClientAuthenticated ? 'client_portal' : 'client_auth')}
              className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/40 text-xs font-semibold flex flex-col items-center justify-center gap-1 text-indigo-700 dark:text-indigo-300"
            >
              <UserCheck className="w-4 h-4 text-indigo-500" />
              <span>Cadastre-se & Orçamento</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
