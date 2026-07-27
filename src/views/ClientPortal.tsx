import React, { useState } from 'react';
import { 
  FolderGit2, 
  DollarSign, 
  MessageSquare, 
  LifeBuoy, 
  Download, 
  CheckCircle2, 
  Send, 
  Clock, 
  FileText, 
  Paperclip, 
  Mic, 
  ShieldCheck, 
  QrCode, 
  Copy,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileCheck,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Bot,
  Repeat,
  Check,
  History,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuoteTrackerModal } from '../components/QuoteTrackerModal';
import { QuoteRequest } from '../types';
import { DEFAULT_QUOTE_CATEGORIES, DEFAULT_QUOTE_FEATURES } from '../data/initialData';

export const ClientPortal: React.FC = () => {
  const { 
    quotes,
    proposals,
    projects, 
    financials, 
    subscriptions,
    chatMessages, 
    tickets, 
    sendChatMessage, 
    createSupportTicket, 
    createQuoteRequest,
    currentClientUser,
    logoutClient,
    setSelectedProposalIdForAcceptance,
    setActiveView,
    siteConfig
  } = useApp();

  const clientQuoteCategories = (
    siteConfig?.quoteCategories && siteConfig.quoteCategories.length > 0
      ? siteConfig.quoteCategories
      : DEFAULT_QUOTE_CATEGORIES
  ).filter(cat => !cat.hidden);

  const clientQuoteFeatures = (
    siteConfig?.quoteFeatures && siteConfig.quoteFeatures.length > 0
      ? siteConfig.quoteFeatures
      : DEFAULT_QUOTE_FEATURES
  ).filter(feat => !feat.hidden);

  const [activeTab, setActiveTab] = useState<'quotes' | 'projects' | 'financials' | 'chat' | 'tickets'>('quotes');
  
  // Quote Tracker Modal State
  const [selectedQuoteForTracker, setSelectedQuoteForTracker] = useState<QuoteRequest | null>(null);

  // Comprehensive Quote Request State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('Site com Sistema de Gestão');
  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  const [references, setReferences] = useState('');
  const [deadline, setDeadline] = useState('Até 30 dias');
  const [budgetRange, setBudgetRange] = useState('R$ 8.000 a R$ 15.000');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  // Applicant contact details state
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleOpenQuoteModal = () => {
    if (currentClientUser) {
      setClientName(currentClientUser.name || '');
      setCompany(currentClientUser.company || '');
      setEmail(currentClientUser.email || '');
      setPhone(currentClientUser.phone || '');
      setWhatsapp(currentClientUser.phone || '');
      setCity(currentClientUser.city || '');
      setState(currentClientUser.state || '');
    }
    setShowQuoteModal(true);
  };

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(prev => prev.filter(f => f !== feat));
    } else {
      setSelectedFeatures(prev => [...prev, feat]);
    }
  };

  const addCustomFeature = () => {
    if (!customFeature.trim()) return;
    const feat = customFeature.trim();
    if (!selectedFeatures.includes(feat)) {
      setSelectedFeatures(prev => [...prev, feat]);
    }
    setCustomFeature('');
  };

  const removeFeature = (featToRemove: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== featToRemove));
  };

  // Chat input
  const [chatInput, setChatInput] = useState('');
  
  // Support ticket input
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Suporte Técnico');
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Pix modal
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Filter client's quotes if email matches, or display all client quotes
  const clientEmail = (currentClientUser?.email || '').trim().toLowerCase();
  const clientNameKey = (currentClientUser?.name || '').trim().toLowerCase();
  const clientCompany = (currentClientUser?.company || '').trim().toLowerCase();
  const firstName = clientNameKey.split(' ')[0] || '';

  const myQuotes = quotes.filter(q => {
    if (!currentClientUser) return true;
    const qEmail = (q.email || '').trim().toLowerCase();
    const qClientName = (q.clientName || '').trim().toLowerCase();
    const qCompany = (q.company || '').trim().toLowerCase();

    return (
      (clientEmail && qEmail === clientEmail) ||
      (clientNameKey && qClientName && (qClientName.includes(clientNameKey) || clientNameKey.includes(qClientName))) ||
      (firstName && qClientName && qClientName.includes(firstName)) ||
      (clientCompany && qCompany && qCompany.includes(clientCompany))
    );
  });

  const myProjects = projects.filter(p => {
    if (!currentClientUser) return true;
    const pClient = (p.clientName || '').toLowerCase();
    const firstName = clientNameKey.split(' ')[0] || '';
    return (
      (firstName && pClient.includes(firstName)) ||
      (clientCompany && pClient.includes(clientCompany))
    );
  });
  const activeProject = myProjects[0] || projects[0];

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingQuote(true);

    const fullDescription = [
      projectTitle ? `📌 Título do Projeto: ${projectTitle}` : '',
      description ? `📝 Descrição Detalhada:\n${description}` : '',
      selectedFeatures.length > 0 ? `⚡ Funcionalidades Desejadas:\n- ${selectedFeatures.join('\n- ')}` : '',
      references ? `🔗 Referências e Links:\n${references}` : '',
      additionalNotes ? `💬 Informações Adicionais:\n${additionalNotes}` : ''
    ].filter(Boolean).join('\n\n');

    await createQuoteRequest({
      clientName: clientName || currentClientUser?.name || 'Cliente NCodes',
      company: company || currentClientUser?.company || 'Pessoa Física',
      email: email || currentClientUser?.email || '',
      phone: phone || whatsapp || currentClientUser?.phone || '(11) 99999-8888',
      whatsapp: whatsapp || phone || currentClientUser?.phone || '(11) 99999-8888',
      city: city || currentClientUser?.city || 'São Paulo',
      state: state || currentClientUser?.state || 'SP',
      projectType: category,
      projectTitle: projectTitle || 'Novo Projeto Web/Sistema',
      category: category,
      selectedFeatures,
      references,
      additionalNotes,
      description: fullDescription || description,
      deadline,
      budgetRange
    });

    setIsCreatingQuote(false);
    setShowQuoteModal(false);

    // Reset Form
    setProjectTitle('');
    setDescription('');
    setSelectedFeatures([]);
    setCustomFeature('');
    setReferences('');
    setAdditionalNotes('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketTitle.trim()) {
      createSupportTicket(ticketTitle.trim(), ticketCategory, 'media');
      setTicketTitle('');
      setShowTicketModal(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136ncodes-tech-chave-pix-copia-e-cola-998852040001995204000053039865405285005802BR5925NCODES TECHNOLOGIES LTDA6009SAO PAULO62070503***6304E2D1');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const projectTypeOptions = [
    'Aplicativo Mobile iOS + Painel Web',
    'Desenvolvimento de Site Institucional / Portal',
    'Sistema Web Empresarial (ERP / SaaS / CRM)',
    'Landing Page de Alta Conversão',
    'Inteligência Artificial & Agentes / Gemini',
    'APIs & Integrações de Sistemas / Pix',
    'Sistema Personalizado Sob Medida'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Standalone Top Bar for Client Portal */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white py-3.5 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('home')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Voltar para o site institucional"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao Site</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                NC
              </div>
              <div>
                <h1 className="text-sm font-extrabold leading-none text-white">Portal do Cliente NCodes</h1>
                <p className="text-[10px] text-blue-400 font-bold mt-0.5">Ambiente de Soluções & Orçamentos</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Logged in user info badge */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                {currentClientUser?.name.charAt(0) || 'C'}
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-extrabold text-white">{currentClientUser?.name || 'Cliente'}</p>
                <p className="text-[10px] text-slate-400">{currentClientUser?.company || 'Pessoa Física'}</p>
              </div>
            </div>

            <button
              onClick={logoutClient}
              className="py-2 px-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Portal Content Area */}
      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner & Navigation Tabs */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Painel do Cliente • Sincronizado em Tempo Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, {currentClientUser?.name.split(' ')[0] || 'Cliente'}!
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Solicite novos orçamentos com análise inteligente por IA, acompanhe o progresso de desenvolvimento dos seus projetos e mantenha contato com a engenharia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'quotes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Orçamentos ({myQuotes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projetos</span>
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'financials' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financeiro</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Direto</span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Chamados ({tickets.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MEUS ORÇAMENTOS E SOLICITAÇÕES */}
        {activeTab === 'quotes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header & New Quote Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Minhas Solicitações de Orçamento</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-bold">
                    {myQuotes.length} registradas
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Crie novos pedidos de orçamento, acompanhe a análise da equipe e assine as propostas enviadas.
                </p>
              </div>

              <button
                onClick={handleOpenQuoteModal}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nova Solicitação de Orçamento</span>
              </button>
            </div>

            {/* List of Quotes */}
            {myQuotes.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
                <FileCheck className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Nenhum Orçamento Encontrado</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Você ainda não fez nenhuma solicitação de orçamento. Clique no botão acima para descrever seu projeto e receber uma proposta personalizada!
                  </p>
                </div>
                <button
                  onClick={handleOpenQuoteModal}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer hover:bg-blue-500"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Criar Primeiro Orçamento</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myQuotes.map(quote => {
                  const associatedProp = proposals.find(p => p.quoteId === quote.id || p.id === quote.proposalId);
                  const isPendingInfo = quote.status === 'aguardando_informacoes';

                  return (
                    <div 
                      key={quote.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4 transition-all hover:border-blue-500/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{quote.id}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-semibold text-slate-500">{new Date(quote.createdAt).toLocaleDateString('pt-BR')}</span>
                            {quote.assignedToName && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                  Resp: {quote.assignedToName}
                                </span>
                              </>
                            )}
                          </div>
                          <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {quote.projectTitle || quote.projectType || `Solicitação #${quote.id}`}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase flex items-center gap-1.5 ${
                            quote.status === 'aprovado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            quote.status === 'orcamento_disponivel' || quote.status === 'proposta_enviada' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            quote.status === 'aguardando_informacoes' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 animate-pulse' :
                            quote.status === 'em_analise' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                            quote.status === 'recusado' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            <span className="w-2 h-2 rounded-full bg-current" />
                            {quote.status === 'solicitado' ? 'Solicitação Enviada' :
                             quote.status === 'em_analise' ? 'Em Análise Técnica' :
                             quote.status === 'aguardando_informacoes' ? 'Aguardando Informações' :
                             quote.status === 'orcamento_disponivel' ? 'Orçamento Disponível' :
                             (quote.status || '').replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Pending Info Alert */}
                      {isPendingInfo && (
                        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-3 text-xs text-orange-300">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                            <span>A equipe solicitou dados adicionais para concluir o orçamento.</span>
                          </div>
                          <button
                            onClick={() => setSelectedQuoteForTracker(quote)}
                            className="px-3 py-1 bg-orange-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-orange-400 shrink-0"
                          >
                            Responder
                          </button>
                        </div>
                      )}

                      <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <strong className="block text-slate-900 dark:text-white mb-1">Descrição do Projeto:</strong>
                        {quote.description}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Prazo Estimado</span>
                          <span className="font-bold text-slate-900 dark:text-white">{quote.offeredDeadline || quote.deadline}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Valor Oferecido / Faixa</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {quote.offeredValue ? `R$ ${quote.offeredValue.toLocaleString('pt-BR')}` : quote.budgetRange}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Última Atualização</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {quote.updatedAt ? new Date(quote.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Recente'}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                          <button
                            onClick={() => setSelectedQuoteForTracker(quote)}
                            className="w-full h-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>Ver Linha do Tempo</span>
                          </button>
                        </div>
                      </div>

                      {/* AI Analysis section if available */}
                      {quote.aiAnalysis && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 border border-blue-500/20 text-xs space-y-2">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-500" />
                            <strong className="text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider text-[11px]">
                              Análise Preliminar por IA
                            </strong>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {typeof quote.aiAnalysis === 'string'
                              ? quote.aiAnalysis
                              : (quote.aiAnalysis.summary || JSON.stringify(quote.aiAnalysis))}
                          </p>
                          {typeof quote.aiAnalysis === 'object' && quote.aiAnalysis.recommendedTech && Array.isArray(quote.aiAnalysis.recommendedTech) && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {quote.aiAnalysis.recommendedTech.map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Proposal Link Action */}
                      {quote.proposalId && associatedProp && (
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Proposta Digital Disponível!</h5>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                                Valor Total: <strong>R$ {associatedProp.totalValue.toLocaleString('pt-BR')}</strong> em {associatedProp.installmentsCount}x.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedProposalIdForAcceptance(quote.proposalId);
                              setActiveView('proposal_accept');
                            }}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Visualizar & Assinar Proposta</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ACTIVE PROJECTS & TIMELINE */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {activeProject ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{activeProject.id} • {activeProject.category}</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeProject.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {(activeProject.status || '').replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Progresso Geral de Desenvolvimento:</span>
                    <span className="text-blue-600 dark:text-blue-400">{activeProject.progressPercentage}% concluído</span>
                  </div>
                  <div className="w-full h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500" 
                      style={{ width: `${activeProject.progressPercentage}%` }} 
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Etapas & Atividades do Cronograma:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeProject.tasks || []).map(t => (
                      <div key={t.id} className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
                        t.completed 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300' 
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span className={t.completed ? 'line-through' : ''}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Repository */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Documentos & Arquivos do Projeto:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeProject.files || []).map(f => (
                      <div key={f.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white truncate">{f.name}</span>
                        </div>
                        <button className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 cursor-pointer">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Nenhum Projeto Ativo no Momento</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Assim que sua proposta de orçamento for aprovada, seu projeto será iniciado e visualizado aqui.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FINANCIAL STATEMENT & SUBSCRIPTIONS */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Active Subscriptions / Monthly Fees Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                    <Repeat className="w-4 h-4 text-emerald-500" />
                    <span>Meus Planos & Mensalidades Contratadas</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Assinaturas e Serviços Recorrentes</h3>
                  <p className="text-xs text-slate-500 mt-1">Acompanhe seus contratos de sustentação, manutenção contínua e licenças ativas.</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Recorrente</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    R$ {subscriptions.filter(s => s.status === 'ativo').reduce((acc, curr) => acc + curr.monthlyValue, 0).toLocaleString('pt-BR')}/mês
                  </span>
                </div>
              </div>

              {subscriptions.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">Nenhum plano mensal atrelado à sua conta no momento.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Contrato de Serviço</span>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{sub.serviceName}</h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                          sub.status === 'ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          sub.status === 'inadimplente' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {sub.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Valor Mensal</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">R$ {sub.monthlyValue.toLocaleString('pt-BR')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Vencimento</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">Todo Dia {sub.billingCycleDay}</span>
                        </div>
                      </div>

                      {sub.pixCopyPaste && (
                        <div className="pt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400">Próx: <strong>{sub.nextDueDate}</strong></span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(sub.pixCopyPaste || '');
                              setPixCopied(true);
                              setTimeout(() => setPixCopied(false), 2500);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>{pixCopied ? 'Pix Copiado!' : 'Copiar Pix Mês'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Transactions & Invoices List */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Extrato Financeiro & Cobranças Pix</h3>
                  <p className="text-xs text-slate-500 mt-1">Consulte parcelas ativas, acerte pendências via Pix e baixe recibos de quitação.</p>
                </div>

                <button
                  onClick={() => setPixModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pagar via Pix Copia e Cola</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="pb-3">Descrição da Cobrança</th>
                      <th className="pb-3">Vencimento</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3">Forma</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {financials.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">{f.title}</td>
                        <td className="py-3 text-slate-500">{f.dueDate}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">R$ {f.amount.toLocaleString('pt-BR')}</td>
                        <td className="py-3 uppercase font-semibold text-slate-500">{f.paymentMethod}</td>
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
                              onClick={() => setPixModalOpen(true)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 cursor-pointer"
                            >
                              Pagar Agora
                            </button>
                          ) : (
                            <span className="text-emerald-500 font-bold text-[10px]">✓ Pago</span>
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

        {/* TAB 4: INTERNAL REAL-TIME CHAT */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[540px] animate-in fade-in duration-200">
            
            {/* Chat Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  NC
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Suporte & Engenharia NCodes</h3>
                  <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sincronizado via Firestore
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
              {chatMessages.map(msg => {
                const isMe = msg.senderRole === 'client';
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between gap-4 text-[10px] opacity-80">
                        <span className="font-bold">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Digite sua mensagem para a equipe..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* TAB 5: SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Central de Chamados Técnicos</h3>
                <p className="text-xs text-slate-500 mt-1">Abra solicitações de suporte, tire dúvidas ou informe melhorias necessárias.</p>
              </div>

              <button
                onClick={() => setShowTicketModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Abrir Novo Chamado</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map(tk => (
                <div key={tk.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{tk.id} • {tk.category}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">{tk.status}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{tk.title}</h4>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Criado em: {tk.createdAt}</span>
                    <span>Última atualização: {tk.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* NEW QUOTE REQUEST MODAL INSIDE CLIENT PORTAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 pt-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Nova Solicitação de Orçamento</h3>
                  <p className="text-xs text-slate-500">Especifique os requisitos e recursos para receber proposta e análise de IA</p>
                </div>
              </div>
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-6">
              
              {/* SECTION 1: Informações do Projeto */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Informações Principais do Projeto</h4>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder="Ex: Plataforma E-commerce de Moda ou App de Agendamentos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Categoria do Projeto *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {clientQuoteCategories.map(cat => {
                      const catValue = cat.label || cat.id;
                      const active = category === catValue || category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(catValue)}
                          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            active
                              ? 'bg-blue-600/10 border-blue-600 text-blue-700 dark:bg-blue-500/20 dark:border-blue-400 dark:text-blue-300 ring-2 ring-blue-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-xs">{cat.label}</span>
                            {active && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                          </div>
                          {cat.desc && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                              {cat.desc}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Descrição Detalhada do Projeto *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo do software, público-alvo, regras de negócio e diferenciais esperados..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* SECTION 2: Funcionalidades Desejadas */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Funcionalidades Desejadas</h4>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Selecione as funcionalidades que seu projeto precisará ter ou adicione recursos específicos:
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {clientQuoteFeatures.map(featObj => {
                    const feat = featObj.label;
                    const isSelected = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={featObj.id || feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-60" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom feature input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customFeature}
                    onChange={e => setCustomFeature(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomFeature();
                      }
                    }}
                    placeholder="Adicionar outra funcionalidade (ex: Login Social, Emissão de NFe...)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomFeature}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {/* Selected Features list */}
                {selectedFeatures.length > 0 && (
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block mb-1.5">
                      Recursos Selecionados ({selectedFeatures.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFeatures.map(feat => (
                        <span
                          key={feat}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          {feat}
                          <button
                            type="button"
                            onClick={() => removeFeature(feat)}
                            className="hover:bg-blue-700 p-0.5 rounded-md transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Estimativas de Prazos e Investimento */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Estimativas de Prazos e Investimento</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Prazo de Entrega Desejado *
                    </label>
                    <select
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="15 dias (Urgente)">15 dias (Urgente)</option>
                      <option value="Até 30 dias">Até 30 dias</option>
                      <option value="Até 45 dias">Até 45 dias</option>
                      <option value="Até 60 dias">Até 60 dias</option>
                      <option value="A combinar">A combinar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Faixa de Investimento Prevista *
                    </label>
                    <select
                      value={budgetRange}
                      onChange={e => setBudgetRange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="Ainda não definida">Ainda não definida</option>
                      <option value="R$ 3.000 a R$ 8.000">R$ 3.000 a R$ 8.000</option>
                      <option value="R$ 8.000 a R$ 15.000">R$ 8.000 a R$ 15.000</option>
                      <option value="R$ 15.000 a R$ 30.000">R$ 15.000 a R$ 30.000</option>
                      <option value="Acima de R$ 30.000">Acima de R$ 30.000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Observações Adicionais
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    placeholder="Alguma observação importante, dúvida ou condição comercial prévia?"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* SECTION 4: Dados do Solicitante */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Dados do Solicitante</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="Empresa ou Pessoa Física"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      WhatsApp / Telefone
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={e => {
                        setWhatsapp(e.target.value);
                        setPhone(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isCreatingQuote}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isCreatingQuote ? 'Enviando e Processando Análise...' : 'Enviar Solicitação de Orçamento'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Pix Modal */}
      {pixModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pagamento via Pix Copia e Cola</h3>
            <p className="text-xs text-slate-500">Escaneie o QR Code no seu aplicativo bancário ou copie a chave Pix abaixo.</p>

            <div className="w-48 h-48 bg-slate-950 p-4 rounded-2xl mx-auto flex items-center justify-center border border-emerald-500/40 shadow-inner">
              <QrCode className="w-36 h-36 text-emerald-400" />
            </div>

            <button
              onClick={handleCopyPix}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{pixCopied ? 'Chave Pix Copiada!' : 'Copiar Chave Pix'}</span>
            </button>

            <button
              onClick={() => setPixModalOpen(false)}
              className="text-xs text-slate-400 hover:underline pt-2 block mx-auto cursor-pointer"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Abrir Novo Chamado de Suporte</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Título da Solicitação</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  placeholder="Ex: Dúvida na integração com gateway"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Categoria</label>
                <select
                  value={ticketCategory}
                  onChange={e => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="Suporte Técnico">Suporte Técnico</option>
                  <option value="Melhoria de Sistema">Melhoria de Sistema</option>
                  <option value="Dúvida Comercial">Dúvida Comercial</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Abrir Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Tracker Modal */}
      {selectedQuoteForTracker && (
        <QuoteTrackerModal
          quote={selectedQuoteForTracker}
          onClose={() => setSelectedQuoteForTracker(null)}
        />
      )}

    </div>
  );
};
