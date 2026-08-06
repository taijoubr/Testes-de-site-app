import React, { useState } from 'react';
import { FinancialTransaction } from '../../types';
import { 
  Layers, 
  DollarSign, 
  Percent, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Calculator, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface FinancialInstallmentsProps {
  financials: FinancialTransaction[];
  onOpenNewTransactionModal: () => void;
  onMarkAsPaid: (item: FinancialTransaction) => void;
}

export const FinancialInstallments: React.FC<FinancialInstallmentsProps> = ({
  financials,
  onOpenNewTransactionModal,
  onMarkAsPaid
}) => {
  const [selectedTx, setSelectedTx] = useState<FinancialTransaction | null>(null);
  const [installmentsCount, setInstallmentsCount] = useState<number>(3);
  const [interestPercent, setInterestPercent] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const pendingTransactions = financials.filter(f => f.status === 'pendente' || f.status === 'atrasado');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Gestão de Parcelamentos, Juros & Renegociações</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Centro de Parcelamento & Repactuação Financeira
            </h3>
            <p className="text-xs text-slate-500">
              Parcelamento de faturas grandes, aplicação de juros por atraso, multa e quitação antecipada.
            </p>
          </div>

          <button
            onClick={onOpenNewTransactionModal}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Lançamento Parcelado</span>
          </button>
        </div>

        {/* Pending Invoices for Renegotiation */}
        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Cobranças Elegíveis para Renegociação ou Parcelamento
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTransactions.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 italic">
                Nenhum lançamento pendente ou em atraso para parcelar
              </div>
            ) : (
              pendingTransactions.map((tx) => (
                <div key={tx.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-500">{tx.category}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600">
                      {tx.status}
                    </span>
                  </div>

                  <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">{tx.title}</h5>
                  <p className="text-xs text-slate-400">{tx.clientName || 'Cliente NCodes'}</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-black text-slate-900 dark:text-white text-base">
                      R$ {tx.amount.toLocaleString('pt-BR')}
                    </span>
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                    >
                      Renegociar / Parcelar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Renegotiation Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Renegociar {selectedTx.title}
              </h4>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Parcelas: {installmentsCount}x
                </label>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={installmentsCount}
                  onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Juros por Atraso (%):
                </label>
                <input
                  type="number"
                  value={interestPercent}
                  onChange={(e) => setInterestPercent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-bold text-amber-700 dark:text-amber-300">
                Valor por Parcela: R$ {((selectedTx.amount * (1 + interestPercent / 100)) / installmentsCount).toFixed(2)} / mês
              </div>

              <button
                onClick={() => {
                  alert(`Renegociação confirmada! Dividido em ${installmentsCount} parcelas de R$ ${((selectedTx.amount * (1 + interestPercent / 100)) / installmentsCount).toFixed(2)}`);
                  setSelectedTx(null);
                }}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold cursor-pointer"
              >
                Confirmar Acordo de Parcelamento
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
