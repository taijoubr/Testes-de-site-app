import React, { useState } from 'react';
import { 
  FileSignature, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Download, 
  Lock, 
  Globe, 
  Smartphone, 
  Calendar,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProposalAcceptancePage: React.FC = () => {
  const { proposals, selectedProposalIdForAcceptance, acceptProposal, setActiveView } = useApp();

  const proposal = proposals.find(p => p.id === selectedProposalIdForAcceptance) || proposals[0];

  const [signatureName, setSignatureName] = useState(proposal?.clientName || 'Lucas Ferreira');
  const [accepting, setAccepting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!proposal) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <p className="text-slate-500">Nenhuma proposta encontrada.</p>
      </div>
    );
  }

  const isAlreadyAccepted = proposal.status === 'aceito';

  const handleConfirmAcceptance = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccepting(true);
    await acceptProposal(proposal.id, signatureName);
    setAccepting(false);
    setModalOpen(false);
  };

  const handleDownloadPdf = () => {
    // Generate a print preview / download simulation
    window.print();
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 border border-blue-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <FileSignature className="w-3.5 h-3.5" />
              <span>Documento de Aceite Digital com Validade Jurídica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {proposal.title}
            </h1>
            <p className="text-xs text-blue-200">
              Proposta nº <strong className="text-white">{proposal.id}</strong> • Cliente: <strong className="text-white">{proposal.clientName} ({proposal.company})</strong>
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              isAlreadyAccepted
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
            }`}>
              {isAlreadyAccepted ? 'Projeto Iniciado (Aceito)' : 'Aguardando Aceite'}
            </span>

            {isAlreadyAccepted && (
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 border border-white/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Contrato em PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contract & Scope Viewer Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          
          {/* Executive Overview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Resumo da Proposta
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {proposal.description}
            </p>
          </div>

          {/* Scope Checklist */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Escopo e Entregáveis Inclusos
            </h2>
            <div className="space-y-2.5">
              {proposal.scope.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Timeline */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Cronograma de Execução
            </h2>
            <div className="space-y-4">
              {proposal.schedule.map((sch, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400">{sch.phase}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{sch.deliverable}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 shrink-0 self-start sm:self-auto">
                    {sch.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Contract Clauses */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Termos de Contrato</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </h2>
            <pre className="text-xs font-sans whitespace-pre-wrap text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed max-h-48 overflow-y-auto">
              {proposal.contractText}
            </pre>
          </div>

        </div>

        {/* Pricing Sidebar & Digital Acceptance CTA */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investimento Total</span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                R$ {proposal.totalValue.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Forma de Pagamento</span>
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {proposal.paymentTerms}
                </p>
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Ambiente auditado com hash SHA-256</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>Registro automático de IP e dispositivo</span>
                </div>
              </div>
            </div>

            {/* Acceptance Action Button */}
            {isAlreadyAccepted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  ✓ Contrato Assinado Eletronicamente
                </p>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 text-left bg-white dark:bg-slate-900 p-2.5 rounded-xl">
                  <p><strong>Assinado por:</strong> {proposal.signatureName}</p>
                  <p><strong>Data:</strong> {new Date(proposal.acceptedAt || '').toLocaleString('pt-BR')}</p>
                  <p><strong>IP:</strong> {proposal.clientIp}</p>
                  <p><strong>Dispositivo:</strong> {proposal.clientDevice}</p>
                </div>

                <button
                  onClick={() => setActiveView('client_portal')}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 mt-2"
                >
                  <span>Acessar Portal do Cliente</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95"
              >
                <FileSignature className="w-4 h-4" />
                <span>ACEITAR PROPOSTA</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Acceptance Modal Confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <FileSignature className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Assinatura Eletrônica do Contrato</h2>
              <p className="text-xs text-slate-500">
                Você está aceitando a Proposta {proposal.id} no valor de R$ {proposal.totalValue.toLocaleString('pt-BR')}.
              </p>
            </div>

            <form onSubmit={handleConfirmAcceptance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Representante Legal *
                </label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={e => setSignatureName(e.target.value)}
                  placeholder="Nome completo do responsável"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 space-y-1">
                <p><strong>IP Registrado:</strong> 187.58.122.94</p>
                <p><strong>Dispositivo:</strong> Web Browser Validation Token</p>
                <p><strong>Timestamp:</strong> {new Date().toLocaleString('pt-BR')}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={accepting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Assinatura</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
