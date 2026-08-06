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
  Plus, 
  Trash2, 
  ShieldCheck, 
  Briefcase,
  Users,
  Building2,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSignature,
  XCircle,
  Calculator,
  Percent,
  Repeat,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuoteRequest, QuoteStatus, QuoteAttachment, Proposal } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';

interface AdminQuoteManagementModalProps {
  quote: QuoteRequest;
  onClose: () => void;
}

export const AdminQuoteManagementModal: React.FC<AdminQuoteManagementModalProps> = ({ quote, onClose }) => {
  const { 
    updateQuoteStatus, 
    updateQuoteDetails, 
    convertQuoteToProject,
    addQuoteAttachment,
    addQuoteTimelineItem,
    setSelectedQuoteIdForProposal,
    setSelectedProposalIdForAcceptance,
    createProposal,
    proposals,
    setActiveView,
    respondCounterProposal
  } = useApp();

  // Find existing proposal associated with this quote if available
  const existingProposal = proposals.find(p => p.id === quote.proposalId || p.quoteId === quote.id);

  const [activeTab, setActiveTab] = useState<'edit_offer' | 'status' | 'request_info' | 'messages'>('edit_offer');
  const [showClientDetails, setShowClientDetails] = useState(true);

  const isImprovementQuote = Boolean(quote.parentProjectId || quote.quoteType === 'melhoria' || quote.quoteType === 'solicitacao_melhoria' || quote.category === 'melhoria');

  // Proposal Edit Form State
  const [proposalTitle, setProposalTitle] = useState<string>(
    existingProposal?.title || (quote.projectTitle ? `Proposta Comercial - ${quote.projectTitle}` : `Proposta Comercial - ${quote.company || quote.clientName}`)
  );
  const [offeredValue, setOfferedValue] = useState<string>(
    existingProposal ? String(existingProposal.totalValue) : (quote.offeredValue ? String(quote.offeredValue) : (quote.aiAnalysis?.suggestedBudget ? String(quote.aiAnalysis.suggestedBudget) : '18500'))
  );
  const [hasMonthlyFee, setHasMonthlyFee] = useState<boolean>(
    existingProposal?.recurringMonthlyValue && existingProposal.recurringMonthlyValue > 0 ? true : false
  );
  const [recurringMonthlyValue, setRecurringMonthlyValue] = useState<string>(
    existingProposal?.recurringMonthlyValue ? String(existingProposal.recurringMonthlyValue) : '0'
  );
  const [offeredDeadline, setOfferedDeadline] = useState<string>(
    quote.offeredDeadline || quote.deadline || '30 dias úteis'
  );
  const [paymentTerms, setPaymentTerms] = useState<string>(
    existingProposal?.paymentTerms || quote.paymentTerms || '30% entrada no aceite digital + parcelas via Pix/Boleto ou 12x cartão'
  );
  
  // Interactive Payment Conditions Builder State
  const [paymentType, setPaymentType] = useState<'entrada_parcelamento' | 'vista' | 'parcelado_sem_entrada'>(
    existingProposal?.paymentConditions?.paymentType || quote.paymentConditions?.paymentType || 'entrada_parcelamento'
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(
    existingProposal?.paymentConditions?.downPaymentPercent !== undefined
      ? existingProposal.paymentConditions.downPaymentPercent
      : (quote.paymentConditions?.downPaymentPercent !== undefined ? quote.paymentConditions.downPaymentPercent : 30)
  );
  const [installmentsCount, setInstallmentsCount] = useState<number>(
    existingProposal?.paymentConditions?.installmentsCount || quote.paymentConditions?.installmentsCount || 3
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    existingProposal?.paymentConditions?.paymentMethod || quote.paymentConditions?.paymentMethod || 'Pix / Boleto ou Cartão de Crédito'
  );

  const calculateAndApplyPaymentTerms = (
    pType = paymentType, 
    pPercent = downPaymentPercent, 
    pInst = installmentsCount, 
    pMethod = paymentMethod, 
    valStr = offeredValue
  ) => {
    const totalVal = parseFloat(valStr) || 0;
    if (pType === 'vista') {
      setPaymentTerms(`Pagamento Integral à Vista (100% no aceite digital: R$ ${totalVal.toLocaleString('pt-BR')}) via ${pMethod}`);
    } else if (pType === 'parcelado_sem_entrada') {
      const perInst = pInst > 0 ? (totalVal / pInst) : totalVal;
      setPaymentTerms(`Parcelado sem entrada em ${pInst}x de R$ ${perInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${pMethod}`);
    } else {
      const entryVal = (totalVal * pPercent) / 100;
      const remaining = totalVal - entryVal;
      const perInst = pInst > 0 ? (remaining / pInst) : remaining;
      setPaymentTerms(`${pPercent}% de entrada no aceite (R$ ${entryVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) + ${pInst} parcelas mensais de R$ ${perInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${pMethod}`);
    }
  };
  const [assignedTo, setAssignedTo] = useState<string>(quote.assignedTo || 'usr-1');
  
  const [scopeItems, setScopeItems] = useState<string[]>(
    existingProposal?.scope && existingProposal.scope.length > 0
      ? existingProposal.scope
      : (quote.scopeItems && quote.scopeItems.length > 0 
        ? quote.scopeItems 
        : (quote.selectedFeatures && quote.selectedFeatures.length > 0
          ? quote.selectedFeatures
          : [
              'Desenvolvimento do Frontend Responsivo em React / Tailwind',
              'API RESTful / Express com Criptografia de Dados',
              'Painel de Gestão Administrativa e Dashboard',
              'Homologação Técnica e Publicação em Produção'
            ]
          )
        )
  );
  const [newScopeInput, setNewScopeInput] = useState('');
  const [description, setDescription] = useState<string>(
    existingProposal?.description || `Desenvolvimento de ecossistema de software sob medida para a empresa ${quote.company || quote.clientName}. Requisitos: ${quote.description}`
  );
  const [contractText, setContractText] = useState<string>(
    existingProposal?.contractText || `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA

CONTRATADA: NCODES TECHNOLOGIES LTDA, inscrita no CNPJ/MF sob o nº 00.000.000/0001-00.
CONTRATANTE: ${quote.company || quote.clientName}, representado por ${quote.clientName}.

1. OBJETO: A CONTRATADA compromete-se a desenvolver o projeto ${proposalTitle} de acordo com o escopo e especificações aprovadas neste instrumento.
2. VALOR E CONDIÇÕES DE PAGAMENTO: O valor total do projeto é ajustado conforme valores especificados nesta proposta comercial.
3. DIREITOS E PROPRIEDADE INTELECTUAL: Após a quitação integral dos valores contratados, a totalidade do código-fonte e licenças proprietárias serão cedidas ao CONTRATANTE.
4. VALIDADE JURÍDICA E ACEITE DIGITAL: A assinatura deste contrato é realizada por meio de aceite digital, validada eletronicamente via endereço IP, timestamp UTC e hash criptográfico SHA-256 do dispositivo.`
  );

  // Status Change Form State
  const [newStatus, setNewStatus] = useState<QuoteStatus>(quote.status);
  const [statusNote, setStatusNote] = useState('');

  // Request Info State
  const [requestInfoText, setRequestInfoText] = useState('');

  // Message / Chat State
  const [adminMessageText, setAdminMessageText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedPropId, setGeneratedPropId] = useState<string | null>(existingProposal?.id || quote.proposalId || null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddScopeItem = () => {
    if (newScopeInput.trim()) {
      setScopeItems(prev => [...prev, newScopeInput.trim()]);
      setNewScopeInput('');
    }
  };

  const handleRemoveScopeItem = (index: number) => {
    setScopeItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestScopeFromFeatures = () => {
    const suggested = [
      'Modelagem da Arquitetura de Banco de Dados e Backend High-Availability',
      'Painel de Gestão Administrativa com Controle de Permissões',
      'Integração de Notificações Push e Comunicação em Tempo Real',
      'Auditoria de Segurança, Testes de Carga e Homologação Final'
    ];
    if (quote.selectedFeatures && quote.selectedFeatures.length > 0) {
      setScopeItems([...quote.selectedFeatures, ...suggested]);
    } else {
      setScopeItems(suggested);
    }
  };

  const handleSaveAndGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const assignedMember = TEAM_MEMBERS.find(m => m.id === assignedTo);
    const numericValue = offeredValue ? parseFloat(offeredValue) : (quote.aiAnalysis?.suggestedBudget || 18500);
    const numericMonthly = hasMonthlyFee ? (recurringMonthlyValue ? parseFloat(recurringMonthlyValue) : 0) : 0;

    const currentPayConditions = {
      paymentType,
      downPaymentPercent: paymentType === 'entrada_parcelamento' ? downPaymentPercent : (paymentType === 'vista' ? 100 : 0),
      installmentsCount: paymentType !== 'vista' ? installmentsCount : 1,
      paymentMethod
    };

    // 1. Update quote details in system
    await updateQuoteDetails(
      quote.id,
      {
        offeredValue: numericValue,
        offeredDeadline,
        paymentTerms,
        paymentConditions: currentPayConditions,
        assignedTo,
        assignedToName: assignedMember ? assignedMember.name : 'Engenheiro NCodes',
        assignedToRole: assignedMember ? assignedMember.role : 'admin',
        scopeItems,
        status: 'orcamento_disponivel'
      },
      'Proposta comercial elaborada e liberada para o cliente.'
    );

    // 2. Generate or Update Digital Proposal
    const newProposal = createProposal({
      quoteId: quote.id,
      title: proposalTitle,
      clientName: quote.clientName,
      company: quote.company || 'Pessoa Física',
      description,
      scope: scopeItems,
      schedule: [
        { phase: 'Fase 1 - Arquitetura, UX/UI & Especificação Técnica', duration: '10 dias', deliverable: 'Protótipo navegável Figma + especificação técnica' },
        { phase: 'Fase 2 - Desenvolvimento Core & Módulos Principais', duration: '20 dias', deliverable: 'Build de testes com autenticação e banco de dados' },
        { phase: 'Fase 3 - Painel Administrativo & Integrações', duration: '15 dias', deliverable: 'Sincronização em tempo real e relatórios' },
        { phase: 'Fase 4 - Homologação, Treinamento & Publicação Lojas', duration: '10 dias', deliverable: 'Lançamento oficial em produção + documentação' }
      ],
      totalValue: numericValue,
      recurringMonthlyValue: numericMonthly,
      paymentTerms,
      paymentConditions: currentPayConditions,
      contractText
    });

    setGeneratedPropId(newProposal.id);
    setIsSubmitting(false);
    setSuccessMsg(`Proposta ${newProposal.id} gerada com sucesso! Link e documento PDF disponíveis para envio e assinatura.`);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateQuoteStatus(quote.id, newStatus, statusNote.trim());
    setIsSubmitting(false);
    setSuccessMsg(`Status alterado para ${newStatus}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSendInfoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestInfoText.trim()) return;
    setIsSubmitting(true);
    await updateQuoteStatus(quote.id, 'aguardando_informacoes', requestInfoText.trim());
    setRequestInfoText('');
    setIsSubmitting(false);
    setSuccessMsg('Solicitação de informações enviada ao cliente!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessageText.trim()) return;
    setIsSubmitting(true);
    await addQuoteTimelineItem(quote.id, adminMessageText.trim(), 'Engenharia NCodes', 'admin');
    setAdminMessageText('');
    setIsSubmitting(false);
  };

  const handleConvertToProject = async () => {
    if (confirm(`Deseja converter o orçamento #${quote.id} em um Projeto ativo?`)) {
      setIsSubmitting(true);
      const prjId = await convertQuoteToProject(quote.id);
      setIsSubmitting(false);
      if (prjId) {
        alert(`Projeto #${prjId} criado com sucesso!`);
        onClose();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      await addQuoteAttachment(quote.id, {
        name: file.name,
        size: sizeMB,
        type: file.type || 'application/pdf',
        uploadedBy: 'Equipe NCodes',
        uploadedRole: 'admin',
        url: '#'
      });
      setSuccessMsg(`Anexo ${file.name} vinculado!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleOpenProposalPdfView = () => {
    const targetPropId = generatedPropId || quote.proposalId || existingProposal?.id;
    if (targetPropId) {
      setSelectedProposalIdForAcceptance(targetPropId);
      setActiveView('proposal_accept');
      onClose();
    } else {
      alert('Por gentileza, salve a proposta primeiro para gerar a versão PDF.');
    }
  };

  const handleCopyProposalLink = () => {
    const targetPropId = generatedPropId || quote.proposalId || existingProposal?.id;
    if (targetPropId) {
      const link = `${window.location.origin}?view=proposal_accept&id=${targetPropId}`;
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200 my-auto">
        
        {/* HEADER */}
        <div className="p-5 md:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                {quote.id}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                Cliente: <strong className="text-white">{quote.clientName}</strong> ({quote.company || 'Pessoa Física'})
              </span>
              {quote.proposalId && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Proposta Emitida: {quote.proposalId}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Gerenciar Orçamento: {quote.projectTitle || quote.projectType}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConvertToProject}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Converter em Projeto</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {successMsg && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 p-3.5 px-6 text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            {(generatedPropId || quote.proposalId) && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenProposalPdfView}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Abrir / Imprimir PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyProposalLink}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* MAIN BODY AREA */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-6">

          {/* SECTION 1: SOLICITAÇÃO COMPLETA DO CLIENTE (O QUE FOI SOLICITADO) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>O que foi Solicitado pelo Cliente</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {quote.projectType || 'Projeto Sob Medida'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Acesse abaixo a íntegra dos requisitos, descrição e estimativas enviadas na solicitação de orçamento
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClientDetails(!showClientDetails)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                {showClientDetails ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Ocultar Detalhes</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Ver Solicitação Completa</span>
                  </>
                )}
              </button>
            </div>

            {showClientDetails && (
              <div className="space-y-4 text-xs animate-in fade-in duration-150">
                
                {/* Contato e Localização */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Cliente</span>
                    <span className="text-slate-200 font-bold">{quote.clientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Empresa</span>
                    <span className="text-slate-200 font-semibold">{quote.company || 'Pessoa Física'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">WhatsApp / Contato</span>
                    <a 
                      href={`https://wa.me/55${quote.whatsapp?.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {quote.whatsapp || quote.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Localidade / E-mail</span>
                    <span className="text-slate-300 truncate block">{quote.city}-{quote.state} | {quote.email}</span>
                  </div>
                </div>

                {/* Descrição dos Requisitos */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5 text-xs">
                    📌 Descrição dos Requisitos do Projeto:
                  </span>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {quote.description}
                  </div>
                </div>

                {/* Funcionalidades Selecionadas e Prazos/Orçamento Desejados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quote.selectedFeatures && quote.selectedFeatures.length > 0 && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-slate-400 font-bold block text-[11px]">Funcionalidades Solicitadas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {quote.selectedFeatures.map((feat, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-medium">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold block text-[11px]">Expectativa do Cliente:</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Prazo Solicitado:</span>
                        <strong className="text-cyan-400">{quote.deadline}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Faixa de Orçamento:</span>
                        <strong className="text-emerald-400">{quote.budgetRange}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referências e Links */}
                {quote.references && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold block text-[11px]">🔗 Referências / Links de Inspiração:</span>
                    <p className="text-slate-300 whitespace-pre-wrap break-all">{quote.references}</p>
                  </div>
                )}

                {/* Análise de Engenharia Gemini AI */}
                {quote.aiAnalysis && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/50 space-y-2">
                    <div className="flex items-center justify-between text-blue-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        Análise de Engenharia Gemini AI
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-[10px] text-blue-200 uppercase font-bold">
                        Complexidade: {quote.aiAnalysis.complexity}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{quote.aiAnalysis.summary}</p>
                    <div className="flex flex-wrap items-center justify-between pt-2 text-[11px] border-t border-blue-900/60 font-semibold">
                      <span className="text-slate-400">Horas Estimadas: <strong className="text-white">{quote.aiAnalysis.estimatedHours}h</strong></span>
                      <span className="text-emerald-400">Sugestão de Investimento: <strong>R$ {quote.aiAnalysis.suggestedBudget?.toLocaleString('pt-BR')}</strong></span>
                    </div>
                  </div>
                )}

                {/* Anexos enviados pelo cliente */}
                {quote.attachments && quote.attachments.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block text-[11px]">Anexos Enviados pelo Cliente:</span>
                    <div className="flex flex-wrap gap-2">
                      {quote.attachments.map((att, idx) => (
                        <a 
                          key={idx} 
                          href={att.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-2.5 py-1 rounded bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-slate-700 flex items-center gap-1 text-[11px]"
                        >
                          <Paperclip className="w-3 h-3" />
                          {att.name} ({att.size})
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* SECTION 2: NAV TABS FOR ACTION */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 rounded-t-2xl px-4 gap-2 pt-2">
            {[
              { id: 'edit_offer', label: 'Elaborar Proposta Comercial & PDF', icon: FileSignature },
              { id: 'status', label: 'Alterar Status & E-mail', icon: Clock },
              { id: 'request_info', label: 'Solicitar Informações', icon: AlertTriangle },
              { id: 'messages', label: 'Mensagens & Linha do Tempo', icon: MessageSquare }
            ].map(tab => {
              const IconC = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    isActive 
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IconC className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: ELABORAR PROPOSTA COMERCIAL & PDF */}
          {activeTab === 'edit_offer' && (
            <form onSubmit={handleSaveAndGenerateProposal} className="space-y-5 bg-slate-900/80 p-5 rounded-b-2xl border border-t-0 border-slate-800">
              
              {/* Counter-Proposal Pending Banner */}
              {(() => {
                const counterProp = quote.counterProposal || existingProposal?.counterProposal;
                if (!counterProp || counterProp.status !== 'pendente') return null;

                return (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
                        <Clock className="w-4.5 h-4.5" />
                        <span>Contraproposta do Cliente Recebida!</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        Aguardando Análise
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Valor Original</span>
                        <span className="font-bold text-slate-300">R$ {Number(offeredValue).toLocaleString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-amber-400 block text-[10px] uppercase font-bold">Valor Proposto pelo Cliente</span>
                        <span className="font-black text-amber-300 text-sm">R$ {counterProp.proposedTotalValue.toLocaleString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Condição Solicitada</span>
                        <span className="font-bold text-slate-200">
                          {counterProp.proposedPaymentType === 'vista'
                            ? '100% à vista'
                            : counterProp.proposedPaymentType === 'parcelado_sem_entrada'
                            ? `Parcelado sem entrada (${counterProp.proposedInstallmentsCount || 3}x)`
                            : `Entrada ${counterProp.proposedDownPaymentPercent || 30}% + ${counterProp.proposedInstallmentsCount || 3}x`
                          }
                        </span>
                      </div>
                    </div>

                    {counterProp.notes && (
                      <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 italic">
                        "{counterProp.notes}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setOfferedValue(String(counterProp.proposedTotalValue));
                          await respondCounterProposal(quote.id, 'accept', 'Contraproposta aceita conforme solicitado pelo cliente.');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aceitar Contraproposta (R$ {counterProp.proposedTotalValue.toLocaleString('pt-BR')})</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const reason = prompt('Informe a justificativa/motivo para recusar a contraproposta:') || 'Condições do escopo mantidas conforme proposta original.';
                          await respondCounterProposal(quote.id, 'reject', reason);
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Recusar / Manter Proposta Original</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-cyan-400" />
                    Preencha as Informações da Proposta para o PDF e Aceite Digital
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina valores, itens do escopo, formas de pagamento e prazos. As informações serão formatadas no documento oficial em PDF.
                  </p>
                </div>

                {(generatedPropId || quote.proposalId) && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenProposalPdfView}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Visualizar Proposta em PDF</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Título da Proposta Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={proposalTitle}
                  onChange={e => setProposalTitle(e.target.value)}
                  placeholder="Ex: Proposta Comercial - Sistema de Gestão Web"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Valor Total do Projeto (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={offeredValue}
                      onChange={e => setOfferedValue(e.target.value)}
                      placeholder="18500.00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 p-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isImprovementQuote ? 'Haverá Aumento de Mensalidade para este Cliente?' : 'Cobrança de Mensalidade Recorrente?'}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {isImprovementQuote
                          ? 'Melhorias não possuem mensalidade própria por padrão. Ative apenas se houver reajuste/aumento na mensalidade do cliente.'
                          : 'Define se o contrato prevê taxa mensal recorrente de suporte, servidor e infraestrutura.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setHasMonthlyFee(false);
                          setRecurringMonthlyValue('0');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !hasMonthlyFee ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Não (Sem Mensalidade)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHasMonthlyFee(true);
                          if (!recurringMonthlyValue || parseFloat(recurringMonthlyValue) === 0) {
                            setRecurringMonthlyValue('200');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          hasMonthlyFee ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Sim (Informar Valor)
                      </button>
                    </div>
                  </div>

                  {hasMonthlyFee && (
                    <div className="pt-2 animate-in fade-in duration-150">
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isImprovementQuote ? 'Valor do Aumento na Mensalidade (R$/mês)' : 'Valor da Mensalidade Recorrente (R$/mês)'}
                      </label>
                      <div className="relative max-w-xs">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={recurringMonthlyValue}
                          onChange={e => setRecurringMonthlyValue(e.target.value)}
                          placeholder="200.00"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 p-2.5 text-xs font-bold text-cyan-400 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Prazo Estimado de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={offeredDeadline}
                    onChange={e => setOfferedDeadline(e.target.value)}
                    placeholder="Ex: 30 dias úteis"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Interactive Payment Conditions Builder */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Configurador de Condições de Pagamento</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Flexibilidade para o orçamento</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Modelo de Cobrança
                    </label>
                    <select
                      value={paymentType}
                      onChange={e => {
                        const newType = e.target.value as any;
                        setPaymentType(newType);
                        calculateAndApplyPaymentTerms(newType, downPaymentPercent, installmentsCount, paymentMethod, offeredValue);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
                    >
                      <option value="entrada_parcelamento">Entrada + Parcelas (Padrão)</option>
                      <option value="vista">Pagamento Integral à Vista (100%)</option>
                      <option value="parcelado_sem_entrada">Parcelado Sem Entrada</option>
                    </select>
                  </div>

                  {paymentType === 'entrada_parcelamento' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        % da Entrada (Sinal)
                      </label>
                      <select
                        value={downPaymentPercent}
                        onChange={e => {
                          const newPercent = Number(e.target.value);
                          setDownPaymentPercent(newPercent);
                          calculateAndApplyPaymentTerms(paymentType, newPercent, installmentsCount, paymentMethod, offeredValue);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-emerald-400 focus:outline-none focus:border-cyan-400 font-bold"
                      >
                        <option value={10}>10% de Entrada</option>
                        <option value={20}>20% de Entrada</option>
                        <option value={30}>30% de Entrada (Recomendado)</option>
                        <option value={40}>40% de Entrada</option>
                        <option value={50}>50% de Entrada</option>
                        <option value={0}>Sem Entrada (0%)</option>
                      </select>
                    </div>
                  )}

                  {paymentType !== 'vista' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Parcelas do Saldo
                      </label>
                      <select
                        value={installmentsCount}
                        onChange={e => {
                          const newInst = Number(e.target.value);
                          setInstallmentsCount(newInst);
                          calculateAndApplyPaymentTerms(paymentType, downPaymentPercent, newInst, paymentMethod, offeredValue);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-400 font-bold"
                      >
                        <option value={1}>1x (À Vista no término)</option>
                        <option value={2}>2 parcelas mensais</option>
                        <option value={3}>3 parcelas mensais</option>
                        <option value={4}>4 parcelas mensais</option>
                        <option value={5}>5 parcelas mensais</option>
                        <option value={6}>6 parcelas mensais</option>
                        <option value={10}>10 parcelas mensais</option>
                        <option value={12}>12 parcelas no Cartão</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Meio de Pagamento
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={e => {
                        const newMethod = e.target.value;
                        setPaymentMethod(newMethod);
                        calculateAndApplyPaymentTerms(paymentType, downPaymentPercent, installmentsCount, newMethod, offeredValue);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
                    >
                      <option value="Pix Copia e Cola / Chave CNPJ">Pix (Desconto Instantâneo)</option>
                      <option value="Pix / Boleto Bancário">Pix / Boleto Bancário</option>
                      <option value="Cartão de Crédito em até 12x">Cartão de Crédito (até 12x)</option>
                      <option value="Pix, Boleto ou Cartão de Crédito">Todas as Formas (Pix/Boleto/Cartão)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Texto Descritivo das Condições de Pagamento (Formato Final no PDF / Proposta) *
                    </label>
                    <button
                      type="button"
                      onClick={() => calculateAndApplyPaymentTerms()}
                      className="text-[10px] text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Recalcular Texto</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    placeholder="Ex: 30% entrada no aceite digital + 3 parcelas mensais via Pix"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-emerald-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Engenheiro / Atendimento Responsável
                </label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {TEAM_MEMBERS.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Itens do Escopo e Entregáveis Inclusos (Aparecem no PDF)
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestScopeFromFeatures}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Sugerir Escopo com Base nos Requisitos
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {scopeItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScopeItem(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newScopeInput}
                    onChange={e => setNewScopeInput(e.target.value)}
                    placeholder="Digitar e adicionar novo item de entrega..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddScopeItem}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Executive Overview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Resumo e Detalhes do Escopo da Proposta
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Contract Terms */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Cláusulas e Termos do Contrato (Aceite Digital)
                </label>
                <textarea
                  rows={4}
                  value={contractText}
                  onChange={e => setContractText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 font-sans focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer border border-slate-700 transition-colors flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  Anexar PDF Adicional ao Orçamento
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Salvar e Gerar Proposta Digital / PDF</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* TAB 2: ALTERAR STATUS & E-MAIL */}
          {activeTab === 'status' && (
            <form onSubmit={handleUpdateStatus} className="space-y-5 bg-slate-900/80 p-5 rounded-b-2xl border border-t-0 border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Selecione o Novo Status do Orçamento
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as QuoteStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="solicitado">🟡 Solicitação Enviada (Recebido)</option>
                  <option value="em_analise">🔵 Em Análise Técnica</option>
                  <option value="aguardando_informacoes">🟠 Aguardando Informações do Cliente</option>
                  <option value="orcamento_disponivel">🟢 Orçamento Disponível (Liberado)</option>
                  <option value="em_negociacao">🟣 Em Negociação</option>
                  <option value="aprovado">✅ Aprovado / Em Execução</option>
                  <option value="recusado">❌ Recusado</option>
                  <option value="cancelado">⚪ Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Observação do Status (Enviada no chat direto e salva na linha do tempo)
                </label>
                <textarea
                  rows={4}
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="Ex: Análise finalizada. Valores e escopo liberados para aprovação no portal..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Atualizar Status e Notificar Cliente
              </button>
            </form>
          )}

          {/* TAB 3: SOLICITAR INFORMAÇÕES */}
          {activeTab === 'request_info' && (
            <form onSubmit={handleSendInfoRequest} className="space-y-4 bg-slate-900/80 p-5 rounded-b-2xl border border-t-0 border-slate-800">
              <div className="p-4 bg-orange-950/30 border border-orange-500/30 rounded-xl text-orange-200 text-xs">
                <AlertTriangle className="w-5 h-5 text-orange-400 mb-1" />
                <p>Ao enviar uma dúvida ou solicitar informações complementares, o status do orçamento será alterado para <strong className="text-orange-300">"Aguardando Informações"</strong> e o cliente receberá um aviso no portal.</p>
              </div>

              <textarea
                rows={4}
                required
                value={requestInfoText}
                onChange={e => setRequestInfoText(e.target.value)}
                placeholder="Ex: Por gentileza, informe qual gateway de pagamentos ou API vocês utilizam atualmente..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-400"
              />

              <button
                type="submit"
                disabled={!requestInfoText.trim() || isSubmitting}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Enviar Solicitação ao Cliente
              </button>
            </form>
          )}

          {/* TAB 4: MENSAGENS E LINHA DO TEMPO */}
          {activeTab === 'messages' && (
            <div className="space-y-6 bg-slate-900/80 p-5 rounded-b-2xl border border-t-0 border-slate-800">
              
              {(generatedPropId || quote.proposalId || existingProposal) && (
                <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Proposta Comercial em PDF e Aceite Digital
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Proposta ID: <strong>{generatedPropId || quote.proposalId || existingProposal?.id}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenProposalPdfView}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      Abrir PDF / Aceite Digital
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendAdminMessage} className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  Adicionar Nota Interna na Linha do Tempo
                </label>
                <textarea
                  rows={3}
                  value={adminMessageText}
                  onChange={e => setAdminMessageText(e.target.value)}
                  placeholder="Registrar mensagem técnica ou instrução no histórico..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!adminMessageText.trim() || isSubmitting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Registrar Nota
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
