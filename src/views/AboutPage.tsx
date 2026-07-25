import React from 'react';
import { Sparkles, Target, Eye, Award, Users, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/initialData';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nossa Trajetória & Valores</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sobre a NCodes Technologies
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Somos uma empresa especializada em desenvolvimento de software de alta complexidade, unindo inovação, estética apurada e arquitetura escalável.
        </p>
      </div>

      {/* History Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Nossa História</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Fundada com o propósito de redefinir o padrão de qualidade do desenvolvimento de software corporativo no Brasil, a NCodes Technologies nasceu da união de engenheiros experientes motivados a criar soluções que realmente transformam negócios.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ao longo dos anos, construímos uma estrutura capaz de atender desde startups emergentes até grandes corporações, mantendo sempre o compromisso de código limpo, entrega dentro do prazo e total transparência.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-3xl font-black text-blue-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Sincronização em Tempo Real</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-3xl font-black text-indigo-400">Nuvem</p>
            <p className="text-xs text-slate-400 mt-1">Arquitetura Escalável</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-3xl font-black text-cyan-400">98.5%</p>
            <p className="text-xs text-slate-400 mt-1">Satisfação dos Clientes</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-3xl font-black text-emerald-400">24/7</p>
            <p className="text-xs text-slate-400 mt-1">Monitoramento de Cloud</p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Missão</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Desenvolver soluções tecnológicas robustas e intuitivas que impulsionem a eficiência e a rentabilidade dos nossos clientes.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visão</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Ser referência nacional e internacional no desenvolvimento sob medida de softwares empresariais e aplicativos móveis.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Valores</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Transparência irrestrita, compromisso rigoroso com prazos, melhoria contínua e valorização das pessoas.
          </p>
        </div>

      </div>

      {/* Team Showcase */}
      <div className="space-y-8">
        <div className="text-center">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Profissionais Talentosos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Conheça Nossa Equipe
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM_MEMBERS.slice(0, 4).map(member => (
            <div key={member.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-md hover:shadow-xl transition-all">
              <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-blue-500" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{member.role}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{member.company}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
