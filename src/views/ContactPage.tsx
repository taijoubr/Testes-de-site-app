import React from 'react';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  FileText,
  Clock,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { setActiveView, siteConfig } = useApp();

  const currentPhone = siteConfig?.whatsapp || siteConfig?.phone || '(11) 98765-4321';
  const currentPhoneClean = currentPhone.replace(/\D/g, '');
  const currentEmail = siteConfig?.email || 'contato@ncodes.com.br';
  const currentAddress = siteConfig?.address || 'Av. Paulista, 1000 - São Paulo, SP';
  const companyName = siteConfig?.companyName || 'NCodes Technologies';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atendimento Direto & Suporte</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Fale Conosco
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Entre em contato com a equipe da {companyName} através de nossos canais oficiais de atendimento.
        </p>
      </div>

      {/* Quote Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Solicitação de Projeto</span>
          </div>
          <h2 className="text-xl font-bold text-white">Deseja solicitar um orçamento detalhado para seu projeto?</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Acesse nosso formulário dedicado de Solicitação de Orçamento com especificações de funcionalidades, prazos e investimentos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveView('quote_wizard')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <span>Ir para Solicitação de Orçamento</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Official Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WhatsApp / Phone */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">WhatsApp & Telefone</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Atendimento rápido para dúvidas gerais e suporte técnico.
              </p>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white pt-2">
              {currentPhone}
            </p>
          </div>
          <a 
            href={`https://wa.me/55${currentPhoneClean}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Iniciar Conversa no WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* E-mail */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">E-mail Corporativo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Envie suas dúvidas, propostas ou solicitações formais.
              </p>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white pt-2">
              {currentEmail}
            </p>
          </div>
          <a 
            href={`mailto:${currentEmail}`} 
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Enviar E-mail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Location / Sede */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sede Principal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visitas presenciais sob agendamento prévio.
              </p>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white pt-2">
              {currentAddress}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium text-center">
            CEP 01310-100 • Bela Vista
          </div>
        </div>

      </div>

      {/* Business Hours Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-800 text-blue-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">Horário de Atendimento Técnico</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Nossa equipe atende de segunda a sexta-feira, das 09h às 18h. Para solicitações comerciais ou técnicas fora deste horário, você pode registrar uma solicitação de orçamento ou entrar em contato via e-mail.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};


