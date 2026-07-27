import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Smartphone, 
  Globe, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Bot, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Star, 
  ChevronRight,
  BarChart3,
  Users2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_SERVICES, INITIAL_PORTFOLIO } from '../data/initialData';

export const InstitutionalHome: React.FC = () => {
  const { setActiveView, isAdminAuthenticated, isClientAuthenticated, siteConfig } = useApp();

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl bg-grid-pattern">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{siteConfig.heroBadge || 'Cadastre-se e solicite seu orçamento online'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            {siteConfig.heroTitle ? (
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent text-glow-blue">
                {siteConfig.heroTitle}
              </span>
            ) : (
              <>Transformamos ideias em <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent text-glow-blue">soluções digitais</span>.</>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {siteConfig.heroSubtitle || 'Desenvolvemos ecossistemas tecnológicos completos: aplicativos móveis iOS, sistemas web empresariais, inteligência artificial e APIs na nuvem. Cadastre-se na nossa Área do Cliente para solicitar seu orçamento de forma rápida e segura.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView(isClientAuthenticated ? 'client_portal' : 'client_auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cadastre-se e solicite seu orçamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('services')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <span>Conhecer Nossos Serviços</span>
            </button>
          </div>

          {/* Highlights Band */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm text-center">
              <p className="text-2xl font-black text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Tempo Real & Nuvem</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm text-center">
              <p className="text-2xl font-black text-white bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">24/7</p>
              <p className="text-xs text-slate-400 mt-0.5">Suporte & Monitoramento</p>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose NCodes Technologies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            Diferenciais Competitivos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Por que escolher a NCodes Technologies?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Combinamos engenharia de ponta, design refinado e foco absoluto no retorno sobre o investimento dos nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bento-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group hover:border-blue-500/50">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atendimento Personalizado</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Comunicação transparente através de canal direto com o Tech Lead do projeto, relatórios semanais e acompanhamento em tempo real.
            </p>
          </div>

          <div className="bento-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group hover:border-indigo-500/50">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Desenvolvimento Sob Medida</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Nada de modelos engessados. Arquitetamos Clean Architecture e MVVM ajustados rigorosamente ao fluxo operacional de sua empresa.
            </p>
          </div>

          <div className="bento-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group hover:border-emerald-500/50">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Segurança & Performance</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Criptografia de dados end-to-end, conformidade LGPD, tempos de resposta ultrarrápidos e backup automático em nuvem.
            </p>
          </div>

        </div>
      </section>

      {/* Site Topics Navigation Section - Separate Pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            Navegação por Áreas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Cada Área do Nosso Site
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Acesse páginas dedicadas para cada tópico e conheça todos os detalhes dos nossos serviços, projetos e atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Serviços */}
          <div 
            onClick={() => setActiveView('services')}
            className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Serviços Especializados
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Desenvolvimento de apps mobile, sistemas web SaaS, APIs resilientes e integração com IA Gemini.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Acessar Página de Serviços</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Portfólio */}
          <div 
            onClick={() => setActiveView('portfolio')}
            className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-cyan-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Portfólio de Projetos
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Casos de sucesso reais entregues com métricas de desempenho e detalhes técnicos de arquitetura.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <span>Acessar Portfólio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Sobre Nós */}
          <div 
            onClick={() => setActiveView('about')}
            className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Sobre a NCodes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nossa história, missão, visão, valores corporativos e a equipe de engenheiros responsável pelas entregas.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Conhecer Nossa História</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Contato */}
          <div 
            onClick={() => setActiveView('contact')}
            className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-emerald-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Contato & Canais
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fale conosco via WhatsApp, e-mail corporativo ou envie sua proposta diretamente ao nosso atendimento.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Página de Contato</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Área do Cliente */}
          <div 
            onClick={() => setActiveView('client_portal')}
            className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-purple-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Área do Cliente
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Acompanhe o andamento do projeto, converse com os devs via chat em tempo real e baixe entregáveis.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Acessar Portal do Cliente</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="bg-slate-950 text-white py-16 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-slate-800 shadow-2xl relative overflow-hidden bg-grid-pattern">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Casos de Sucesso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Portfólio de Projetos
            </h2>
          </div>
          <button
            onClick={() => setActiveView('portfolio')}
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:underline cursor-pointer"
          >
            <span>Ver Galeria Completa</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {INITIAL_PORTFOLIO.slice(0, 3).map(item => (
            <div 
              key={item.id}
              onClick={() => setActiveView('portfolio')}
              className="bento-card bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer shadow-2xl flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-md">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                {item.metrics && (
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.metrics}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white overflow-hidden shadow-2xl border border-blue-500/30">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Cadastre-se e solicite seu orçamento sem compromisso
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Crie sua conta em poucos segundos na Área do Cliente para enviar os detalhes do seu projeto, receber propostas com estimativa de IA e acompanhar todo o desenvolvimento em tempo real.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setActiveView(isClientAuthenticated ? 'client_portal' : 'client_auth')}
                className="px-8 py-3.5 rounded-2xl bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all cursor-pointer"
              >
                Cadastre-se & Solicite seu Orçamento
              </button>
              <button
                onClick={() => setActiveView('contact')}
                className="px-8 py-3.5 rounded-2xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Falar pelo WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
