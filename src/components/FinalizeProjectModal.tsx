import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Repeat,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

interface FinalizeProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const FinalizeProjectModal: React.FC<FinalizeProjectModalProps> = ({ project, onClose }) => {
  const { finalizeProjectAndStartSubscription } = useApp();

  const [completionDate, setCompletionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [monthlyValue, setMonthlyValue] = useState<string>(
    String(project.recurringMonthlyValue || 0)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  // Calculate rule dynamically for preview
  const numMonthlyValue = parseFloat(monthlyValue) || 0;
  const selectedDateObj = completionDate ? new Date(completionDate + 'T12:00:00') : new Date();
  const dayOfMonth = selectedDateObj.getDate();
  const isFirstHalf = dayOfMonth <= 15;

  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth();
  const nextMonthObj = new Date(year, month + 1, 10);
  const nextMonthName = nextMonthObj.toLocaleString('pt-BR', { month: 'long' });

  const firstChargeHalfValue = Math.round((numMonthlyValue * 0.5) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await finalizeProjectAndStartSubscription(
      project.id,
      numMonthlyValue,
      completionDate
    );

    setIsSubmitting(false);

    if (res) {
      setResultMsg(res.ruleApplied);
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        
        {/* HEADER */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Finalizar Projeto & Iniciar Mensalidade</h3>
              <p className="text-xs text-slate-400">Projeto: <strong className="text-slate-200">{project.title}</strong></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          {resultMsg ? (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-300">Projeto Finalizado com Sucesso!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{resultMsg}</p>
            </div>
          ) : (
            <>
              {/* Client and Project Summary Box */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Cliente: <strong className="text-white">{project.clientName}</strong></span>
                  <span>ID: <strong className="text-cyan-400">{project.id}</strong></span>
                </div>
                <div className="text-slate-400">
                  <span>Categoria: <strong className="text-slate-200">{project.category}</strong></span>
                </div>
              </div>

              {/* Completion Date Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Data de Conclusão e Entrega do Projeto *
                </label>
                <input
                  type="date"
                  required
                  value={completionDate}
                  onChange={e => setCompletionDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Monthly Subscription Fee Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Valor da Mensalidade Pós-Implementação (R$/mês) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={monthlyValue}
                    onChange={e => setMonthlyValue(e.target.value)}
                    placeholder="1200.00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 p-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Defina o valor da manutenção, hospedagem e sustentação mensal deste cliente.
                </p>
              </div>

              {/* Dynamic Billing Rule Preview Banner */}
              {numMonthlyValue === 0 ? (
                <div className="p-4 rounded-2xl border bg-emerald-950/30 border-emerald-500/30 text-emerald-300">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Isento de Mensalidade</h4>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    Este projeto/melhoria será finalizado sem cobrança ou criação de nova assinatura mensal recorrente.
                  </p>
                </div>
              ) : (
                <div className={`p-4 rounded-2xl border transition-all ${
                  isFirstHalf 
                    ? 'bg-blue-950/40 border-blue-500/40 text-blue-200' 
                    : 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="w-4 h-4 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {isFirstHalf 
                        ? `Regra: Conclusão até o Dia 15 (Dia ${dayOfMonth})` 
                        : `Regra: Conclusão após o Dia 15 (Dia ${dayOfMonth})`}
                    </h4>
                  </div>

                  {isFirstHalf ? (
                    <div className="text-xs space-y-1.5 leading-relaxed">
                      <p>
                        📌 Como o projeto foi finalizado na 1ª quinzena (dia <strong>{dayOfMonth}</strong>), será gerada uma cobrança de <strong>50% (R$ {firstChargeHalfValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</strong> pro-rata para o mês atual.
                      </p>
                      <p className="text-slate-300">
                        🗓️ A partir de 10 de <strong>{nextMonthName}</strong>, a mensalidade será cobrada em seu valor integral de <strong>R$ {numMonthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1.5 leading-relaxed">
                      <p>
                        📌 Como o projeto foi finalizado após o dia 15 (dia <strong>{dayOfMonth}</strong>), o cliente fica <strong>isento</strong> de cobrança no mês atual.
                      </p>
                      <p className="text-slate-300">
                        🗓️ A primeira mensalidade de <strong>R$ {numMonthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> iniciará somente em 10 de <strong>{nextMonthName}</strong>.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Finalizar Projeto & Ativar Mensalidade</span>
                </button>
              </div>
            </>
          )}

        </form>

      </div>
    </div>
  );
};
