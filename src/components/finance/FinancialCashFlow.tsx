import React, { useState } from 'react';
import { FinancialTransaction } from '../../types';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Filter, 
  TrendingUp, 
  Download,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface FinancialCashFlowProps {
  financials: FinancialTransaction[];
  onOpenNewTransactionModal: () => void;
}

export const FinancialCashFlow: React.FC<FinancialCashFlowProps> = ({
  financials,
  onOpenNewTransactionModal
}) => {
  const [projectionPeriod, setProjectionPeriod] = useState<30 | 60 | 90>(30);

  // Group transactions by date
  const sortedTransactions = [...financials].sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  const totalEntradasPago = financials
    .filter(f => f.type === 'receita' && f.status === 'pago')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalSaidasPago = financials
    .filter(f => f.type === 'despesa' && f.status === 'pago')
    .reduce((acc, f) => acc + f.amount, 0);

  const saldoRealCaixa = totalEntradasPago - totalSaidasPago;

  const totalEntradasPrevistas = financials
    .filter(f => f.type === 'receita' && (f.status === 'pendente' || f.status === 'atrasado'))
    .reduce((acc, f) => acc + f.amount, 0);

  const totalSaidasPrevistas = financials
    .filter(f => f.type === 'despesa' && f.status === 'pendente')
    .reduce((acc, f) => acc + f.amount, 0);

  const saldoProjetadoFuturo = saldoRealCaixa + totalEntradasPrevistas - totalSaidasPrevistas;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. ERP Cash Flow Summary Dashboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4 text-blue-500" />
              <span>Controle Tesouraria & Projeção Diária</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Fluxo de Caixa Operacional (ERP Style)
            </h3>
            <p className="text-xs text-slate-500">
              Visão consolidada de movimentações líquidas, saldos realizados e projeção de tesouraria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Projeção:</span>
            {([30, 60, 90] as const).map((days) => (
              <button
                key={days}
                onClick={() => setProjectionPeriod(days)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  projectionPeriod === days
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {days} dias
              </button>
            ))}
          </div>
        </div>

        {/* Real Cash Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
              <span>Entradas Confirmadas</span>
              <ArrowUpCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              R$ {totalEntradasPago.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Efetivadas na conta
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">
              <span>Saídas Efetivadas</span>
              <ArrowDownCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              R$ {totalSaidasPago.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
              Custos e despesas liquidados
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
              <span>Saldo Atual em Caixa</span>
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              R$ {saldoRealCaixa.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              Disponibilidade imediata
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
            <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
              <span>Saldo Projetado ({projectionPeriod}d)</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              R$ {saldoProjetadoFuturo.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Projeção de Tesouraria
            </div>
          </div>

        </div>
      </div>

      {/* 2. Detailed Movement Schedule Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Extrato Sequencial de Movimentações de Caixa</span>
          </h4>
          <span className="text-xs text-slate-400">{sortedTransactions.length} lançamentos mapeados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-black tracking-wider">
                <th className="py-3 px-4 rounded-l-xl">Vencimento / Data</th>
                <th className="py-3 px-4">Descrição & Categoria</th>
                <th className="py-3 px-4">Entidade / Cliente</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center rounded-r-xl">Conciliado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    Nenhum lançamento no fluxo de caixa
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((item) => {
                  const isReceita = item.type === 'receita';
                  const isPaid = item.status === 'pago';
                  const isOverdue = item.status === 'atrasado';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                        {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">{item.title}</div>
                        <div className="text-[10px] text-slate-400">{item.category} {item.costCenter ? `• ${item.costCenter}` : ''}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {item.clientName || item.supplierName || 'NCodes Corp'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${
                          isReceita ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-right font-black text-sm ${
                        isReceita ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isReceita ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                          isPaid ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' :
                          isOverdue ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30' :
                          'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.reconciled ? (
                          <span className="text-emerald-500 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sim</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Pendente</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
