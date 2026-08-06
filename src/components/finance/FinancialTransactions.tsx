import React, { useState } from 'react';
import { FinancialTransaction, FinancialStatus } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  FileText, 
  CreditCard, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Edit, 
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';

interface FinancialTransactionsProps {
  financials: FinancialTransaction[];
  searchTerm: string;
  onOpenNewTransactionModal: () => void;
  onMarkAsPaid: (transaction: FinancialTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  onViewAuditLogs: (transaction: FinancialTransaction) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export const FinancialTransactions: React.FC<FinancialTransactionsProps> = ({
  financials,
  searchTerm,
  onOpenNewTransactionModal,
  onMarkAsPaid,
  onDeleteTransaction,
  onViewAuditLogs,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');

  const categories = Array.from(new Set(financials.map(f => f.category || 'Geral')));

  const filtered = financials.filter(f => {
    const matchesStatus = statusFilter === 'todos' || f.status === statusFilter;
    const matchesCategory = categoryFilter === 'todas' || f.category === categoryFilter;
    const matchesSearch = 
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.clientName && f.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.supplierName && f.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.category && f.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.invoiceNumber && f.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const allSelected = filtered.length > 0 && filtered.every(f => selectedIds.includes(f.id));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-5 animate-in fade-in duration-200">
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Lançamentos Financeiros (Receitas & Despesas)
          </h3>
          <p className="text-xs text-slate-500">
            Controle de fluxo de entradas, saídas, emissão de cobranças e registro de baixas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="todos">Todos os Status</option>
            <option value="pago">PAGO</option>
            <option value="pendente">PENDENTE</option>
            <option value="atrasado">ATRASADO</option>
            <option value="cancelado">CANCELADO</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="todas">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={onOpenNewTransactionModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>+ Lançamento</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-black tracking-wider">
              <th className="py-3 px-3 rounded-l-xl w-10">
                <button onClick={onToggleSelectAll} className="cursor-pointer">
                  {allSelected ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                </button>
              </th>
              <th className="py-3 px-3">Vencimento</th>
              <th className="py-3 px-3">Descrição & Categoria</th>
              <th className="py-3 px-3">Cliente / Fornecedor</th>
              <th className="py-3 px-3">Forma Pgto</th>
              <th className="py-3 px-3 text-right">Valor (R$)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center rounded-r-xl">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                  Nenhum lançamento financeiro encontrado
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isReceita = item.type === 'receita';
                const isPaid = item.status === 'pago';
                const isOverdue = item.status === 'atrasado';

                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-emerald-500/5 dark:bg-emerald-500/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <button onClick={() => onToggleSelect(item.id)} className="cursor-pointer">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-slate-400" />}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300">
                      <div>{new Date(item.dueDate).toLocaleDateString('pt-BR')}</div>
                      {item.paymentDate && (
                        <div className="text-[10px] text-emerald-600 font-normal">
                          Pago em {new Date(item.paymentDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {isReceita ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.category} {item.costCenter ? `• ${item.costCenter}` : ''} {item.invoiceNumber ? `• ${item.invoiceNumber}` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {item.clientName || item.supplierName || 'NCodes Technologies'}
                    </td>

                    <td className="py-3.5 px-3 uppercase font-bold text-slate-500 text-[11px]">
                      {item.paymentMethod || 'pix'}
                    </td>

                    <td className={`py-3.5 px-3 text-right font-black text-sm ${
                      isReceita ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isReceita ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR')}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        isPaid ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' :
                        isOverdue ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!isPaid && (
                          <button
                            onClick={() => onMarkAsPaid(item)}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                            title="Dar Baixa (Marcar como Pago)"
                          >
                            Baixar
                          </button>
                        )}

                        <button
                          onClick={() => onViewAuditLogs(item)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                          title="Ver Histórico de Auditoria"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteTransaction(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 cursor-pointer"
                          title="Excluir Lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
