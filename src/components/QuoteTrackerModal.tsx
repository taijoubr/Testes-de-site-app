import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Send, 
  Paperclip, 
  Download, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  XCircle, 
  ChevronRight, 
  History, 
  FileCheck,
  Building2,
  Phone,
  Mail,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuoteRequest, QuoteStatus, QuoteAttachment } from '../types';

interface QuoteTrackerModalProps {
  quote: QuoteRequest;
  onClose: () => void;
  isAdminView?: boolean;
}

export const QuoteTrackerModal: React.FC<QuoteTrackerModalProps> = ({ quote, onClose, isAdminView = false }) => {
  const { 
    approveQuoteByClient, 
    refuseQuoteByClient, 
    requestQuoteChangesByClient, 
    respondToQuoteRequest, 
    addQuoteAttachment,
    setSelectedProjectId,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'proposal' | 'messages' | 'details'>('timeline');

  // Interactive action modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  // Manual Due Dates for Aceite
  const [manualDueDate, setManualDueDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [manualMonthlyDueDate, setManualMonthlyDueDate] = useState<string>('Dia 10 de cada mês');

  // Form states
  const [refusalReason, setRefusalReason] = useState('');
  const [changeText, setChangeText] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // File upload state
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper status formatting
  const getStatusInfo = (status: QuoteStatus) => {
    switch (status) {
      case 'solicitado':
        return {
          label: 'Solicitação Enviada',
          bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          dot: 'bg-amber-500',
          step: 1,
          desc: 'Sua solicitação de orçamento foi recebida com sucesso e aguarda análise.'
        };
      case 'em_analise':
        return {
          label: 'Em Análise Técnica',
          bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          dot: 'bg-blue-500',
          step: 2,
          desc: 'Nossa equipe de arquitetura de software está avaliando o escopo e tecnologias.'
        };
      case 'aguardando_informacoes':
        return {
          label: 'Aguardando Informações',
          bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          dot: 'bg-orange-500',
          step: 3,
          desc: 'Solicitamos dados complementares. Por favor, responda para darmos sequência.'
        };
      case 'orcamento_disponivel':
      case 'proposta_enviada':
        return {
          label: 'Orçamento Disponível',
          bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          dot: 'bg-emerald-500',
          step: 4,
          desc: 'Orçamento concluído! Você pode analisar os valores, prazo e aprovar a proposta.'
        };
      case 'em_negociacao':
        return {
          label: 'Em Negociação',
          bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
          dot: 'bg-purple-500',
          step: 4,
          desc: 'Ajustes no orçamento estão sendo negociados entre você e nossa equipe.'
        };
      case 'aprovado':
        return {
          label: 'Aprovado / Em Execução',
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          step: 5,
          desc: 'Orçamento aceito! O projeto foi iniciado com sucesso.'
        };
      case 'recusado':
      case 'rejeitado':
        return {
          label: 'Recusado',
          bg: 'bg-red-500/10 text-red-500 border-red-500/20',
          dot: 'bg-red-500',
          step: 5,
          desc: 'Esta solicitação foi encerrada como recusada.'
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
          step: 5,
          desc: 'Solicitação cancelada.'
        };
      default:
        return {
          label: 'Solicitação Enviada',
          bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          dot: 'bg-amber-500',
          step: 1,
          desc: 'Aguardando processamento.'
        };
    }
  };

  const statusInfo = getStatusInfo(quote.status);

  const handleCopyId = () => {
    navigator.clipboard.writeText(quote.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    await approveQuoteByClient(quote.id, {
      dueDate: manualDueDate,
      monthlyDueDate: manualMonthlyDueDate
    });
    setIsSubmitting(false);
    setShowApproveModal(false);
  };

  const handleRefuse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await refuseQuoteByClient(quote.id, refusalReason.trim());
    setIsSubmitting(false);
    setShowRefuseModal(false);
  };

  const handleChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeText.trim()) return;
    setIsSubmitting(true);
    await requestQuoteChangesByClient(quote.id, changeText.trim());
    setIsSubmitting(false);
    setShowChangeModal(false);
    setChangeText('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setIsSubmitting(true);
    await respondToQuoteRequest(quote.id, messageInput.trim());
    setMessageInput('');
    setIsSubmitting(false);
  };

  const handleFileUploadSimulated = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      await addQuoteAttachment(quote.id, {
        name: file.name,
        size: sizeMB,
        type: file.type || 'application/octet-stream',
        uploadedBy: isAdminView ? 'Equipe NCodes' : (quote.clientName || 'Cliente'),
        uploadedRole: isAdminView ? 'admin' : 'client',
        url: '#'
      });
    }
  };

  const timelineItems = quote.timeline || [];
  const sortedTimeline = [...timelineItems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-5 md:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800 text-cyan-400 font-bold border border-slate-700/60 flex items-center gap-1.5">
                {quote.id}
                <button onClick={handleCopyId} title="Copiar ID" className="hover:text-cyan-300 transition-colors">
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium border flex items-center gap-1.5 ${statusInfo.bg}`}>
                <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                {statusInfo.label}
              </span>
              {quote.category && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
                  {quote.category}
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {quote.projectTitle || quote.projectType}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {quote.clientName} ({quote.company || 'Pessoa Física'})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Criado em: {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
              </span>
              {quote.updatedAt && (
                <span className="flex items-center gap-1 text-cyan-400/90">
                  <Clock className="w-3.5 h-3.5" />
                  Última atalização: {new Date(quote.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors self-start md:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px]">
            {[
              { step: 1, label: 'Solicitação', icon: FileText, key: 'solicitado' },
              { step: 2, label: 'Em Análise', icon: Clock, key: 'em_analise' },
              { step: 3, label: 'Informações', icon: AlertTriangle, key: 'aguardando_informacoes' },
              { step: 4, label: 'Proposta / Negociação', icon: DollarSign, key: 'orcamento_disponivel' },
              { step: 5, label: quote.status === 'recusado' ? 'Recusado' : 'Aprovado / Projeto', icon: quote.status === 'recusado' ? XCircle : CheckCircle2, key: 'aprovado' }
            ].map((st, idx) => {
              const isCurrent = statusInfo.step === st.step;
              const isPassed = statusInfo.step > st.step;
              const IconComp = st.icon;

              return (
                <React.Fragment key={st.step}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? quote.status === 'recusado'
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                          : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {isPassed ? <Check className="w-4 h-4" /> : <IconComp className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-medium leading-tight ${isCurrent ? 'text-cyan-400 font-bold' : isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                        {st.label}
                      </p>
                    </div>
                  </div>
                  {idx < 4 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded ${
                      isPassed ? 'bg-emerald-500/50' : 'bg-slate-800'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* STATUS ALERT BANNERS */}
        {quote.status === 'aguardando_informacoes' && (
          <div className="bg-orange-950/40 border-b border-orange-500/30 p-4 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-orange-200 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-orange-300 block text-sm">Atenção: A equipe solicitou informações adicionais</strong>
                <p className="mt-0.5 opacity-90">{quote.adminNotes || 'Por gentileza, envie mais detalhes ou responda pelo campo de mensagens abaixo.'}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('messages')}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap self-end md:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Responder Agora
            </button>
          </div>
        )}

        {quote.status === 'aprovado' && (
          <div className="bg-emerald-950/40 border-b border-emerald-500/30 p-4 px-6 flex items-center justify-between gap-3 text-emerald-200 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="text-emerald-300 block text-sm">Orçamento Aprovado com Sucesso!</strong>
                <p className="opacity-90">Este orçamento foi convertido em um Projeto ativo e em execução técnica.</p>
              </div>
            </div>
            {quote.convertedProjectId && (
              <button 
                onClick={() => {
                  setSelectedProjectId(quote.convertedProjectId);
                  setActiveView('client_portal');
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                Acompanhar Projeto
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* MODAL NAVIGATION TABS */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-2 pt-2">
          {[
            { id: 'timeline', label: 'Linha do Tempo', icon: History, count: timelineItems.length },
            { id: 'proposal', label: 'Proposta & Valores', icon: DollarSign, highlight: quote.offeredValue ? true : false },
            { id: 'messages', label: 'Mensagens & Anexos', icon: MessageSquare, count: quote.attachments?.length || 0 },
            { id: 'details', label: 'Detalhes do Escopo', icon: FileText }
          ].map(tab => {
            const IconC = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive 
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-lg' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-t-lg'
                }`}
              >
                <IconC className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: LINHA DO TEMPO (TIMELINE) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-cyan-400" />
                    Histórico Completo de Evolução
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Acompanhe em tempo real todas as alterações de status, avaliações técnicas e comunicações.
                  </p>
                </div>
                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-700">
                  <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                  Anexar Documento
                  <input type="file" onChange={handleFileUploadSimulated} className="hidden" />
                </label>
              </div>

              {sortedTimeline.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 border border-slate-800/80 rounded-xl">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhum registro no histórico até o momento.</p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {sortedTimeline.map((item, idx) => {
                    const isSystem = item.userRole === 'system';
                    const isAdmin = item.userRole === 'admin';
                    return (
                      <div key={item.id || idx} className="relative group">
                        {/* Circle Marker */}
                        <div className={`absolute -left-[29px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-slate-900 ${
                          isAdmin ? 'border-cyan-400 text-cyan-400' : isSystem ? 'border-purple-400 text-purple-400' : 'border-emerald-400 text-emerald-400'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current" />
                        </div>

                        {/* Content Card */}
                        <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-colors">
                          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{item.user}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                isAdmin ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                isSystem ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {isAdmin ? 'Equipe NCodes' : isSystem ? 'Sistema / IA' : 'Cliente'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {item.dateStr || ''} {item.timeStr ? `às ${item.timeStr}` : ''}
                            </span>
                          </div>

                          {item.statusLabel && (
                            <div className="mb-2">
                              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700/60 inline-flex items-center gap-1 font-medium">
                                Status: {item.statusLabel}
                              </span>
                            </div>
                          )}

                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {item.notes}
                          </p>

                          {item.attachments && item.attachments.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-2">
                              {item.attachments.map(att => (
                                <a 
                                  key={att.id} 
                                  href={att.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
                                >
                                  <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>{att.name}</span>
                                  <span className="text-[10px] text-slate-400">({att.size})</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROPOSTA & VALORES */}
          {activeTab === 'proposal' && (
            <div className="space-y-6">
              {!quote.offeredValue ? (
                <div className="p-8 text-center bg-slate-950/40 border border-slate-800/80 rounded-2xl">
                  <Clock className="w-10 h-10 text-cyan-400/80 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-white">Proposta em Análise e Elaboração</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    Nossa equipe de engenharia está finalizando o detalhamento de horas, arquitetura e custos.
                    Assim que concluído, os valores e condições de pagamento ficarão visíveis aqui.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        Proposta Comercial NCodes
                      </span>
                      <h3 className="text-2xl font-extrabold text-white mt-1">
                        R$ {quote.offeredValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Investimento total do projeto
                      </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Prazo Estimado</span>
                        <span className="text-sm font-bold text-slate-200">{quote.offeredDeadline || quote.deadline || 'A combinar'}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-800" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Condição de Pagamento</span>
                        <span className="text-xs font-semibold text-emerald-400">{quote.paymentTerms || 'Consulte suporte'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Escopo do Projeto */}
                  {quote.scopeItems && quote.scopeItems.length > 0 && (
                    <div className="py-5 border-b border-slate-800">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                        Escopo Completo Incluído
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {quote.scopeItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações do Cliente na Proposta */}
                  {(quote.status === 'orcamento_disponivel' || quote.status === 'proposta_enviada' || quote.status === 'em_negociacao') && !isAdminView && (
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                      <button
                        onClick={() => setShowRefuseModal(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-xs border border-red-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Recusar Orçamento
                      </button>

                      <button
                        onClick={() => setShowChangeModal(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold rounded-xl text-xs border border-orange-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Solicitar Alterações
                      </button>

                      <button
                        onClick={() => setShowApproveModal(true)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Aprovar Orçamento
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MENSAGENS E ANEXOS */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Troca de Mensagens Direta do Orçamento
                </h3>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    rows={3}
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Digite sua dúvida, solicitação de ajuste ou observação para a equipe..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors">
                      <Paperclip className="w-4 h-4 text-cyan-400" />
                      <span>Anexar Arquivo</span>
                      <input type="file" onChange={handleFileUploadSimulated} className="hidden" />
                    </label>

                    <button
                      type="submit"
                      disabled={!messageInput.trim() || isSubmitting}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
              </div>

              {/* Anexos Existentes */}
              {quote.attachments && quote.attachments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Arquivos e Documentos Vinculados ({quote.attachments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quote.attachments.map(att => (
                      <div key={att.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-200 truncate">{att.name}</p>
                            <span className="text-[10px] text-slate-400">{att.size} • Por {att.uploadedBy}</span>
                          </div>
                        </div>
                        <a 
                          href={att.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Baixar Arquivo"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DETALHES DO ESCOPO */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Solicitante</span>
                  <p className="text-xs font-bold text-white">{quote.clientName}</p>
                  <p className="text-xs text-slate-400">{quote.company || 'Pessoa Física'}</p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-400" /> {quote.email}</p>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-cyan-400" /> {quote.phone}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Expectativa do Cliente</span>
                  <p className="text-xs text-slate-200"><strong className="text-slate-400">Prazo Desejado:</strong> {quote.deadline}</p>
                  <p className="text-xs text-slate-200"><strong className="text-slate-400">Faixa de Investimento:</strong> {quote.budgetRange}</p>
                  <p className="text-xs text-slate-200"><strong className="text-slate-400">Categoria:</strong> {quote.category || quote.projectType}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Descrição do Projeto</span>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{quote.description}</p>
              </div>

              {quote.aiAnalysis && (
                <div className="p-4 bg-slate-950/80 border border-purple-500/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    Pré-Análise Técnica por IA Gemini
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{quote.aiAnalysis.summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {quote.aiAnalysis.recommendedTech?.map((tech, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* MODAL APPROVE CONFIRMATION */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Confirmar Aprovação do Orçamento?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ao aprovar, o orçamento de <strong className="text-emerald-400">R$ {quote.offeredValue?.toLocaleString('pt-BR')}</strong> será
                convertido em um projeto ativo com contrato vinculado.
              </p>
            </div>

            <div className="space-y-3 bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-left text-xs">
              <span className="font-extrabold text-white text-[11px] block border-b border-slate-800 pb-1 uppercase tracking-wider">
                Definir Vencimentos Manualmente:
              </span>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  📅 Vencimento da Parcela Principal / Entrada *
                </label>
                <input
                  type="date"
                  required
                  value={manualDueDate}
                  onChange={e => setManualDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  📌 Vencimento da Mensalidade (Suporte & Infra)
                </label>
                <input
                  type="text"
                  value={manualMonthlyDueDate}
                  onChange={e => setManualMonthlyDueDate(e.target.value)}
                  placeholder="Ex: Dia 10 de cada mês"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Aprovar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REFUSE CONFIRMATION */}
      {showRefuseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleRefuse} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Recusar Orçamento</h3>
              <p className="text-xs text-slate-400 mt-1">
                Por favor, informe o motivo da recusa (opcional) para usarmos em futuras propostas:
              </p>
            </div>
            <textarea
              rows={3}
              value={refusalReason}
              onChange={e => setRefusalReason(e.target.value)}
              placeholder="Ex: Fora do orçamento atual / Prazo muito longo / Decisão adiada..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-red-400"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowRefuseModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Confirmar Recusa
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL REQUEST CHANGES */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleChangeRequest} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Solicitar Alterações</h3>
              <p className="text-xs text-slate-400 mt-1">
                Descreva os ajustes no valor, escopo ou parcelamento que deseja negociar:
              </p>
            </div>
            <textarea
              rows={4}
              required
              value={changeText}
              onChange={e => setChangeText(e.target.value)}
              placeholder="Ex: Gostaria de retirar o módulo X para adequar ao valor de R$ 20.000 ou estender o parcelamento para 6x..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-400"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!changeText.trim() || isSubmitting}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
              >
                Enviar Solicitação
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
