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
  ArrowLeft,
  FileText,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProposalAcceptancePage: React.FC = () => {
  const { proposals, quotes, selectedProposalIdForAcceptance, acceptProposal, setActiveView, setSelectedContractId, currentRole } = useApp();

  let proposal = proposals.find(p => p.id === selectedProposalIdForAcceptance || p.quoteId === selectedProposalIdForAcceptance);

  if (!proposal && selectedProposalIdForAcceptance) {
    const matchingQuote = quotes.find(q => q.id === selectedProposalIdForAcceptance || q.proposalId === selectedProposalIdForAcceptance);
    if (matchingQuote) {
      proposal = {
        id: matchingQuote.proposalId || `PROP-${matchingQuote.id}`,
        quoteId: matchingQuote.id,
        title: matchingQuote.projectTitle || matchingQuote.projectType || 'Proposta de Desenvolvimento de Software',
        clientName: matchingQuote.clientName,
        company: matchingQuote.company || matchingQuote.clientName,
        description: matchingQuote.description,
        scope: matchingQuote.scopeItems || matchingQuote.selectedFeatures || ['Desenvolvimento Web/Mobile', 'Painel Admin', 'API'],
        totalValue: matchingQuote.offeredValue || 15000,
        paymentTerms: matchingQuote.paymentTerms || '30% de entrada no aceite + 3 parcelas mensais',
        contractText: `INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA\n\nCONTRATADA: NCodes Technologies Ltda\nCONTRATANTE: ${matchingQuote.clientName}\nVALOR TOTAL: R$ ${(matchingQuote.offeredValue || 15000).toLocaleString('pt-BR')}`,
        status: matchingQuote.status === 'aprovado' ? 'aceito' : 'pendente',
        createdAt: matchingQuote.createdAt
      };
    }
  }

  if (!proposal) {
    proposal = proposals[0];
  }

  const [signatureName, setSignatureName] = useState(proposal?.clientName || 'Representante Legal');
  const [accepting, setAccepting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!proposal) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <p className="text-slate-500">Nenhuma proposta comercial encontrada.</p>
        <button
          onClick={() => setActiveView(currentRole === 'admin' ? 'admin' : 'client_portal')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Voltar ao Painel
        </button>
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
    const printElement = document.getElementById('proposal-printable-area');
    if (!printElement) {
      window.print();
      return;
    }

    try {
      const printWindow = window.open('', '_blank', 'width=900,height=1000');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <title>${proposal.title} - ${proposal.id}</title>
              <meta charset="utf-8" />
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff !important; color: #000000 !important; padding: 15px; }
                  .no-print { display: none !important; }
                }
                body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; background: #ffffff; color: #0f172a; }
              </style>
            </head>
            <body>
              <div style="max-width: 800px; margin: 0 auto;" class="space-y-6">
                <div class="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
                  <div>
                    <h1 class="text-2xl font-black text-slate-900 uppercase tracking-tight">NCodes Technologies</h1>
                    <p class="text-xs text-slate-600 font-semibold">Proposta Comercial nº ${proposal.id}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-slate-800">Cliente: ${proposal.clientName}</p>
                    <p class="text-xs text-slate-500">${new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                ${printElement.innerHTML}
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                }, 600);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Navigation Control Bar (Hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveView(currentRole === 'admin' ? 'admin' : 'client_portal')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao {currentRole === 'admin' ? 'Painel Administrativo' : 'Portal do Cliente'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedContractId(proposal.contractId || proposal.quoteId || proposal.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>📄 Visualizar Contrato em PDF</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-800 shadow-2xl relative overflow-hidden">
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

            <button
              onClick={handleDownloadPdf}
              className="no-print px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar / Imprimir PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contract & Scope Viewer Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div id="proposal-printable-area" className="lg:col-span-8 space-y-6">
          
          {/* Executive Overview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Resumo da Proposta Comercial
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {proposal.description}
            </p>
          </div>

          {/* Scope Checklist */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Escopo e Entregáveis Inclusos no Projeto
            </h2>
            <div className="space-y-2.5">
              {proposal.scope.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Timeline */}
          {proposal.schedule && proposal.schedule.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                Cronograma de Execução e Fases
              </h2>
              <div className="space-y-3">
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
          )}

          {/* Legal Contract Clauses */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Termos de Contrato</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </h2>
            <pre className="text-xs font-sans whitespace-pre-wrap text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed max-h-60 overflow-y-auto">
              {proposal.contractText}
            </pre>
          </div>

        </div>

        {/* Pricing Sidebar & Digital Acceptance CTA */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investimento do Projeto</span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                R$ {proposal.totalValue.toLocaleString('pt-BR')}
              </p>
              {Boolean(proposal.recurringMonthlyValue && proposal.recurringMonthlyValue > 0) && (
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1.5">
                  + R$ {proposal.recurringMonthlyValue?.toLocaleString('pt-BR')}/mês (Suporte e Infra)
                </p>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Forma de Pagamento</span>
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">
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
                  <span>Registro de IP e dispositivo no aceite</span>
                </div>
              </div>
            </div>

            {/* Acceptance Action Button */}
            {isAlreadyAccepted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  ✓ Contrato Assinado Eletronicamente
                </p>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 text-left bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p><strong>Assinado por:</strong> {proposal.signatureName}</p>
                  <p><strong>Data:</strong> {new Date(proposal.acceptedAt || '').toLocaleString('pt-BR')}</p>
                  <p><strong>IP:</strong> {proposal.clientIp}</p>
                  <p><strong>Dispositivo:</strong> {proposal.clientDevice}</p>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <button
                    onClick={() => setSelectedContractId(proposal.contractId || proposal.quoteId || proposal.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer no-print"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ver Contrato Assinado (PDF)</span>
                  </button>

                  <button
                    onClick={() => setActiveView('client_portal')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer no-print"
                  >
                    <span>Acessar Portal do Cliente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 no-print">
                <button
                  onClick={() => setSelectedContractId(proposal.contractId || proposal.quoteId || proposal.id)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>📄 Ler Minuta Completa em PDF</span>
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>ACEITAR PROPOSTA</span>
                </button>
              </div>
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
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={accepting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
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
