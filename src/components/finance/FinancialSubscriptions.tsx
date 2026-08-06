import React, { useState } from 'react';
import { ClientSubscription, SubscriptionStatus } from '../../types';
import { 
  Repeat, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Plus, 
  Search, 
  Edit3, 
  Settings, 
  Copy, 
  Send, 
  PauseCircle, 
  PlayCircle, 
  XCircle, 
  Calendar, 
  FileText,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface FinancialSubscriptionsProps {
  subscriptions: ClientSubscription[];
  onOpenNewSubModal: () => void;
  onEditSub: (sub: ClientSubscription) => void;
  onOpenBillingModal: (sub: ClientSubscription) => void;
  onToggleSubStatus: (subId: string, newStatus: SubscriptionStatus) => void;
}

export const FinancialSubscriptions: React.FC<FinancialSubscriptionsProps> = ({
  subscriptions,
  onOpenNewSubModal,
  onEditSub,
  onOpenBillingModal,
  onToggleSubStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSubs = subscriptions.filter(sub => {
    const matchesStatus = statusFilter === 'todos' || sub.status === statusFilter;
    const matchesSearch = 
      sub.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.contractNumber && sub.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalMRR = subscriptions
    .filter(s => s.status === 'ativo')
    .reduce((acc, s) => acc + s.monthlyValue, 0);

  const activeCount = subscriptions.filter(s => s.status === 'ativo').length;
  const overdueCount = subscriptions.filter(s => s.status === 'inadimplente').length;
  const suspendedCount = subscriptions.filter(s => s.status === 'suspenso').length;

  const handleCopyPix = (pix: string, id: string) => {
    navigator.clipboard.writeText(pix);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top MRR Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-emerald-500 text-xs font-bold uppercase">
            <span>MRR Total Ativo</span>
            <Repeat className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            R$ {totalMRR.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-slate-400">Em contratos recorrentes ativos</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-blue-500 text-xs font-bold uppercase">
            <span>Contratos Ativos</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {activeCount} clientes
          </div>
          <div className="text-xs text-slate-400">Sustentação e mensalidades</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-amber-500 text-xs font-bold uppercase">
            <span>Inadimplentes</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {overdueCount} clientes
          </div>
          <div className="text-xs text-slate-400">Atraso registrado em mensalidade</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-rose-500 text-xs font-bold uppercase">
            <span>Suspensos / Cancelados</span>
            <PauseCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {suspendedCount} assinaturas
          </div>
          <div className="text-xs text-slate-400">Serviços pausados</div>
        </div>
      </div>

      {/* Main Subscriptions List Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Gestão de Mensalidades Recorrentes (SaaS / Sustentação)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black">
              {filteredSubs.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente, contrato ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Status Pills Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'ativo', label: 'Ativos' },
                { id: 'inadimplente', label: 'Inadimplentes' },
                { id: 'suspenso', label: 'Suspensos' },
                { id: 'cancelado', label: 'Cancelados' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenNewSubModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cadastrar Mensalidade</span>
            </button>
          </div>
        </div>

        {/* Subscriptions Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 italic">
              Nenhuma mensalidade encontrada para os filtros selecionados
            </div>
          ) : (
            filteredSubs.map((sub) => {
              const isAtivo = sub.status === 'ativo';
              const isInadimplente = sub.status === 'inadimplente';
              const isSuspenso = sub.status === 'suspenso';

              return (
                <div 
                  key={sub.id} 
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-500 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 block">
                          {sub.contractNumber || 'Contrato Recorrente'} • Vencimento dia {sub.billingCycleDay}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {sub.clientName}
                        </h4>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {sub.serviceName}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                        isAtivo ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' :
                        isInadimplente ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30' :
                        isSuspenso ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Valor Mensal</span>
                        <span className="font-black text-slate-900 dark:text-white text-base">
                          R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Próximo Vencimento</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {sub.nextDueDate ? new Date(sub.nextDueDate).toLocaleDateString('pt-BR') : `Dia ${sub.billingCycleDay}`}
                        </span>
                      </div>
                    </div>

                    {sub.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        "{sub.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenBillingModal(sub)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Cobrar</span>
                      </button>

                      <button
                        onClick={() => onEditSub(sub)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
                        title="Alterar valor ou detalhes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {sub.pixCopyPaste && (
                      <button
                        onClick={() => handleCopyPix(sub.pixCopyPaste!, sub.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-blue-500/20"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedId === sub.id ? 'Copiado!' : 'PIX'}</span>
                      </button>
                    )}

                    {isAtivo ? (
                      <button
                        onClick={() => onToggleSubStatus(sub.id, 'suspenso')}
                        className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
                      >
                        Suspender
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleSubStatus(sub.id, 'ativo')}
                        className="text-xs text-emerald-500 hover:underline font-bold cursor-pointer"
                      >
                        Reativar
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
