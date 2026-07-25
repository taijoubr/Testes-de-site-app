import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Clock, DollarSign, Code, Smartphone, Globe, Cpu, Zap, Bot, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_SERVICES } from '../data/initialData';

export const ServicesPage: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Soluções Tecnológicas Completas</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nossos Serviços Especializados
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Desenvolvimento sob medida com arquitetura moderna, código proprietário, sincronização em tempo real e suporte técnico dedicado.
        </p>
      </div>

      {/* Services Detailed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INITIAL_SERVICES.map(service => (
          <div 
            key={service.id}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Code className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Prazo Médio: {service.avgTime}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {service.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.description}
              </p>

              {/* Benefits list */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Benefícios Principais:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Badges */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Tecnologias Utilizadas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.technologies.map(tech => (
                    <span 
                      key={tech}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Action Footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Investimento Inicial</p>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{service.startingPrice}</p>
              </div>

              <button
                onClick={() => setActiveView('quote_wizard')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
