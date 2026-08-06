import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Repeat, 
  Calendar as CalendarIcon, 
  Wallet, 
  PieChart as PieIcon, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Sliders,
  Clock,
  Sparkles,
  Zap,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';

export type FinancialSubTab = 
  | 'dashboard' 
  | 'receitas' 
  | 'despesas' 
  | 'mensalidades' 
  | 'fluxo_caixa' 
  | 'calendario' 
  | 'parcelamentos' 
  | 'conciliacao' 
  | 'relatorios' 
  | 'automacoes' 
  | 'auditoria';

export type PeriodFilter = 'hoje' | 'ontem' | 'esta_semana' | 'este_mes' | '30_dias' | 'ano' | 'todos';

interface FinancialHeaderProps {
  activeSubTab: FinancialSubTab;
  setActiveSubTab: (tab: FinancialSubTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  periodFilter: PeriodFilter;
  setPeriodFilter: (period: PeriodFilter) => void;
  typeFilter: 'todos' | 'receita' | 'despesa';
  setTypeFilter: (type: 'todos' | 'receita' | 'despesa') => void;
  onOpenNewSubModal: () => void;
  onOpenNewTransactionModal: () => void;
  onOpenAutomationsModal: () => void;
  onExportData: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkReceive: () => void;
  onBulkDelete: () => void;
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({
  activeSubTab,
  setActiveSubTab,
  searchTerm,
  setSearchTerm,
  periodFilter,
  setPeriodFilter,
  typeFilter,
  setTypeFilter,
  onOpenNewSubModal,
  onOpenNewTransactionModal,
  onOpenAutomationsModal,
  onExportData,
  selectedCount,
  onClearSelection,
  onBulkReceive,
  onBulkDelete
}) => {
  const tabs: { id: FinancialSubTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard & Insights', icon: LayoutDashboard },
    { id: 'mensalidades', label: 'Mensalidades (MRR)', icon: Repeat },
    { id: 'fluxo_caixa', label: 'Fluxo de Caixa', icon: Wallet },
    { id: 'receitas', label: 'Receitas', icon: TrendingUp },
    { id: 'despesas', label: 'Despesas & Custos', icon: TrendingDown },
    { id: 'calendario', label: 'Calendário', icon: CalendarIcon },
    { id: 'parcelamentos', label: 'Parcelamentos', icon: Layers },
    { id: 'conciliacao', label: 'Conciliação', icon: CheckCircle2 },
    { id: 'relatorios', label: 'Relatórios & DRE', icon: BarChart3 },
    { id: 'automacoes', label: 'Régua de Cobrança', icon: Zap },
    { id: 'auditoria', label: 'Audit Trail', icon: ShieldAlert }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-5">
      {/* Top Banner & Main Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Centro Financeiro & Gestão de Recorrência Enterprise</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestão Financeira & Fluxo de Caixa ERP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Controle analítico de receitas, mensalidades MRR, custos internos, régua de cobrança via WhatsApp/E-mail, conciliação e fluxo de caixa projetado.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewSubModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Mensalidade</span>
          </button>

          <button
            onClick={onOpenNewTransactionModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Lançamento Avulso</span>
          </button>

          <button
            onClick={onOpenAutomationsModal}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Configurar Automações de Cobrança"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Régua de Cobrança</span>
          </button>

          <button
            onClick={onExportData}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
            title="Exportar dados para Excel / CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (When Items Selected) */}
      {selectedCount > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black text-xs">
              {selectedCount}
            </span>
            <span>{selectedCount === 1 ? 'item selecionado' : 'itens selecionados'} para ação em massa</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBulkReceive}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Marcar como Pago</span>
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold text-xs cursor-pointer"
            >
              Excluir Selecionados
            </button>
            <button
              onClick={onClearSelection}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tabs Scrollable Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        {/* Smart Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisa inteligente (Cliente, CPF/CNPJ, Categoria, Valor, Contrato...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Period Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Período:
          </span>
          {[
            { id: 'hoje', label: 'Hoje' },
            { id: 'esta_semana', label: 'Esta Semana' },
            { id: 'este_mes', label: 'Este Mês' },
            { id: '30_dias', label: 'Últimos 30d' },
            { id: 'ano', label: 'Ano' },
            { id: 'todos', label: 'Todos' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodFilter(p.id as PeriodFilter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                periodFilter === p.id
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Type Toggle Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
          {(['todos', 'receita', 'despesa'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'todos' ? 'Todos' : t === 'receita' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
