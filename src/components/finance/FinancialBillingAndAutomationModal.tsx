import React, { useState } from 'react';
import { ClientSubscription, FinancialTransaction } from '../../types';
import { 
  Zap, 
  Send, 
  Copy, 
  Check, 
  X, 
  Mail, 
  MessageSquare, 
  FileText, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Plus, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface FinancialBillingAndAutomationModalProps {
  isOpen?: boolean;
  type?: 'billing' | 'automation';
  selectedSub?: ClientSubscription | null;
  selectedTx?: FinancialTransaction | null;
  subscriptions?: ClientSubscription[];
  onTriggerBillingAll?: () => void;
  onClose: () => void;
}

export const FinancialBillingAndAutomationModal: React.FC<FinancialBillingAndAutomationModalProps> = ({
  isOpen,
  type = 'automation',
  selectedSub,
  selectedTx,
  subscriptions = [],
  onTriggerBillingAll,
  onClose
}) => {
  if (isOpen === false) return null;
  const [copiedPix, setCopiedPix] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Default values from sub or tx
  const clientName = selectedSub?.clientName || selectedTx?.clientName || 'Cliente';
  const clientPhone = selectedSub?.clientPhone || selectedTx?.clientPhone || '(11) 99999-9999';
  const value = selectedSub?.monthlyValue || selectedTx?.amount || 0;
  const pixKey = selectedSub?.pixCopyPaste || '00020126580014br.gov.bcb.pix0136d817452e-503a-4f51-b06f-123456789abc52040000530398654072800.005802BR5918NCodes Technologies6009SAO PAULO62070503***6304E8A2';

  const defaultWhatsappMsg = `Olá ${clientName}! 👋 Passando para lembrar da fatura do serviço no valor de *R$ ${value.toLocaleString('pt-BR')}*. You can pay via PIX key below:\n\n*PIX Copia e Cola:*\n${pixKey}\n\nObrigado! - Equipe NCodes Technologies`;

  const [customMsg, setCustomMsg] = useState(defaultWhatsappMsg);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSendWhatsapp = () => {
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const encoded = encodeURIComponent(customMsg);
    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encoded}`, '_blank');
    setWhatsappSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border shrink-0 ${
              type === 'billing' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              {type === 'billing' ? <Send className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {type === 'billing' ? `Centro de Cobrança - ${clientName}` : 'Régua de Automações de Cobrança'}
              </h3>
              <p className="text-xs text-slate-400">
                {type === 'billing' ? 'Envio direto por WhatsApp, E-mail e chave PIX' : 'Notificações automáticas ativas no sistema'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {type === 'billing' ? (
            <>
              {/* Value Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Valor da Fatura</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    R$ {value.toLocaleString('pt-BR')}
                  </div>
                </div>
                <button
                  onClick={handleCopyPix}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPix ? 'PIX Copiado!' : 'Copiar PIX'}</span>
                </button>
              </div>

              {/* WhatsApp Generator */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mensagem pré-formatada para WhatsApp ({clientPhone})
                </label>
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  onClick={handleSendWhatsapp}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{whatsappSent ? 'Abrindo WhatsApp...' : 'Enviar Cobrança via WhatsApp'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Automations Rules View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Régua de Cobrança Recorrente Ativa
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  O sistema envia alertas automáticos no WhatsApp e e-mail antes e após o vencimento, reduzindo em até 42% a taxa de inadimplência.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { trigger: '7 dias antes', status: 'Ativo', channel: 'E-mail + WhatsApp' },
                  { trigger: '3 dias antes', status: 'Ativo', channel: 'WhatsApp' },
                  { trigger: 'No dia do vencimento', status: 'Ativo', channel: 'WhatsApp com PIX' },
                  { trigger: '7 dias em atraso', status: 'Ativo', channel: 'Notificação de cobrança' },
                  { trigger: '15 dias em atraso', status: 'Ativo', channel: 'Suspensão automática de serviços' }
                ].map((rule, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white">{rule.trigger}</span>
                      <div className="text-[10px] text-slate-400">{rule.channel}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                      {rule.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
