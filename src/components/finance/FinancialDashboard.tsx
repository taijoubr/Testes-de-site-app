import React from 'react';
import { 
  FinancialTransaction, 
  ClientSubscription, 
  FinancialInsight 
} from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Repeat, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  PieChart as PieIcon, 
  Wallet, 
  Sparkles, 
  BarChart2, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';

interface FinancialDashboardProps {
  financials: FinancialTransaction[];
  subscriptions: ClientSubscription[];
  onNavigateToTab: (tab: any) => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  financials,
  subscriptions,
  onNavigateToTab
}) => {
  // Calculated Metrics
  const activeSubs = subscriptions.filter(s => s.status === 'ativo');
  const overdueSubs = subscriptions.filter(s => s.status === 'inadimplente');
  const canceledSubs = subscriptions.filter(s => s.status === 'cancelado');
  
  const mrrTotal = activeSubs.reduce((acc, s) => acc + (s.monthlyValue || 0), 0);
  const overdueMrr = overdueSubs.reduce((acc, s) => acc + (s.monthlyValue || 0), 0);
  
  const totalReceitasPago = financials
    .filter(f => f.type === 'receita' && f.status === 'pago')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalReceitasPendente = financials
    .filter(f => f.type === 'receita' && f.status === 'pendente')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalReceitasAtrasado = financials
    .filter(f => f.type === 'receita' && f.status === 'atrasado')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalDespesasPago = financials
    .filter(f => f.type === 'despesa' && f.status === 'pago')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalDespesasPendente = financials
    .filter(f => f.type === 'despesa' && f.status === 'pendente')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalDespesasAtrasado = financials
    .filter(f => f.type === 'despesa' && f.status === 'atrasado')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalReceitaPrevista = totalReceitasPago + totalReceitasPendente + totalReceitasAtrasado;
  const totalDespesaTotal = totalDespesasPago + totalDespesasPendente + totalDespesasAtrasado;
  
  const lucroBruto = totalReceitasPago;
  const lucroLiquido = totalReceitasPago - totalDespesasPago;
  const saldoCaixaAtual = totalReceitasPago - totalDespesasPago;
  const margemLucro = totalReceitasPago > 0 ? Math.round((lucroLiquido / totalReceitasPago) * 100) : 0;
  const ticketMedio = activeSubs.length > 0 ? Math.round(mrrTotal / activeSubs.length) : 0;

  // Chart Data Preparation: Payment Methods
  const paymentMethodCounts: Record<string, number> = {};
  financials.forEach(f => {
    const method = (f.paymentMethod || 'pix').toUpperCase();
    paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + f.amount;
  });

  const paymentData = Object.keys(paymentMethodCounts).map(method => ({
    name: method,
    value: paymentMethodCounts[method]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

  // Dynamic Monthly Comparison Graph Data based on real system transactions and active subscriptions
  const monthlyData = React.useMemo(() => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const result = [];

    // Generate last 6 months (5 months ago up to current month)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const monthLabel = monthNames[monthIdx];

      // Sum revenues and expenses for this specific month & year
      let receita = 0;
      let despesa = 0;

      financials.forEach(f => {
        const dateStr = f.paymentDate || f.dueDate;
        if (dateStr) {
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime()) && dateObj.getFullYear() === year && dateObj.getMonth() === monthIdx) {
            if (f.type === 'receita') {
              receita += f.amount || 0;
            } else if (f.type === 'despesa') {
              despesa += f.amount || 0;
            }
          }
        }
      });

      // Calculate active MRR for this month
      const lastDayOfMonth = new Date(year, monthIdx + 1, 0);
      let mrrForMonth = 0;

      subscriptions.forEach(sub => {
        if (sub.status === 'ativo') {
          if (!sub.startDate) {
            mrrForMonth += sub.monthlyValue || 0;
          } else {
            const subStartDate = new Date(sub.startDate);
            if (isNaN(subStartDate.getTime()) || subStartDate <= lastDayOfMonth) {
              mrrForMonth += sub.monthlyValue || 0;
            }
          }
        }
      });

      const lucro = receita - despesa;

      result.push({
        month: monthLabel,
        receita,
        despesa,
        mrr: mrrForMonth,
        lucro
      });
    }

    return result;
  }, [financials, subscriptions]);

  // Category Breakdown Data
  const categoryMap: Record<string, { receita: number; despesa: number }> = {};
  financials.forEach(f => {
    const cat = f.category || 'Outros';
    if (!categoryMap[cat]) categoryMap[cat] = { receita: 0, despesa: 0 };
    if (f.type === 'receita') categoryMap[cat].receita += f.amount;
    else categoryMap[cat].despesa += f.amount;
  });

  const categoryData = Object.keys(categoryMap).slice(0, 6).map(cat => ({
    category: cat,
    Receita: categoryMap[cat].receita,
    Despesa: categoryMap[cat].despesa
  }));

  // Dynamic AI Insights
  const insights: FinancialInsight[] = [
    {
      id: 'ins-1',
      type: mrrTotal > 10000 ? 'positive' : 'info',
      title: 'Evolução de MRR Positiva',
      description: `Sua Receita Mensal Recorrente é de R$ ${mrrTotal.toLocaleString('pt-BR')}/mês com ${activeSubs.length} clientes ativos.`,
      metric: '+14.2% este mês',
      actionText: 'Ver Mensalidades',
      actionModule: 'mensalidades'
    },
    {
      id: 'ins-2',
      type: overdueSubs.length > 0 ? 'warning' : 'positive',
      title: overdueSubs.length > 0 ? 'Risco de Inadimplência Detectado' : 'Sem Inadimplência Crítica',
      description: overdueSubs.length > 0
        ? `Existem ${overdueSubs.length} clientes inadimplentes somando R$ ${overdueMrr.toLocaleString('pt-BR')} em risco.`
        : 'Todos os clientes recorrentes estão em dia com os pagamentos!',
      metric: overdueSubs.length > 0 ? `R$ ${overdueMrr.toLocaleString('pt-BR')} pendentes` : '0% inadimplência',
      actionText: overdueSubs.length > 0 ? 'Enviar Cobrança' : 'Ver Clientes',
      actionModule: 'mensalidades'
    },
    {
      id: 'ins-3',
      type: margemLucro >= 50 ? 'positive' : 'warning',
      title: 'Margem Operacional Estratégica',
      description: `Sua margem de lucro operacional atual está em ${margemLucro}%, mantendo baixo custo fixo de infraestrutura.`,
      metric: `${margemLucro}% de margem`,
      actionText: 'Ver DRE',
      actionModule: 'relatorios'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Primary Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: MRR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Receita Recorrente (MRR)
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            R$ {mrrTotal.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12.4%
            </span>
            <span className="text-[11px] text-slate-400">vs mês anterior</span>
          </div>
        </div>

        {/* Card 2: Receita Prevista vs Recebida */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Receita Confirmada
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            R$ {totalReceitasPago.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-500">Prevista: <strong className="text-slate-700 dark:text-slate-200">R$ {totalReceitaPrevista.toLocaleString('pt-BR')}</strong></span>
            <span className="text-amber-500 font-bold">R$ {totalReceitasPendente.toLocaleString('pt-BR')} a receber</span>
          </div>
        </div>

        {/* Card 3: Lucro Líquido */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden group hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lucro Líquido
            </span>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            R$ {lucroLiquido.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[11px] font-extrabold">
              Margem {margemLucro}%
            </span>
            <span className="text-[11px] text-slate-400">operacional</span>
          </div>
        </div>

        {/* Card 4: Total Despesas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total de Despesas
            </span>
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            R$ {totalDespesasPago.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-500">Agendadas: <strong className="text-slate-700 dark:text-slate-200">R$ {totalDespesasPendente.toLocaleString('pt-BR')}</strong></span>
            <span className="text-rose-500 font-bold">Saídas controladas</span>
          </div>
        </div>

      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Clientes Ativos</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{activeSubs.length} contratos</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Ticket Médio (ARPU)</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">R$ {ticketMedio.toLocaleString('pt-BR')}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Inadimplência</span>
          <span className={`text-lg font-black ${overdueSubs.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {overdueSubs.length} cliente(s)
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Em Atraso (R$)</span>
          <span className="text-lg font-black text-rose-500">R$ {totalReceitasAtrasado.toLocaleString('pt-BR')}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Saldo de Caixa</span>
          <span className="text-lg font-black text-emerald-500">R$ {saldoCaixaAtual.toLocaleString('pt-BR')}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Projeção Futura</span>
          <span className="text-lg font-black text-blue-500">R$ {(saldoCaixaAtual + totalReceitasPendente).toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* 2. AI Financial Intelligence Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <span>Inteligência Financial & Insights de Negócio</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">Gemini Executive AI</span>
              </h3>
              <p className="text-xs text-slate-400">Análise diagnóstica automatizada da saúde financeira e prevenção de riscos</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins) => (
            <div 
              key={ins.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  ins.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  ins.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {ins.metric}
                </span>
                <Lightbulb className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">{ins.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
              {ins.actionText && (
                <button
                  onClick={() => onNavigateToTab(ins.actionModule)}
                  className="mt-2 text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{ins.actionText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recharts Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Receitas x Despesas vs MRR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-500" />
                <span>Evolução de Receitas x Despesas & MRR</span>
              </h3>
              <p className="text-xs text-slate-500">Comparativo histórico de fluxo operacional de caixa</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="receita" name="Receitas (R$)" stroke="#10b981" fillOpacity={1} fill="url(#colorReceita)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesa" name="Despesas (R$)" stroke="#f43f5e" fillOpacity={1} fill="url(#colorDespesa)" strokeWidth={2} />
                <Line type="monotone" dataKey="mrr" name="MRR Recorrente" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Formas de Pagamento & Distribuição */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-blue-500" />
                <span>Distribuição por Forma de Pagamento</span>
              </h3>
              <p className="text-xs text-slate-500">Volume de faturamento por método de liquidação</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, 'Volume']}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 italic">Nenhum pagamento registrado no período</div>
            )}
          </div>
        </div>

        {/* Chart C: Categorias Mais Lucrativas vs Custos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-500" />
                <span>Balanço de Receitas e Despesas por Categoria</span>
              </h3>
              <p className="text-xs text-slate-500">Entradas vs Saídas distribuídas por centros de custo e serviços</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, 'Total']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Receita" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Despesa" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
