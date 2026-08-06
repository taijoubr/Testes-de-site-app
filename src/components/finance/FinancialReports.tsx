import React, { useState } from 'react';
import { FinancialTransaction, ClientSubscription } from '../../types';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Calendar 
} from 'lucide-react';

interface FinancialReportsProps {
  financials: FinancialTransaction[];
  subscriptions: ClientSubscription[];
  onExportCSV: () => void;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  financials,
  subscriptions,
  onExportCSV
}) => {
  const [reportType, setReportType] = useState<'dre' | 'inadimplencia' | 'abc' | 'categorias'>('dre');

  const totalReceita = financials
    .filter(f => f.type === 'receita' && f.status === 'pago')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalDespesa = financials
    .filter(f => f.type === 'despesa' && f.status === 'pago')
    .reduce((acc, f) => acc + f.amount, 0);

  const impostoEstimado = Math.round(totalReceita * 0.06); // 6% Simples Nacional
  const lucroBruto = totalReceita;
  const lucroLiquido = totalReceita - totalDespesa - impostoEstimado;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Report Controls & Type Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Relatórios Gerenciais & Contabilidade DRE</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Centro de Relatórios & Demonstração de Resultado
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Exportar Excel / CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Gerar PDF</span>
            </button>
          </div>
        </div>

        {/* Report Type Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'dre', label: 'Demonstração de Resultado (DRE)' },
            { id: 'inadimplencia', label: 'Relatório de Inadimplência' },
            { id: 'abc', label: 'Curva ABC de Clientes' },
            { id: 'categorias', label: 'Despesas por Categoria' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setReportType(r.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                reportType === r.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Printable Report View */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-6 print:p-0 print:bg-white print:text-black">
          {/* Company Printable Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                NCodes Technologies LTDA
              </span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {reportType === 'dre' ? 'DRE - Demonstração do Resultado do Exercício' :
                 reportType === 'inadimplencia' ? 'Relatório de Clientes Inadimplentes' :
                 reportType === 'abc' ? 'Curva ABC de Representatividade de Faturamento' :
                 'Relatório de Custos e Despesas por Categoria'}
              </h4>
              <p className="text-xs text-slate-400">Gerado em {new Date().toLocaleDateString('pt-BR')} por Admin Financeiro</p>
            </div>
            <Building2 className="w-10 h-10 text-slate-300" />
          </div>

          {/* DRE Body */}
          {reportType === 'dre' && (
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-bold">1. RECEITA BRUTA OPERACIONAL</span>
                <span className="font-black text-emerald-600">R$ {totalReceita.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-2 pl-4 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <span>(-) Impostos sobre Serviços (Simples Nacional 6%)</span>
                <span className="text-rose-500">- R$ {impostoEstimado.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-2.5 bg-slate-200/60 dark:bg-slate-800 px-3 rounded-xl font-bold">
                <span className="text-slate-900 dark:text-white">2. RECEITA LÍQUIDA OPERACIONAL</span>
                <span className="font-black text-slate-900 dark:text-white">R$ {(totalReceita - impostoEstimado).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-2 pl-4 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <span>(-) Custos Operacionais e Despesas Pagas</span>
                <span className="text-rose-500">- R$ {totalDespesa.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-3 bg-emerald-500/10 border border-emerald-500/30 px-4 rounded-2xl font-black text-base text-emerald-600 dark:text-emerald-400">
                <span>3. LUCRO LÍQUIDO DO EXERCÍCIO (EBITDA)</span>
                <span>R$ {lucroLiquido.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          )}

          {/* Inadimplência Body */}
          {reportType === 'inadimplencia' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Listagem de clientes recorrentes com pagamentos atrasados:</p>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 font-bold text-slate-400">
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Serviço</th>
                    <th className="py-2 text-right">Valor Mensal</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {subscriptions.filter(s => s.status === 'inadimplente').map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 font-extrabold text-slate-900 dark:text-white">{s.clientName}</td>
                      <td className="py-2.5 text-slate-500">{s.serviceName}</td>
                      <td className="py-2.5 text-right font-black text-amber-500">R$ {s.monthlyValue.toLocaleString('pt-BR')}</td>
                      <td className="py-2.5 text-center font-bold text-amber-500 uppercase">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
