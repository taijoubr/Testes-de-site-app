import React from 'react';
import { FinancialTransaction } from '../../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  RefreshCw, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';

interface FinancialReconciliationProps {
  financials: FinancialTransaction[];
  onReconcile: (id: string) => void;
}

export const FinancialReconciliation: React.FC<FinancialReconciliationProps> = ({
  financials,
  onReconcile
}) => {
  const reconciledItems = financials.filter(f => f.reconciled);
  const pendingReconciliation = financials.filter(f => !f.reconciled && f.status === 'pago');
  const unconfirmedItems = financials.filter(f => f.status !== 'pago');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-500 uppercase">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>Conciliação Bancária & Auditoria de Extrato</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Conciliação Financeira de Contas
            </h3>
            <p className="text-xs text-slate-500">
              Conferência de pagamentos confirmados via comprovante PIX / Extrato Itaú vs lançamentos no sistema.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-600 border border-teal-500/30">
              {reconciledItems.length} conciliados
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/30">
              {pendingReconciliation.length} para conferir
            </span>
          </div>
        </div>

        {/* Pending Reconciliation Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Lançamentos Pagos Aguardando Conciliação Bancária</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-black">
                  <th className="py-3 px-4 rounded-l-xl">Data Pgto</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Cliente / Fornecedor</th>
                  <th className="py-3 px-4">Forma</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingReconciliation.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Todos os lançamentos pagos já foram devidamente conciliados!
                    </td>
                  </tr>
                ) : (
                  pendingReconciliation.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('pt-BR') : 'Data n/d'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.title}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{item.clientName || item.supplierName}</td>
                      <td className="py-3.5 px-4 uppercase font-bold text-slate-500">{item.paymentMethod}</td>
                      <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                        R$ {item.amount.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onReconcile(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          Conciliar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
