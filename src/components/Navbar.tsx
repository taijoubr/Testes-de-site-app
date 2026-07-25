import React, { useState } from 'react';
import { 
  Code2, 
  Globe, 
  Smartphone, 
  LayoutDashboard, 
  UserCheck, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  FileSignature,
  Lock,
  Unlock
} from 'lucide-react';
import { useApp, ActiveView } from '../context/AppContext';
import { NotificationCenter } from './NotificationCenter';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    isDarkMode, 
    toggleTheme, 
    currentUser, 
    setCurrentUserRole,
    notifications,
    isAdminAuthenticated,
    isClientAuthenticated,
    siteConfig
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const rolesList: { role: UserRole; label: string; icon: string }[] = [
    { role: 'admin', label: 'Administrador (Nikolas)', icon: '⚡' },
    { role: 'manager', label: 'Gerente de Projetos', icon: '📋' },
    { role: 'financial', label: 'Financeiro (Juliana)', icon: '💰' },
    { role: 'developer', label: 'Desenvolvedor (Gabriel)', icon: '💻' },
    { role: 'designer', label: 'Designer UI/UX (Amanda)', icon: '🎨' },
    { role: 'support', label: 'Suporte Técnico', icon: '🎧' },
    { role: 'client', label: 'Cliente (Lucas - FinTech)', icon: '👤' }
  ];

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

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(prev => !prev)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <NotificationCenter onClose={() => setNotificationsOpen(false)} />
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-6 h-6 rounded-full object-cover border border-blue-500" 
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.role.toUpperCase()}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Alternar Perfil de Teste</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
                  </div>
                  {rolesList.map(item => (
                    <button
                      key={item.role}
                      onClick={() => {
                        setCurrentUserRole(item.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        currentUser.role === item.role 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-300 font-bold' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </span>
                      {currentUser.role === item.role && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Mobile menu toggle button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

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

          {/* Role selector in mobile menu */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-2">Perfil Atual: <strong className="text-blue-500">{currentUser.name} ({currentUser.role})</strong></p>
            <div className="grid grid-cols-2 gap-1.5">
              {rolesList.slice(0, 4).map(r => (
                <button
                  key={r.role}
                  onClick={() => setCurrentUserRole(r.role)}
                  className={`p-2 rounded-lg text-xs font-medium text-left truncate border ${currentUser.role === r.role ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600' : 'border-slate-200 dark:border-slate-800'}`}
                >
                  {r.icon} {r.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </header>
  );
};
