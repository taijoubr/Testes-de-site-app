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
  const { setActiveView } = useApp();

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl bg-grid-pattern">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Copy - Bento Main Tile */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>NCodes Technologies • Soluções Digitais Sob Medida</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Transformamos ideias em <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent text-glow-blue">soluções digitais</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Desenvolvemos ecossistemas tecnológicos completos: aplicativos móveis em Flutter, sistemas web empresariais, automações com IA Gemini e APIs resilientes com sincronização Cloud Firestore em tempo real.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveView('quote_wizard')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Solicitar Orçamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveView('services')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <span>Conhecer Nossos Serviços</span>
                </button>
              </div>

              {/* Bento Stats Band */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-black text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">100%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tempo Real & Nuvem</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-black text-white bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">+50</p>
                  <p className="text-xs text-slate-400 mt-0.5">Sistemas Entregues</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-black text-white bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">99.9%</p>
                  <p className="text-xs text-slate-400 mt-0.5">SLA de Disponibilidade</p>
                </div>
              </div>

            </div>

            {/* Visual Hero Mockup Graphic - Bento Card Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Card Graphic */}
                <div className="bento-card p-6 shadow-2xl space-y-4 relative overflow-hidden border border-blue-500/20">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/50" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                      ncodes-tech-core.v3
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-blue-500/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Flutter Mobile App</p>
                          <p className="text-[10px] text-slate-400">iOS & Android Real-time Sync</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ativo</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-indigo-500/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Painel Web Admin</p>
                          <p className="text-[10px] text-slate-400">Financeiro & Gestão de Projetos</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Sincronizado</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-purple-500/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Gemini AI Engine</p>
                          <p className="text-[10px] text-slate-400">Automação de Atendimento</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">24/7 Conectado</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                    <span className="text-[11px]">Cloud Firestore & FCM</span>
                    <span className="text-cyan-400 font-mono text-[10px] bg-cyan-950/50 px-2 py-0.5 rounded">Latency: 12ms</span>
                  </div>
                </div>

              </div>
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
          
          <div className="bento-card p-8 bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 relative group hover:border-blue-500/50">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atendimento Personalizado</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Comunicação transparente através de canal direto com o Tech Lead do projeto, relatórios semanais e acompanhamento em tempo real.
            </p>
          </div>

          <div className="bento-card p-8 bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 relative group hover:border-indigo-500/50">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Desenvolvimento Sob Medida</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Nada de modelos engessados. Arquitetamos Clean Architecture e MVVM ajustados rigorosamente ao fluxo operacional de sua empresa.
            </p>
          </div>

          <div className="bento-card p-8 bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 relative group hover:border-emerald-500/50">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Segurança & Performance</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Criptografia de dados end-to-end, conformidade LGPD, tempos de resposta ultrarrápidos e backup automático em nuvem.
            </p>
          </div>

        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Nossa Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
              Serviços Especializados
            </h2>
          </div>
          <button
            onClick={() => setActiveView('services')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <span>Ver Todos os 8 Serviços</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_SERVICES.slice(0, 4).map(service => (
            <div 
              key={service.id}
              onClick={() => setActiveView('services')}
              className="bento-card p-6 bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">{service.startingPrice}</span>
                <span className="font-bold text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Detalhes <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
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
              Pronto para levar seu projeto digital ao próximo nível?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Fale diretamente com nossa equipe de especialistas, solicite seu orçamento inteligente e acompanhe todo o desenvolvimento em tempo real.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setActiveView('quote_wizard')}
                className="px-8 py-3.5 rounded-2xl bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all cursor-pointer"
              >
                Solicitar Orçamento Agora
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
