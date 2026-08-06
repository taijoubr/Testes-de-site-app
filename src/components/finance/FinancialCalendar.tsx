import React, { useState } from 'react';
import { FinancialTransaction, ClientSubscription } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Repeat 
} from 'lucide-react';

interface FinancialCalendarProps {
  financials: FinancialTransaction[];
  subscriptions: ClientSubscription[];
  onMarkAsPaid: (item: FinancialTransaction) => void;
}

export const FinancialCalendar: React.FC<FinancialCalendarProps> = ({
  financials,
  subscriptions,
  onMarkAsPaid
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedDayItems, setSelectedDayItems] = useState<{ dateStr: string; items: FinancialTransaction[]; subs: ClientSubscription[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Helper to format date YYYY-MM-DD
  const formatDateStr = (day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 animate-in fade-in duration-200">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <span>Calendário Financeiro de Vencimentos</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Receitas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Despesas / Custos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Mensalidades Recorrentes</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div key={d} className="text-xs font-black uppercase text-slate-400 py-2">
            {d}
          </div>
        ))}

        {/* Empty slots for first week offset */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-24 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200/50 dark:border-slate-800/50"></div>
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(day);

          const dayTransactions = financials.filter(f => f.dueDate === dateStr);
          const daySubscriptions = subscriptions.filter(s => s.billingCycleDay === day || s.nextDueDate === dateStr);

          const hasEvents = dayTransactions.length > 0 || daySubscriptions.length > 0;

          return (
            <div
              key={day}
              onClick={() => {
                if (hasEvents) {
                  setSelectedDayItems({ dateStr, items: dayTransactions, subs: daySubscriptions });
                }
              }}
              className={`min-h-24 p-2 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                hasEvents
                  ? 'bg-white dark:bg-slate-850 border-slate-300 dark:border-slate-700 hover:border-blue-500 shadow-xs cursor-pointer'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">{day}</span>
                {hasEvents && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                    {dayTransactions.length + daySubscriptions.length}
                  </span>
                )}
              </div>

              {/* Day Event Pills */}
              <div className="space-y-1 mt-1">
                {dayTransactions.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md truncate ${
                      t.type === 'receita'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    R$ {t.amount} • {t.title}
                  </div>
                ))}

                {daySubscriptions.slice(0, 1).map((s) => (
                  <div
                    key={s.id}
                    className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md truncate bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  >
                    MRR R$ {s.monthlyValue} • {s.clientName}
                  </div>
                ))}

                {(dayTransactions.length + daySubscriptions.length) > 3 && (
                  <div className="text-[9px] text-slate-400 font-bold">
                    +{(dayTransactions.length + daySubscriptions.length) - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      {selectedDayItems && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Vencimentos para {new Date(selectedDayItems.dateStr + 'T12:00:00').toLocaleDateString('pt-BR')}
                </h4>
                <p className="text-xs text-slate-400">Lançamentos operacionais e cobranças de mensalidades</p>
              </div>
              <button
                onClick={() => setSelectedDayItems(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDayItems.items.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      item.type === 'receita' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {item.type}
                    </span>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{item.clientName || item.supplierName} • {item.category}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      R$ {item.amount.toLocaleString('pt-BR')}
                    </div>
                    {item.status !== 'pago' && (
                      <button
                        onClick={() => {
                          onMarkAsPaid(item);
                          setSelectedDayItems(null);
                        }}
                        className="mt-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Baixar
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {selectedDayItems.subs.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-500">Mensalidade MRR</span>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{sub.clientName}</div>
                    <div className="text-[10px] text-slate-400">{sub.serviceName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                      R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
