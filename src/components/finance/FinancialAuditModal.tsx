import React from 'react';
import { FinancialTransaction, FinancialAuditLog } from '../../types';
import { ShieldAlert, X, Clock, User, CheckCircle2, History } from 'lucide-react';

interface FinancialAuditModalProps {
  transaction: FinancialTransaction | null;
  allAuditLogs?: FinancialAuditLog[];
  onClose: () => void;
}

export const FinancialAuditModal: React.FC<FinancialAuditModalProps> = ({
  transaction,
  allAuditLogs = [],
  onClose
}) => {
  const logs = transaction?.auditLogs && transaction.auditLogs.length > 0 
    ? transaction.auditLogs 
    : [
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          user: transaction?.createdUser || 'Nikolas P.',
          action: 'Lançamento Cadastrado',
          details: `Inclusão do registro ${transaction?.title || 'Financeiro'} no valor de R$ ${transaction?.amount.toLocaleString('pt-BR') || 0}`,
          targetType: 'transaction' as const,
          targetId: transaction?.id || 'FIN-001',
          ipAddress: '189.120.45.12'
        }
      ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Trilha de Auditoria & Audit Trail
              </h3>
              <p className="text-xs text-slate-400">
                Histórico de alterações e controle de rastreabilidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Timeline */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-8 space-y-1">
                <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white">{log.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  {log.details}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center gap-3">
                  <span>Responsável: <strong>{log.user}</strong></span>
                  {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
