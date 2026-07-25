import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

import { 
  LayoutDashboard, 
  FileText, 
  FolderGit2, 
  DollarSign, 
  Users, 
  Briefcase, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Send, 
  FileSignature, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Download,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { ProposalGeneratorModal } from '../components/ProposalGeneratorModal';
import { QuoteRequest, Project, FinancialTransaction, LeadCRM, QuoteStatus } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    quotes, 
    proposals, 
    projects, 
    financials, 
    leads, 
    updateQuoteStatus, 
    setSelectedProposalIdForAcceptance, 
    setActiveView,
    toggleProjectTask,
    addProjectHours,
    addProjectFile,
    addFinancialTransaction,
    updateFinancialStatus,
    updateLeadStage,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'projects' | 'financials' | 'crm' | 'team'>('dashboard');

  // Proposal modal trigger
  const [selectedQuoteForProp, setSelectedQuoteForProp] = useState<QuoteRequest | null>(null);

  // New Transaction Form state
  const [showFinModal, setShowFinModal] = useState(false);
  const [finTitle, setFinTitle] = useState('');
  const [finType, setFinType] = useState<'receita' | 'despesa'>('receita');
  const [finCategory, setFinCategory] = useState('Desenvolvimento de Software');
  const [finAmount, setFinAmount] = useState(5000);
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finPaymentMethod, setFinPaymentMethod] = useState<'pix' | 'cartao' | 'transferencia' | 'dinheiro'>('pix');

  // Financial calculations
  const totalRevenue = financials.filter(f => f.type === 'receita' && f.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendingRevenue = financials.filter(f => f.type === 'receita' && f.status === 'pendente').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = financials.filter(f => f.type === 'despesa' && f.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Chart data
  const chartData = [
    { month: 'Jan', Receitas: 18500, Despesas: 4200 },
    { month: 'Fev', Receitas: 24000, Despesas: 5100 },
    { month: 'Mar', Receitas: 31000, Despesas: 6800 },
    { month: 'Abr', Receitas: 28000, Despesas: 5900 },
    { month: 'Mai', Receitas: 42000, Despesas: 8100 },
    { month: 'Jun', Receitas: 38000, Despesas: 7400 },
    { month: 'Jul', Receitas: totalRevenue, Despesas: totalExpenses }
  ];

  const handleCreateFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    addFinancialTransaction({
      title: finTitle,
      type: finType,
      category: finCategory,
      amount: Number(finAmount),
      dueDate: finDueDate,
      status: 'pendente',
      paymentMethod: finPaymentMethod
    });
    setShowFinModal(false);
    setFinTitle('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Painel de Controle Unificado NCodes</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Gestão Empresarial & Sincronização
          </h1>
          <p className="text-xs text-slate-500">Logado como: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quotes' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Orçamentos ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'projects' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projetos ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'financials' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financeiro</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'crm' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'team' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipe</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bento-card p-6 bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Receita Realizada</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><TrendingUp className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-white relative z-10">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold relative z-10">+18.5% comparado ao mês anterior</p>
            </div>

            <div className="bento-card p-6 bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">A Receber (Pendente)</span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30"><Clock className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-white relative z-10">
                R$ {totalPendingRevenue.toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-amber-400 font-semibold relative z-10">{financials.filter(f => f.status === 'pendente').length} parcelas pendentes</p>
            </div>

            <div className="bento-card p-6 bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Projetos Ativos</span>
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30"><FolderGit2 className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-white relative z-10">
                {projects.filter(p => p.status === 'em_andamento').length}
              </p>
              <p className="text-[11px] text-blue-400 font-semibold relative z-10">Sincronização com App Mobile</p>
            </div>

            <div className="bento-card p-6 bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Lucro Líquido</span>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30"><DollarSign className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-white relative z-10">
                R$ {netProfit.toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-purple-400 font-semibold relative z-10">Margem operacional positiva</p>
            </div>

          </div>

          {/* Recharts Cash Flow Graph */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fluxo de Caixa Mensal</h2>
                <p className="text-xs text-slate-500">Comparativo entre Receitas Realizadas e Despesas Operacionais</p>
              </div>
              <button 
                onClick={() => setActiveTab('financials')} 
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Ver Detalhes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="Receitas" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Quotes Quick Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Solicitações de Orçamento Recentes</h2>
              <button onClick={() => setActiveTab('quotes')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Gerenciar Todos os Orçamentos ({quotes.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">ID / Cliente</th>
                    <th className="pb-3">Projeto</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">IA Sugestão</th>
                    <th className="pb-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quotes.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {q.id} <span className="block text-[10px] text-slate-400 font-normal">{q.clientName} ({q.company})</span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{q.projectType}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          q.status === 'aprovado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                          q.status === 'proposta_enviada' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {q.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {q.aiAnalysis ? `R$ ${q.aiAnalysis.suggestedBudget.toLocaleString('pt-BR')}` : 'Analisando...'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedQuoteForProp(q);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                        >
                          Elaborar Proposta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: QUOTES & PROPOSALS MANAGEMENT */}
      {activeTab === 'quotes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestão de Orçamentos & Propostas Digitais</h2>
              <p className="text-xs text-slate-500">Acompanhe as solicitações dos clientes e envie os links de aceite digital de contrato.</p>
            </div>
            <button
              onClick={() => setActiveView('quote_wizard')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Simular Novo Orçamento</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {quotes.map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{q.id} • {q.createdAt.split('T')[0]}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{q.clientName} ({q.company})</h3>
                    <p className="text-xs text-slate-500">{q.whatsapp} | {q.email} | {q.city}-{q.state}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={q.status}
                      onChange={e => updateQuoteStatus(q.id, e.target.value as QuoteStatus)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="solicitado">Solicitado</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="em_elaboracao">Em Elaboração</option>
                      <option value="proposta_enviada">Proposta Enviada</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="rejeitado">Rejeitado</option>
                    </select>

                    <button
                      onClick={() => setSelectedQuoteForProp(q)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>Gerar Proposta</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Descrição dos Requisitos:</p>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl leading-relaxed">
                      {q.description}
                    </p>
                    <div className="flex gap-4 text-slate-500">
                      <span>Prazo: <strong>{q.deadline}</strong></span>
                      <span>Faixa: <strong>{q.budgetRange}</strong></span>
                    </div>
                  </div>

                  {q.aiAnalysis && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span>Análise de Engenharia Gemini AI:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{q.aiAnalysis.summary}</p>
                      <div className="flex items-center justify-between pt-2 text-[11px] font-semibold border-t border-blue-200 dark:border-blue-900">
                        <span>Horas Estimadas: <strong>{q.aiAnalysis.estimatedHours}h</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400">Sugestão: <strong>R$ {q.aiAnalysis.suggestedBudget.toLocaleString('pt-BR')}</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proposals associated */}
                {q.proposalId && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        Proposta {q.proposalId} emitida para este orçamento.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProposalIdForAcceptance(q.proposalId);
                        setActiveView('proposal_accept');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500"
                    >
                      Abrir Link de Aceite Digital
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS KANBAN & CHECKLIST */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestão de Projetos & Checklist em Tempo Real</h2>
              <p className="text-xs text-slate-500">Controle de horas, progresso percentual, equipe alocada e repositório de arquivos.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{p.id} • {p.category}</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{p.title}</h3>
                    <p className="text-xs text-slate-500">Cliente: {p.clientName}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    p.status === 'em_andamento' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Progresso de Conclusão:</span>
                    <span className="text-blue-600 dark:text-blue-400">{p.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500" 
                      style={{ width: `${p.progressPercentage}%` }} 
                    />
                  </div>
                </div>

                {/* Hours Tracker */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Horas Previstas: <strong>{p.estimatedHours}h</strong></span>
                    <span className="text-slate-500 ml-4">Realizadas: <strong>{p.completedHours}h</strong></span>
                  </div>
                  <button
                    onClick={() => addProjectHours(p.id, 5)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
                  >
                    +5 Horas
                  </button>
                </div>

                {/* Checklist Tasks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Checklist de Atividades:</h4>
                  <div className="space-y-2">
                    {p.tasks.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => toggleProjectTask(p.id, t.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          t.completed 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs font-semibold">
                          <CheckCircle2 className={`w-4 h-4 ${t.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                          <span>{t.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {t.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Uploader Sim */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{p.files.length} arquivos no repositório</span>
                  <button
                    onClick={() => addProjectFile(p.id, `Manual_Tecnico_${Date.now()}.pdf`, '1.5 MB', 'pdf')}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                  >
                    + Anexar Arquivo
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL MANAGEMENT */}
      {activeTab === 'financials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestão Financeira, Faturamento & Pix</h2>
              <p className="text-xs text-slate-500">Controle de receitas, parcelas, despesas e fluxo de caixa.</p>
            </div>

            <button
              onClick={() => setShowFinModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lançamento</span>
            </button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Descrição / Cliente</th>
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Categoria</th>
                    <th className="pb-3">Vencimento</th>
                    <th className="pb-3">Valor</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {financials.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {f.title}
                        <span className="block text-[10px] text-slate-400 font-normal">{f.clientName || 'NCodes Interno'}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {f.type}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{f.category}</td>
                      <td className="py-3 text-slate-500">{f.dueDate}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        R$ {f.amount.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          f.status === 'pago' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {f.status !== 'pago' ? (
                          <button
                            onClick={() => updateFinancialStatus(f.id, 'pago')}
                            className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                          >
                            Dar Baixa (Pago)
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-500 font-bold">✓ Confirmado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CRM PIPELINE */}
      {activeTab === 'crm' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Funil de Vendas CRM</h2>
            <p className="text-xs text-slate-500">Acompanhe seus leads desde a prospecção até o fechamento do contrato.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(['prospeccao', 'qualificacao', 'proposta', 'fechamento', 'ganho'] as LeadCRM['stage'][]).map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);
              return (
                <div key={stage} className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">{stage}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600">{stageLeads.length}</span>
                  </div>

                  <div className="space-y-3">
                    {stageLeads.map(lead => (
                      <div key={lead.id} className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{lead.name}</h4>
                        <p className="text-[10px] text-slate-500">{lead.company}</p>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">R$ {lead.value.toLocaleString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: TEAM & PERMISSIONS */}
      {activeTab === 'team' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Matriz de Níveis de Permissão</h2>
            <p className="text-xs text-slate-500">Controle de acesso por papel: Administrador, Gerente, Financeiro, Dev, Designer, Suporte e Cliente.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Perfil / Função</th>
                    <th className="pb-3">Gestão de Orçamentos</th>
                    <th className="pb-3">Acesso Financeiro</th>
                    <th className="pb-3">Código & DevOps</th>
                    <th className="pb-3">Atendimento Cliente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 font-bold text-blue-600 dark:text-blue-400">Administrador (Nikolas)</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Total</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Total</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Total</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Total</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-purple-600 dark:text-purple-400">Financeiro (Juliana)</td>
                    <td className="py-3 text-slate-400">Visualização</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Total</td>
                    <td className="py-3 text-slate-400">Bloqueado</td>
                    <td className="py-3 text-slate-400">Bloqueado</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">Desenvolvedor (Gabriel)</td>
                    <td className="py-3 text-slate-400">Visualização</td>
                    <td className="py-3 text-slate-400">Bloqueado</td>
                    <td className="py-3 text-emerald-500 font-bold">✓ Total</td>
                    <td className="py-3 text-blue-500 font-semibold">Suporte Chat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Generator Modal Popup */}
      {selectedQuoteForProp && (
        <ProposalGeneratorModal
          quote={selectedQuoteForProp}
          onClose={() => setSelectedQuoteForProp(null)}
        />
      )}

      {/* New Financial Modal */}
      {showFinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Novo Lançamento Financeiro</h2>
            <form onSubmit={handleCreateFinancial} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Título / Descrição</label>
                <input
                  type="text"
                  required
                  value={finTitle}
                  onChange={e => setFinTitle(e.target.value)}
                  placeholder="Ex: Parcela 1 - Projeto X"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tipo</label>
                  <select
                    value={finType}
                    onChange={e => setFinType(e.target.value as 'receita' | 'despesa')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="receita">Receita (+)</option>
                    <option value="despesa">Despesa (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    value={finAmount}
                    onChange={e => setFinAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFinModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
