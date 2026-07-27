import React, { useState } from 'react';
import { sendEmailWithFallback } from '../utils/emailService';
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
  ChevronRight,
  Lock,
  Unlock,
  UserPlus,
  LogOut,
  KeyRound,
  ShieldAlert,
  User,
  ArrowLeft,
  Globe,
  Mail,
  Upload,
  Image,
  Repeat,
  CreditCard,
  Calendar,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  XCircle,
  X,
  Copy,
  Check,
  QrCode,
  RefreshCw,
  Settings,
  Layers,
  Code
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { ProposalGeneratorModal } from '../components/ProposalGeneratorModal';
import { QuoteRequest, Project, FinancialTransaction, LeadCRM, QuoteStatus, ClientSubscription, SubscriptionStatus, Proposal, ClientUser, ServiceItem } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    quotes, 
    proposals, 
    projects, 
    financials, 
    subscriptions,
    addSubscription,
    updateSubscription,
    updateSubscriptionStatus,
    deleteSubscription,
    generateSubscriptionBilling,
    leads, 
    updateQuoteStatus, 
    deleteQuote,
    setSelectedProposalIdForAcceptance, 
    setActiveView,
    toggleProjectTask,
    addProjectHours,
    addProjectFile,
    addFinancialTransaction,
    updateFinancialStatus,
    updateLeadStage,
    currentUser,
    isAdminAuthenticated,
    currentAdminUser,
    adminUsers,
    logoutAdmin,
    addAdminUser,
    deleteAdminUser,
    clientUsers,
    addClientUser,
    updateClientUser,
    deleteClientUser,
    siteConfig,
    updateSiteConfig,
    services,
    addService,
    updateService,
    deleteService
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'subscriptions' | 'projects' | 'financials' | 'clients' | 'crm' | 'team' | 'admin_users' | 'site_settings' | 'services'>('dashboard');

  // Service Management States
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceAvgTime, setServiceAvgTime] = useState('');
  const [serviceStartingPrice, setServiceStartingPrice] = useState('');
  const [serviceBenefitsInput, setServiceBenefitsInput] = useState('');
  const [serviceTechnologiesInput, setServiceTechnologiesInput] = useState('');
  const [deleteServiceConfirmId, setDeleteServiceConfirmId] = useState<string | null>(null);

  const handleOpenNewServiceModal = () => {
    setEditingService(null);
    setServiceTitle('');
    setServiceShortDesc('');
    setServiceDescription('');
    setServiceAvgTime('2 a 4 semanas');
    setServiceStartingPrice('Sob Orçamento');
    setServiceBenefitsInput('Performance Otimizada, Design Responsivo, Código Proprietário, Suporte Técnico');
    setServiceTechnologiesInput('React, TypeScript, Tailwind CSS, Node.js');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditServiceModal = (s: ServiceItem) => {
    setEditingService(s);
    setServiceTitle(s.title);
    setServiceShortDesc(s.shortDesc || '');
    setServiceDescription(s.description || '');
    setServiceAvgTime(s.avgTime || '');
    setServiceStartingPrice(s.startingPrice || '');
    setServiceBenefitsInput((s.benefits || []).join(', '));
    setServiceTechnologiesInput((s.technologies || []).join(', '));
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim()) return;

    const benefits = serviceBenefitsInput.split(',').map(b => b.trim()).filter(Boolean);
    const technologies = serviceTechnologiesInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingService) {
      await updateService(editingService.id, {
        title: serviceTitle.trim(),
        shortDesc: serviceShortDesc.trim() || serviceDescription.slice(0, 100),
        description: serviceDescription.trim(),
        avgTime: serviceAvgTime.trim(),
        startingPrice: serviceStartingPrice.trim(),
        benefits,
        technologies
      });
    } else {
      await addService({
        title: serviceTitle.trim(),
        slug: serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        iconName: 'Code',
        shortDesc: serviceShortDesc.trim() || serviceDescription.slice(0, 100),
        description: serviceDescription.trim(),
        avgTime: serviceAvgTime.trim(),
        startingPrice: serviceStartingPrice.trim(),
        benefits,
        technologies
      });
    }

    setIsServiceModalOpen(false);
  };

  // Client Management States
  const [clientSearch, setClientSearch] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientUser | null>(null);
  const [viewingClient, setViewingClient] = useState<ClientUser | null>(null);

  // Form states for Client creation/editing
  const [clientFormName, setClientFormName] = useState('');
  const [clientFormEmail, setClientFormEmail] = useState('');
  const [clientFormCompany, setClientFormCompany] = useState('');
  const [clientFormPhone, setClientFormPhone] = useState('');
  const [clientFormCity, setClientFormCity] = useState('');
  const [clientFormState, setClientFormState] = useState('');
  const [clientFormPassword, setClientFormPassword] = useState('');

  // Edit Subscription Modal States
  const [editingSub, setEditingSub] = useState<ClientSubscription | null>(null);
  const [showEditSubModal, setShowEditSubModal] = useState(false);
  const [editSubClientName, setEditSubClientName] = useState('');
  const [editSubClientEmail, setEditSubClientEmail] = useState('');
  const [editSubServiceName, setEditSubServiceName] = useState('');
  const [editSubMonthlyValue, setEditSubMonthlyValue] = useState<number>(0);
  const [editSubBillingCycleDay, setEditSubBillingCycleDay] = useState<number>(10);
  const [editSubStatus, setEditSubStatus] = useState<SubscriptionStatus>('ativo');
  const [editSubPaymentMethod, setEditSubPaymentMethod] = useState<'pix' | 'cartao' | 'boleto' | 'transferencia'>('pix');
  const [editSubNotes, setEditSubNotes] = useState('');
  const [editSubBillingType, setEditSubBillingType] = useState<'recorrente' | 'valor_unico'>('recorrente');
  const [editSubOneTimeTotalValue, setEditSubOneTimeTotalValue] = useState<number>(0);

  // Site Configuration Form States
  const [editCompanyName, setEditCompanyName] = useState(siteConfig?.companyName || 'NCodes Technologies');
  const [editLogoUrl, setEditLogoUrl] = useState(siteConfig?.logoUrl || '');
  const [editHeroBadge, setEditHeroBadge] = useState(siteConfig?.heroBadge || 'Cadastre-se e solicite seu orçamento online');
  const [editHeroTitle, setEditHeroTitle] = useState(siteConfig?.heroTitle || 'Transformamos Ideias em Software de Alto Desempenho');
  const [editHeroSubtitle, setEditHeroSubtitle] = useState(siteConfig?.heroSubtitle || 'Desenvolvemos ecossistemas tecnológicos completos: aplicativos móveis em Flutter, sistemas web empresariais, automações com IA e APIs na nuvem.');
  const [editPhone, setEditPhone] = useState(siteConfig?.phone || '(11) 99887-6655');
  const [editWhatsapp, setEditWhatsapp] = useState(siteConfig?.whatsapp || '5511998876655');
  const [editEmail, setEditEmail] = useState(siteConfig?.email || 'contato@ncodestechnologies.com.br');
  const [editNotificationEmail, setEditNotificationEmail] = useState(siteConfig?.notificationEmail || siteConfig?.email || 'contato@ncodestechnologies.com.br');
  const [editResendApiKey, setEditResendApiKey] = useState(siteConfig?.resendApiKey || '');
  const [editSmtpHost, setEditSmtpHost] = useState(siteConfig?.smtpHost || '');
  const [editSmtpPort, setEditSmtpPort] = useState(siteConfig?.smtpPort || '587');
  const [editSmtpUser, setEditSmtpUser] = useState(siteConfig?.smtpUser || '');
  const [editSmtpPass, setEditSmtpPass] = useState(siteConfig?.smtpPass || '');
  const [editSmtpFrom, setEditSmtpFrom] = useState(siteConfig?.smtpFrom || '');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const [editAddress, setEditAddress] = useState(siteConfig?.address || 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP');
  const [editAnnouncementBanner, setEditAnnouncementBanner] = useState(siteConfig?.announcementBanner || '');
  const [editIsAnnouncementActive, setEditIsAnnouncementActive] = useState(siteConfig?.isAnnouncementActive ?? false);
  const [editMaintenanceMode, setEditMaintenanceMode] = useState(siteConfig?.maintenanceMode ?? false);
  const [isPublishingSite, setIsPublishingSite] = useState(false);
  const [sitePublishSuccess, setSitePublishSuccess] = useState(false);

  // Sync state if siteConfig changes from remote Firestore
  React.useEffect(() => {
    if (siteConfig) {
      setEditCompanyName(siteConfig.companyName || 'NCodes Technologies');
      setEditLogoUrl(siteConfig.logoUrl || '');
      setEditHeroBadge(siteConfig.heroBadge || '');
      setEditHeroTitle(siteConfig.heroTitle || '');
      setEditHeroSubtitle(siteConfig.heroSubtitle || '');
      setEditPhone(siteConfig.phone || '');
      setEditWhatsapp(siteConfig.whatsapp || '');
      setEditEmail(siteConfig.email || '');
      setEditNotificationEmail(siteConfig.notificationEmail || siteConfig.email || 'contato@ncodestechnologies.com.br');
      setEditResendApiKey(siteConfig.resendApiKey || '');
      setEditSmtpHost(siteConfig.smtpHost || '');
      setEditSmtpPort(siteConfig.smtpPort || '587');
      setEditSmtpUser(siteConfig.smtpUser || '');
      setEditSmtpPass(siteConfig.smtpPass || '');
      setEditSmtpFrom(siteConfig.smtpFrom || '');
      setEditAddress(siteConfig.address || '');
      setEditAnnouncementBanner(siteConfig.announcementBanner || '');
      setEditIsAnnouncementActive(siteConfig.isAnnouncementActive ?? false);
      setEditMaintenanceMode(siteConfig.maintenanceMode ?? false);
    }
  }, [siteConfig]);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Selecione uma imagem com menos de 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingSite(true);
    await updateSiteConfig({
      companyName: editCompanyName,
      logoUrl: editLogoUrl,
      heroBadge: editHeroBadge,
      heroTitle: editHeroTitle,
      heroSubtitle: editHeroSubtitle,
      phone: editPhone,
      whatsapp: editWhatsapp,
      email: editEmail,
      notificationEmail: editNotificationEmail,
      resendApiKey: editResendApiKey,
      smtpHost: editSmtpHost,
      smtpPort: editSmtpPort,
      smtpUser: editSmtpUser,
      smtpPass: editSmtpPass,
      smtpFrom: editSmtpFrom,
      address: editAddress,
      announcementBanner: editAnnouncementBanner,
      isAnnouncementActive: editIsAnnouncementActive,
      maintenanceMode: editMaintenanceMode
    });
    setIsPublishingSite(false);
    setSitePublishSuccess(true);
    setTimeout(() => setSitePublishSuccess(false), 4000);
  };

  // New Admin User Modal State
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRoleTitle, setNewAdminRoleTitle] = useState('Administrador Master');

  // Proposal modal trigger
  const [selectedQuoteForProp, setSelectedQuoteForProp] = useState<QuoteRequest | null>(null);

  // Quote Client Positioning Modal State
  const [positioningQuote, setPositioningQuote] = useState<QuoteRequest | null>(null);
  const [positionStatus, setPositionStatus] = useState<QuoteStatus>('em_analise');
  const [positionMessage, setPositionMessage] = useState('');
  const [isSendingPosition, setIsSendingPosition] = useState(false);
  const [positionSuccessMsg, setPositionSuccessMsg] = useState<string | null>(null);

  // New Transaction Form state
  const [showFinModal, setShowFinModal] = useState(false);
  const [finTitle, setFinTitle] = useState('');
  const [finType, setFinType] = useState<'receita' | 'despesa'>('receita');
  const [finCategory, setFinCategory] = useState('Desenvolvimento de Software');
  const [finAmount, setFinAmount] = useState(5000);
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finPaymentMethod, setFinPaymentMethod] = useState<'pix' | 'cartao' | 'transferencia' | 'dinheiro'>('pix');

  // Subscriptions & Client Recurring Fees State
  const [finSubTab, setFinSubTab] = useState<'subscriptions' | 'transactions'>('subscriptions');
  const [subSearch, setSubSearch] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState<'todos' | 'ativo' | 'inadimplente' | 'suspenso'>('todos');
  const [showNewSubModal, setShowNewSubModal] = useState(false);
  const [selectedSubClientId, setSelectedSubClientId] = useState<string>('');
  const [subClientName, setSubClientName] = useState('');
  const [subClientEmail, setSubClientEmail] = useState('');
  const [subServiceName, setSubServiceName] = useState('Sustentação de App Mobile & Infraestrutura Cloud');
  const [subMonthlyValue, setSubMonthlyValue] = useState(1800);
  const [subBillingCycleDay, setSubBillingCycleDay] = useState(10);
  const [subPaymentMethod, setSubPaymentMethod] = useState<'pix' | 'cartao' | 'boleto' | 'transferencia'>('pix');
  const [subNotes, setSubNotes] = useState('');
  const [copiedSubPixId, setCopiedSubPixId] = useState<string | null>(null);

  // Subscription Calculations
  const totalMRR = subscriptions.filter(s => s.status === 'ativo').reduce((acc, curr) => acc + curr.monthlyValue, 0);
  const totalInadimplenciaMRR = subscriptions.filter(s => s.status === 'inadimplente').reduce((acc, curr) => acc + curr.monthlyValue, 0);
  const activeSubsCount = subscriptions.filter(s => s.status === 'ativo').length;

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subClientName.trim() || !subServiceName.trim() || !subMonthlyValue) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const today = new Date();
    const nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, Number(subBillingCycleDay)).toISOString().split('T')[0];
    const defaultPix = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${subMonthlyValue}.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304`;

    await addSubscription({
      clientName: subClientName.trim(),
      clientEmail: subClientEmail.trim() || undefined,
      serviceName: subServiceName.trim(),
      monthlyValue: Number(subMonthlyValue),
      billingCycleDay: Number(subBillingCycleDay),
      status: 'ativo',
      startDate: today.toISOString().split('T')[0],
      nextDueDate,
      paymentMethod: subPaymentMethod,
      notes: subNotes.trim() || undefined,
      pixCopyPaste: defaultPix
    });

    setShowNewSubModal(false);
    setSelectedSubClientId('');
    setSubClientName('');
    setSubClientEmail('');
    setSubNotes('');
  };

  const handleOpenEditSub = (sub: ClientSubscription) => {
    setEditingSub(sub);
    setEditSubClientName(sub.clientName);
    setEditSubClientEmail(sub.clientEmail || '');
    setEditSubServiceName(sub.serviceName);
    setEditSubMonthlyValue(sub.monthlyValue);
    setEditSubBillingCycleDay(sub.billingCycleDay);
    setEditSubStatus(sub.status);
    setEditSubPaymentMethod(sub.paymentMethod);
    setEditSubNotes(sub.notes || '');
    setEditSubBillingType(sub.billingType || 'recorrente');
    setEditSubOneTimeTotalValue(sub.oneTimeTotalValue || sub.monthlyValue * 12);
    setShowEditSubModal(true);
  };

  const handleSaveEditSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    const defaultPix = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${editSubMonthlyValue}.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304`;

    await updateSubscription(editingSub.id, {
      clientName: editSubClientName.trim(),
      clientEmail: editSubClientEmail.trim() || undefined,
      serviceName: editSubServiceName.trim(),
      monthlyValue: Number(editSubMonthlyValue),
      billingCycleDay: Number(editSubBillingCycleDay),
      status: editSubStatus,
      paymentMethod: editSubPaymentMethod,
      notes: editSubNotes.trim() || undefined,
      billingType: editSubBillingType,
      oneTimeTotalValue: Number(editSubOneTimeTotalValue),
      pixCopyPaste: defaultPix
    });

    setShowEditSubModal(false);
    setEditingSub(null);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientFormName.trim() || !clientFormEmail.trim()) {
      alert('Por favor, informe ao menos o Nome e o E-mail do cliente.');
      return;
    }

    if (editingClient) {
      await updateClientUser(editingClient.id, {
        name: clientFormName.trim(),
        email: clientFormEmail.trim(),
        company: clientFormCompany.trim(),
        phone: clientFormPhone.trim(),
        city: clientFormCity.trim(),
        state: clientFormState.trim(),
        ...(clientFormPassword.trim() ? { passwordHash: clientFormPassword.trim() } : {})
      });
    } else {
      const res = await addClientUser({
        name: clientFormName.trim(),
        email: clientFormEmail.trim(),
        company: clientFormCompany.trim(),
        phone: clientFormPhone.trim(),
        city: clientFormCity.trim(),
        state: clientFormState.trim(),
        passwordHash: clientFormPassword.trim() || '123456'
      });
      if (!res.success) {
        alert(res.error || 'Não foi possível cadastrar o cliente. Verifique se o e-mail já existe.');
        return;
      }
    }

    setShowAddClientModal(false);
    setEditingClient(null);
  };

  const handleLinkProposalToSub = (prop: Proposal) => {
    setSubClientName(prop.clientName);
    setSubClientEmail(`${prop.clientName.toLowerCase().replace(/\s+/g, '')}@cliente.com.br`);
    setSubServiceName(`Sustentação & Manutenção - ${prop.title}`);
    setSubMonthlyValue(prop.recurringMonthlyValue && prop.recurringMonthlyValue > 0 ? prop.recurringMonthlyValue : Math.round(prop.totalValue / 12));
    setSubNotes(`Referente à Proposta ${prop.id} aprovada. Valor total do projeto: R$ ${prop.totalValue.toLocaleString('pt-BR')}.`);
    setShowNewSubModal(true);
  };

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

  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminUsername.trim() || !newAdminPassword) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Check if username already exists
    if (adminUsers.some(u => u.username.toLowerCase() === newAdminUsername.trim().toLowerCase())) {
      alert('Este nome de usuário já está em uso.');
      return;
    }

    addAdminUser({
      name: newAdminName.trim(),
      username: newAdminUsername.trim().toLowerCase(),
      passwordHash: newAdminPassword,
      roleTitle: newAdminRoleTitle
    });

    setShowNewAdminModal(false);
    setNewAdminName('');
    setNewAdminUsername('');
    setNewAdminPassword('');
  };

  // If not authenticated, render strict access lock screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Sessão Não Autenticada
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Você precisa efetuar o login com usuário e senha para acessar as métricas, orçamentos e cadastros do painel administrativo.
            </p>
          </div>
          <button
            onClick={() => setActiveView('admin_login')}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Lock className="w-4 h-4" />
            <span>Acessar Tela de Login Admin</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      
      {/* Standalone Admin Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Page Identifier */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl transition-all"
              title="Voltar para o site público institucional"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao Site Principal</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                N
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight block leading-none">
                  NCodes Admin
                </span>
                <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase block mt-0.5">
                  Painel de Gestão Restrito
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="py-2 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sair do painel administrativo"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Sessão Administrativa Autenticada</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Painel de Controle NCodes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Logado como: <strong className="text-slate-800 dark:text-slate-200">{currentAdminUser?.name || currentUser.name}</strong> (@{currentAdminUser?.username || 'admin'})
          </p>
        </div>

        {/* Tab Selector Buttons & Logout */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quotes' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Orçamentos ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'clients' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clientes ({clientUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'subscriptions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mensalidades ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'projects' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projetos ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'financials' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financeiro</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'crm' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('admin_users')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'admin_users' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Usuários Admin ({adminUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'services' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Serviços do Site ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('site_settings')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
              activeTab === 'site_settings' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/20' 
                : 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Atualizar Site (LIVE)</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all flex items-center gap-1.5 shrink-0"
            title="Encerrar Sessão Administrativa"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Receita Realizada</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"><TrendingUp className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white relative z-10">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold relative z-10">+18.5% comparado ao mês anterior</p>
            </div>

            <div className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">A Receber (Pendente)</span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"><Clock className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white relative z-10">
                R$ {totalPendingRevenue.toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold relative z-10">{financials.filter(f => f.status === 'pendente').length} parcelas pendentes</p>
            </div>

            <div className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Projetos Ativos</span>
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"><FolderGit2 className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white relative z-10">
                {projects.filter(p => p.status === 'em_andamento').length}
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold relative z-10">Sincronização com App Mobile</p>
            </div>

            <div className="bento-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lucro Líquido</span>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30"><DollarSign className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white relative z-10">
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
                    <th className="pb-3">Descrição</th>
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
                      <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{q.description}</td>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedQuoteForProp(q);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                          >
                            Elaborar Proposta
                          </button>
                          <button
                            onClick={() => deleteQuote(q.id)}
                            title="Excluir Orçamento"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

                  <div className="flex flex-wrap items-center gap-2">
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
                      onClick={() => {
                        setPositioningQuote(q);
                        setPositionStatus(q.status);
                        setPositionMessage(q.adminNotes || '');
                      }}
                      title="Enviar e-mail de posicionamento/atualização ao cliente"
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 border border-blue-500/30 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Posicionamento por E-mail</span>
                    </button>

                    <button
                      onClick={() => setSelectedQuoteForProp(q)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>Gerar Proposta</span>
                    </button>

                    <button
                      onClick={() => deleteQuote(q.id)}
                      title="Excluir Orçamento"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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

                {q.adminNotes && (
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 block text-[11px] uppercase tracking-wider">
                        Último Posicionamento Enviado por E-mail ao Cliente:
                      </span>
                      <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium italic">"{q.adminNotes}"</p>
                    </div>
                  </div>
                )}

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

      {/* EXCLUSIVE TAB: GESTÃO E ALTERAÇÃO DE MENSALIDADES (MRR) & CONTRATOS */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Flow Explanation */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                  <Repeat className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                  <span>Área Exclusiva do Painel Restrito</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Gestão & Alteração de Mensalidades de Clientes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Gerencie contratos, altere valores de mensalidades ou vincule orçamentos aprovados aos seus clientes.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSubClientName('');
                    setSubClientEmail('');
                    setSubServiceName('');
                    setSubMonthlyValue(1200);
                    setSubNotes('');
                    setShowNewSubModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Cadastrar Nova Mensalidade</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Receita Mensal Recorrente (MRR)</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">
                  R$ {totalMRR.toLocaleString('pt-BR')}<span className="text-xs font-medium text-slate-500"> /mês</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase block">Assinaturas Ativas</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">
                  {activeSubsCount} <span className="text-xs font-medium text-slate-500">contratos</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase block">Orçamentos Aprovados A Vincular</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">
                  {proposals.filter(p => p.status === 'aceito').length} <span className="text-xs font-medium text-slate-500">propostas</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase block">Inadimplência</span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block mt-1">
                  R$ {totalInadimplenciaMRR.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

          </div>

          {/* Section: Orçamentos / Propostas Aprovadas Prontas para Vincular Mensalidade */}
          {proposals.filter(p => p.status === 'aceito').length > 0 && (
            <div className="bg-gradient-to-br from-blue-900/10 via-emerald-900/10 to-slate-900/20 dark:bg-slate-900 p-6 rounded-3xl border border-blue-500/30 dark:border-emerald-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Aprovados via Aceite Digital</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Propostas Aprovadas Prontas para Vincular Mensalidade
                  </h3>
                  <p className="text-xs text-slate-500">
                    Estes clientes já aceitaram o orçamento. Clique abaixo para ativar a mensalidade no cadastro do cliente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposals.filter(p => p.status === 'aceito').map(prop => {
                  const alreadyLinked = subscriptions.some(s => s.proposalId === prop.id || s.clientName === prop.clientName);
                  return (
                    <div key={prop.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">{prop.id}</span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{prop.clientName}</h4>
                          <p className="text-xs text-slate-500">{prop.company || 'Empresa'} • {prop.title}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Aceito
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Valor Total do Projeto:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">R$ {prop.totalValue.toLocaleString('pt-BR')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Mensalidade Estimada:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            R$ {(prop.recurringMonthlyValue || Math.round(prop.totalValue / 12)).toLocaleString('pt-BR')}/mês
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLinkProposalToSub(prop)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          alreadyLinked
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        }`}
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>{alreadyLinked ? 'Alterar Mensalidade / Cobrança Vinculada' : 'Vincular Mensalidade ao Cliente'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Active Subscriptions Table and Editing Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Contratos de Mensalidades Cadastradas ({subscriptions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Gerencie valores, dias de vencimento, formas de pagamento ou altere entre mensalidade recorrente e valor único.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={subSearch}
                    onChange={e => setSubSearch(e.target.value)}
                    placeholder="Buscar cliente ou serviço..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <select
                  value={subStatusFilter}
                  onChange={e => setSubStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativos</option>
                  <option value="inadimplente">Inadimplentes</option>
                  <option value="suspenso">Suspensos</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3 px-3">Cliente / Contato</th>
                    <th className="pb-3 px-3">Serviço / Contrato</th>
                    <th className="pb-3 px-3">Modalidade</th>
                    <th className="pb-3 px-3">Valor da Mensalidade</th>
                    <th className="pb-3 px-3">Vencimento</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Ações de Alteração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subscriptions
                    .filter(s => {
                      const matchSearch = s.clientName.toLowerCase().includes(subSearch.toLowerCase()) ||
                                          s.serviceName.toLowerCase().includes(subSearch.toLowerCase());
                      const matchStatus = subStatusFilter === 'todos' || s.status === subStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                              {sub.clientName.charAt(0)}
                            </div>
                            <div>
                              <span className="block">{sub.clientName}</span>
                              {sub.clientEmail && (
                                <span className="block text-[10px] text-slate-400 font-normal">{sub.clientEmail}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs">
                          <span className="font-semibold block">{sub.serviceName}</span>
                          {sub.notes && (
                            <span className="text-[10px] text-slate-400 truncate block max-w-[220px]">{sub.notes}</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            sub.billingType === 'valor_unico' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {sub.billingType === 'valor_unico' ? 'Valor Único' : 'Recorrente'}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-black text-slate-900 dark:text-white">
                          R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                          <span className="text-[10px] text-slate-400 font-normal block uppercase">{sub.paymentMethod}</span>
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                          Dia {sub.billingCycleDay}
                          <span className="block text-[10px] text-slate-400 font-sans">Próx: {sub.nextDueDate}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                            sub.status === 'ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            sub.status === 'inadimplente' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            sub.status === 'suspenso' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {sub.status === 'ativo' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                            {sub.status === 'inadimplente' && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                            {sub.status === 'suspenso' && <PauseCircle className="w-3 h-3 text-amber-500" />}
                            {sub.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Botão EXCLUSIVO de Alterar Mensalidade */}
                            <button
                              onClick={() => handleOpenEditSub(sub)}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                              title="Alterar mensalidade, valores, vencimentos ou modalidade"
                            >
                              <Settings className="w-3 h-3" />
                              <span>Alterar Mensalidade</span>
                            </button>

                            {/* Emitir Fatura */}
                            <button
                              onClick={() => generateSubscriptionBilling(sub.id)}
                              className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-[10px] cursor-pointer"
                              title="Emitir fatura no financeiro"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>

                            {/* Deletar */}
                            <button
                              onClick={() => deleteSubscription(sub.id)}
                              className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold text-[10px] cursor-pointer"
                              title="Remover contrato"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

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

      {/* TAB 4: FINANCIAL MANAGEMENT & CLIENT SUBSCRIPTIONS */}
      {activeTab === 'financials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Section Header & Summary Metrics Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                  <Repeat className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                  <span>Gestão Financeira & Recorrência de Clientes (MRR)</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Controle de Mensalidades & Fluxo de Caixa
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Acompanhe contratos de sustentação, cobranças de mensalidades recorrentes de serviços, faturamento por Pix e controle de inadimplência.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowNewSubModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nova Mensalidade de Cliente</span>
                </button>

                <button
                  onClick={() => setShowFinModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lançamento Avulso</span>
                </button>
              </div>
            </div>

            {/* Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                  <span>Receita Mensal Recorrente (MRR)</span>
                  <Repeat className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  R$ {totalMRR.toLocaleString('pt-BR')}
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400"> / mês</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {activeSubsCount} contrato(s) ativo(s) com cobrança
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
                  <span>Contratos de Serviços</span>
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {subscriptions.length} <span className="text-xs font-medium text-slate-500">clientes</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {activeSubsCount} ativos • {subscriptions.length - activeSubsCount} pendente/pausado
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">
                  <span>Inadimplência / Pendentes</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  R$ {totalInadimplenciaMRR.toLocaleString('pt-BR')}
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {subscriptions.filter(s => s.status === 'inadimplente').length} mensalidade(s) com atraso
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-bold uppercase">
                  <span>Caixa Confirmado (Receitas)</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  R$ {totalRevenue.toLocaleString('pt-BR')}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Lucro líquido estimado: R$ {netProfit.toLocaleString('pt-BR')}
                </p>
              </div>

            </div>

            {/* Sub-tab Navigation Buttons */}
            <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                onClick={() => setFinSubTab('subscriptions')}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  finSubTab === 'subscriptions'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Mensalidades de Clientes (MRR)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
                  {subscriptions.length}
                </span>
              </button>

              <button
                onClick={() => setFinSubTab('transactions')}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  finSubTab === 'transactions'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Extrato Avulso & Fluxo de Caixa</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                  {financials.length}
                </span>
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: MENSALIDADES DE CLIENTES (MRR) */}
          {finSubTab === 'subscriptions' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              
              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={subSearch}
                    onChange={e => setSubSearch(e.target.value)}
                    placeholder="Buscar cliente ou serviço..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={subStatusFilter}
                    onChange={e => setSubStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="ativo">Somente Ativos</option>
                    <option value="inadimplente">Somente Inadimplentes</option>
                    <option value="suspenso">Somente Suspensos</option>
                  </select>
                </div>
              </div>

              {/* Subscriptions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="pb-3 px-3">Cliente / E-mail</th>
                      <th className="pb-3 px-3">Serviço de Mensalidade</th>
                      <th className="pb-3 px-3">Valor Mensal</th>
                      <th className="pb-3 px-3">Dia Venc.</th>
                      <th className="pb-3 px-3">Próx. Vencimento</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Ações & Faturamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {subscriptions
                      .filter(s => {
                        const matchSearch = s.clientName.toLowerCase().includes(subSearch.toLowerCase()) ||
                                            s.serviceName.toLowerCase().includes(subSearch.toLowerCase());
                        const matchStatus = subStatusFilter === 'todos' || s.status === subStatusFilter;
                        return matchSearch && matchStatus;
                      })
                      .map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                                {sub.clientName.charAt(0)}
                              </div>
                              <div>
                                <span>{sub.clientName}</span>
                                {sub.clientEmail && (
                                  <span className="block text-[10px] text-slate-400 font-normal">{sub.clientEmail}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs">
                            <span className="font-semibold block">{sub.serviceName}</span>
                            {sub.notes && (
                              <span className="text-[10px] text-slate-400 truncate block max-w-[200px]">{sub.notes}</span>
                            )}
                          </td>

                          <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                            R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                            <span className="text-[10px] text-slate-400 font-normal block uppercase">{sub.paymentMethod}</span>
                          </td>

                          <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">
                            Dia {sub.billingCycleDay}
                          </td>

                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                            {sub.nextDueDate}
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                              sub.status === 'ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              sub.status === 'inadimplente' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                              sub.status === 'suspenso' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {sub.status === 'ativo' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                              {sub.status === 'inadimplente' && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                              {sub.status === 'suspenso' && <PauseCircle className="w-3 h-3 text-amber-500" />}
                              {sub.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Gerar Fatura no Financeiro */}
                              <button
                                onClick={() => generateSubscriptionBilling(sub.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                                title="Emitir fatura do mês atual no financeiro"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Emitir Fatura</span>
                              </button>

                              {/* Dar Baixa (Pago) */}
                              {sub.status !== 'ativo' && (
                                <button
                                  onClick={() => {
                                    const nextMonth = new Date();
                                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                                    nextMonth.setDate(sub.billingCycleDay);
                                    updateSubscriptionStatus(sub.id, 'ativo', nextMonth.toISOString().split('T')[0], new Date().toISOString().split('T')[0]);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer"
                                  title="Marcar mensalidade como paga e renovar vencimento"
                                >
                                  Dar Baixa (Pago)
                                </button>
                              )}

                              {/* Marcar Inadimplente */}
                              {sub.status === 'ativo' && (
                                <button
                                  onClick={() => updateSubscriptionStatus(sub.id, 'inadimplente')}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 cursor-pointer"
                                  title="Marcar como inadimplente"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Copiar Pix */}
                              {sub.pixCopyPaste && (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(sub.pixCopyPaste || '');
                                    setCopiedSubPixId(sub.id);
                                    setTimeout(() => setCopiedSubPixId(null), 2500);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                                  title="Copiar Pix Copia e Cola"
                                >
                                  {copiedSubPixId === sub.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              {/* Delete Subscription */}
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja cancelar e remover a mensalidade do cliente ${sub.clientName}?`)) {
                                    deleteSubscription(sub.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                title="Remover contrato"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* SUB-TAB 2: TRANSAÇÕES AVULSAS & FLUXO DE CAIXA */}
          {finSubTab === 'transactions' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Lançamentos de Caixa & Parcelas Avulsas</h3>
                  <p className="text-xs text-slate-500">Histórico completo de entradas de projetos, mensalidades geradas e despesas operacionais.</p>
                </div>
                <button
                  onClick={() => setShowFinModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Lançamento Manual</span>
                </button>
              </div>

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
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.type === 'receita' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
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
                              className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
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
          )}

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

      {/* TAB 6: ADMIN USERS MANAGEMENT (Inclusão exclusiva pelo painel) */}
      {activeTab === 'admin_users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Section Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
                <Lock className="w-4 h-4" />
                <span>Gestão Restrita de Acesso</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Administradores Cadastrados
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Usuários com permissão para efetuar login na tela restrita. Novos acessos são concedidos exclusivamente aqui.
              </p>
            </div>

            <button
              onClick={() => setShowNewAdminModal(true)}
              className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Incluir Novo Administrador</span>
            </button>
          </div>

          {/* Security Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Política de Segurança de Acesso Administrativo:</p>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Não existe tela pública de cadastro ou auto-solicitação. Qualquer novo gestor que necessite de acesso ao painel deve ser criado diretamente por um administrador existente através do botão acima.
              </p>
            </div>
          </div>

          {/* Admin Users Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Nome do Administrador</th>
                    <th className="py-4 px-6">Nome de Usuário (Login)</th>
                    <th className="py-4 px-6">Cargo / Nível</th>
                    <th className="py-4 px-6">Cadastrado Por</th>
                    <th className="py-4 px-6">Data de Criação</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span>{user.name}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        @{user.username}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold text-[11px]">
                          {user.roleTitle}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {user.addedBy || 'Sistema'}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteAdminUser(user.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                          title="Remover Acesso de Administrador"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* TAB: GESTÃO DE CLIENTES */}
      {activeTab === 'clients' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Painel de Controle • Base de Clientes</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Gestão de Clientes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cadastre, visualize e gerencie a base de clientes, seus contratos de mensalidades, orçamentos solicitados e projetos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingClient(null);
                  setClientFormName('');
                  setClientFormEmail('');
                  setClientFormCompany('');
                  setClientFormPhone('');
                  setClientFormCity('');
                  setClientFormState('');
                  setClientFormPassword('');
                  setShowAddClientModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Cadastrar Novo Cliente</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de Clientes</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{clientUsers.length}</p>
              <p className="text-[10px] text-slate-500">Cadastrados no Portal</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Mensalidades Ativas</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {subscriptions.filter(s => s.status === 'ativo').length}
              </p>
              <p className="text-[10px] text-emerald-600/80">Contratos vigentes</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Projetos Ativos</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {projects.filter(p => p.status === 'em_andamento').length}
              </p>
              <p className="text-[10px] text-blue-600/80">Em desenvolvimento</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Orçamentos Recebidos</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {quotes.length}
              </p>
              <p className="text-[10px] text-purple-600/80">Solicitações totais</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail, empresa ou cidade..."
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Exibindo {clientUsers.filter(c => 
                c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
                (c.company && c.company.toLowerCase().includes(clientSearch.toLowerCase())) ||
                (c.city && c.city.toLowerCase().includes(clientSearch.toLowerCase()))
              ).length} de {clientUsers.length} cliente(s)
            </span>
          </div>

          {/* Clients List Table / Cards Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
            {clientUsers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Nenhum cliente cadastrado ainda
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Clique no botão "+ Cadastrar Novo Cliente" acima para incluir o primeiro cliente manualmente.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4">Cliente / Empresa</th>
                      <th className="p-4">Contato</th>
                      <th className="p-4">Localização</th>
                      <th className="p-4">Resumo de Vínculos</th>
                      <th className="p-4">Data Cadastro</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {clientUsers
                      .filter(c => 
                        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        (c.company && c.company.toLowerCase().includes(clientSearch.toLowerCase())) ||
                        (c.city && c.city.toLowerCase().includes(clientSearch.toLowerCase()))
                      )
                      .map((client) => {
                        const clientProjects = projects.filter(p => p.clientName.toLowerCase() === client.name.toLowerCase() || p.clientName.toLowerCase() === client.company.toLowerCase());
                        const clientSubs = subscriptions.filter(s => s.clientName.toLowerCase() === client.name.toLowerCase() || s.clientName.toLowerCase() === client.company.toLowerCase());
                        const clientQuotes = quotes.filter(q => q.clientName.toLowerCase() === client.name.toLowerCase() || q.email.toLowerCase() === client.email.toLowerCase());

                        return (
                          <tr key={client.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 text-sm uppercase">
                                  {client.avatar ? (
                                    <img src={client.avatar} alt={client.name} className="w-full h-full rounded-2xl object-cover" />
                                  ) : (
                                    client.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                                    {client.name}
                                  </p>
                                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                    {client.company || 'Pessoa Física'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 space-y-0.5">
                              <p className="font-medium text-slate-800 dark:text-slate-200">{client.email}</p>
                              {client.phone && (
                                <p className="text-[11px] text-slate-500 font-mono">
                                  {client.phone}
                                </p>
                              )}
                            </td>

                            <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                              {client.city ? `${client.city} - ${client.state || 'UF'}` : 'Não informada'}
                            </td>

                            <td className="p-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                  {clientProjects.length} Projeto(s)
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                  {clientSubs.length} Mensalidade(s)
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold border border-purple-500/20">
                                  {clientQuotes.length} Orçamento(s)
                                </span>
                              </div>
                            </td>

                            <td className="p-4 text-slate-500 text-[11px]">
                              {client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : 'Recente'}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedSubClientId(client.id);
                                    setSubClientName(client.company ? `${client.name} (${client.company})` : client.name);
                                    setSubClientEmail(client.email);
                                    setShowNewSubModal(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="Cadastrar Nova Mensalidade para este cliente"
                                >
                                  <Repeat className="w-3.5 h-3.5" />
                                  <span>+ Mensalidade</span>
                                </button>
                                <button
                                  onClick={() => setViewingClient(client)}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="Ver Detalhes do Cliente"
                                >
                                  <span>Detalhes</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingClient(client);
                                    setClientFormName(client.name);
                                    setClientFormEmail(client.email);
                                    setClientFormCompany(client.company || '');
                                    setClientFormPhone(client.phone || '');
                                    setClientFormCity(client.city || '');
                                    setClientFormState(client.state || '');
                                    setClientFormPassword('');
                                    setShowAddClientModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                  title="Editar Cliente"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
                                      deleteClientUser(client.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 cursor-pointer"
                                  title="Excluir Cliente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 7: ATUALIZAR SITE AO VIVO */}
      {activeTab === 'site_settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-500 uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Gestão do Conteúdo do Site Público • Tempo Real</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Atualização do Site Institucional
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Altere os textos do Hero, banners de anúncio, telefones e informações institucionais. As alterações são publicadas instantaneamente no site e aplicativo mobile.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Firestore Sync On</span>
              </div>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Modelos de Texto Rápidos:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditHeroBadge('Cadastre-se e solicite seu orçamento online');
                  setEditHeroTitle('Transformamos Ideias em Software de Alto Desempenho');
                  setEditHeroSubtitle('Desenvolvemos ecossistemas tecnológicos completos: aplicativos móveis em Flutter, sistemas web empresariais e automações com IA.');
                  setEditAnnouncementBanner('🚀 Novo Portal do Cliente no ar: Cadastre-se e receba seu orçamento automatizado por IA em minutos!');
                  setEditIsAnnouncementActive(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold transition-all cursor-pointer"
              >
                Campanha Orçamento & Cadastro
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditHeroBadge('Inteligência Artificial Integrada ao seu Negócio');
                  setEditHeroTitle('Sistemas Web & Apps com IA Gemini Nativa');
                  setEditHeroSubtitle('Crie soluções de software preparadas para o futuro com chatbots avançados, processamento de documentos e automação inteligente.');
                  setEditAnnouncementBanner('✨ Agende uma demonstração gratuita de automação com Inteligência Artificial para sua empresa!');
                  setEditIsAnnouncementActive(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition-all cursor-pointer"
              >
                Divulgação de IA & Inovação
              </button>
            </div>
          </div>

          {/* Email Notification Alerts Config Box */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Notificações por E-mail do Sistema & Servidor Transacional
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Configure seu e-mail de destino e o serviço de envio para entrega direta na caixa de entrada
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Alertas Ativos</span>
                </span>
              </div>
            </div>

            <div className="text-xs space-y-4">
              {/* Destination Email */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-200 block">
                    1. Seu E-mail Principal para Receber Alertas Automáticos:
                  </label>
                  <span className="text-[10px] text-blue-400 font-semibold">Alertas de Cadastro + Orçamento</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={editNotificationEmail}
                    onChange={e => setEditNotificationEmail(e.target.value)}
                    placeholder="ex: p.nikolas3@gmail.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await updateSiteConfig({
                        notificationEmail: editNotificationEmail,
                        resendApiKey: editResendApiKey,
                        smtpHost: editSmtpHost,
                        smtpPort: editSmtpPort,
                        smtpUser: editSmtpUser,
                        smtpPass: editSmtpPass,
                        smtpFrom: editSmtpFrom
                      });
                      setSitePublishSuccess(true);
                      setTimeout(() => setSitePublishSuccess(false), 3000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Salvar Configurações</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Cadastros de novos clientes e solicitações de orçamento serão direcionados para este e-mail.
                </p>
              </div>

              {/* Real Email Server Options (Resend API Key & SMTP) */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div>
                  <h5 className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>2. Servidor de Entrega de E-mail Real na Caixa de Entrada (Gratuito / Opcional):</span>
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Para garantir que os e-mails cheguem no Gmail/Outlook (sem ir para spam), você pode colar uma <strong>Chave API do Resend (Gratuito)</strong> ou seu <strong>Servidor SMTP</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Resend API Key Option */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        Opção A: Resend API (Recomendado - Grátis)
                      </span>
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-400 underline hover:text-blue-300"
                      >
                        Criar conta no Resend.com
                      </a>
                    </div>
                    <input
                      type="password"
                      value={editResendApiKey}
                      onChange={e => setEditResendApiKey(e.target.value)}
                      placeholder="Chave API Resend (ex: re_1234567...)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <p className="text-[9.5px] text-slate-300 leading-tight">
                      <strong>Dica de Uso no Resend:</strong> No plano de testes gratuito (onboarding), o Resend exige que o e-mail em <em>"1. Seu E-mail Principal"</em> acima seja <u>o mesmo e-mail</u> com o qual você se cadastrou no site do Resend.com. Para enviar para qualquer e-mail de destino, basta cadastrar e validar seu domínio no painel do Resend.
                    </p>
                  </div>

                  {/* SMTP Credentials Option */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2">
                    <span className="text-[11px] font-bold text-blue-400 block">
                      Opção B: Seu Servidor SMTP Personalizado
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editSmtpHost}
                        onChange={e => setEditSmtpHost(e.target.value)}
                        placeholder="Host SMTP (ex: smtp.gmail.com)"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px] outline-none"
                      />
                      <input
                        type="text"
                        value={editSmtpPort}
                        onChange={e => setEditSmtpPort(e.target.value)}
                        placeholder="Porta (ex: 587)"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editSmtpUser}
                        onChange={e => setEditSmtpUser(e.target.value)}
                        placeholder="Usuário / E-mail SMTP"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px] outline-none"
                      />
                      <input
                        type="password"
                        value={editSmtpPass}
                        onChange={e => setEditSmtpPass(e.target.value)}
                        placeholder="Senha do SMTP"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Real Email Dispatch Button */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-blue-300 block text-xs">
                    Testar Conexão e Disparo de E-mail Agora
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Envia um e-mail de teste imediato para <strong className="text-white font-mono">{editNotificationEmail}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isTestingEmail}
                  onClick={async () => {
                    setIsTestingEmail(true);
                    setTestEmailResult(null);
                    try {
                      const data = await sendEmailWithFallback({
                        endpoint: '/api/test-email',
                        recipientEmail: editNotificationEmail,
                        emailConfig: {
                          resendApiKey: editResendApiKey,
                          smtpHost: editSmtpHost,
                          smtpPort: editSmtpPort,
                          smtpUser: editSmtpUser,
                          smtpPass: editSmtpPass,
                          smtpFrom: editSmtpFrom
                        }
                      });

                      if (data.success && data.result?.delivered) {
                        setTestEmailResult({
                          success: true,
                          message: `✅ E-mail de teste ENTREGUE com sucesso para ${editNotificationEmail} via ${data.result.provider.toUpperCase()}!`
                        });
                      } else if (data.success) {
                        setTestEmailResult({
                          success: false,
                          message: `⚠️ E-mail processado no servidor. Cole a Chave API do Resend no campo acima e clique em 'Salvar Configurações' para envio direto.`
                        });
                      } else {
                        setTestEmailResult({
                          success: false,
                          message: `❌ Erro no teste: ${data.error || 'Verifique as credenciais.'}`
                        });
                      }
                    } catch (err: any) {
                      setTestEmailResult({
                        success: false,
                        message: `❌ Falha ao conectar ao servidor de e-mail: ${err.message || err}`
                      });
                    } finally {
                      setIsTestingEmail(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isTestingEmail ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Testando Envio...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar E-mail de Teste</span>
                    </>
                  )}
                </button>
              </div>

              {testEmailResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold ${
                    testEmailResult.success
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {testEmailResult.message}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">Novo Cliente Cadastrado</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> E-mail imediato
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">Nova Solicitação de Orçamento</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> E-mail imediato
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Toast Banner */}
          {sitePublishSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Site e aplicativo atualizados com sucesso no Cloud Firestore! Todos os visitantes verão o novo conteúdo imediatamente.</span>
              </div>
              <span className="text-[10px] opacity-80">{siteConfig?.lastUpdated}</span>
            </div>
          )}

          {/* Form & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Inputs Column */}
            <form onSubmit={handlePublishSite} className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-500" />
                  <span>Editar Textos do Cabeçalho e Hero</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Estes dados aparecem na página principal (Início) do site.
                </p>
              </div>

              <div className="space-y-4">
                {/* Logo Upload Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-blue-500" />
                      <span>Logo da Empresa / Marca</span>
                    </label>
                    {editLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditLogoUrl('')}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remover Logo</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Logo Preview Box */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 p-2 flex items-center justify-center shrink-0 relative group">
                      {editLogoUrl ? (
                        <img
                          src={editLogoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      ) : (
                        <div className="text-center space-y-1">
                          <Image className="w-7 h-7 text-slate-500 mx-auto" />
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">Sem Logo</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2 w-full">
                      <label className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-600/20">
                        <Upload className="w-4 h-4" />
                        <span>Enviar Imagem Direta do Computador</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp, image/svg+xml"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={editLogoUrl}
                          onChange={(e) => setEditLogoUrl(e.target.value)}
                          placeholder="Ou cole a URL da imagem (http/https)..."
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Suporta PNG, JPG, WEBP e SVG. Tamanho recomendado: até 500x200px.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Oficial da Agência / Empresa
                  </label>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge de Destaque no Topo do Hero
                  </label>
                  <input
                    type="text"
                    value={editHeroBadge}
                    onChange={(e) => setEditHeroBadge(e.target.value)}
                    required
                    placeholder="Ex: Cadastre-se e solicite seu orçamento online"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título Principal do Hero
                  </label>
                  <input
                    type="text"
                    value={editHeroTitle}
                    onChange={(e) => setEditHeroTitle(e.target.value)}
                    required
                    placeholder="Ex: Transformamos Ideias em Software de Alto Desempenho"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subtítulo Descritivo
                  </label>
                  <textarea
                    rows={3}
                    value={editHeroSubtitle}
                    onChange={(e) => setEditHeroSubtitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-normal text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Top Banner Control Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Banner de Alerta / Comunicado no Topo do Site</span>
                  </h3>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editIsAnnouncementActive} 
                      onChange={(e) => setEditIsAnnouncementActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {editIsAnnouncementActive ? 'Ativo' : 'Oculto'}
                    </span>
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    value={editAnnouncementBanner}
                    onChange={(e) => setEditAnnouncementBanner(e.target.value)}
                    placeholder="Texto da faixa de aviso no topo da navegação..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Canais Oficiais de Atendimento
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Telefone Principal
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      WhatsApp Comercial
                    </label>
                    <input
                      type="text"
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      E-mail Institucional
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Endereço da Sede
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">
                  Última edição: <strong className="text-slate-700 dark:text-slate-300">{siteConfig?.lastUpdated || 'Hoje'}</strong> por {siteConfig?.updatedBy || 'Admin'}
                </div>

                <button
                  type="submit"
                  disabled={isPublishingSite}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Globe className="w-4 h-4 animate-spin-slow" />
                  <span>{isPublishingSite ? 'Publicando alterações...' : '🚀 Publicar & Atualizar Site ao Vivo'}</span>
                </button>
              </div>

            </form>

            {/* Live Preview Card Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4 sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">Preview ao Vivo</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
                    https://site-ncodes.com
                  </span>
                </div>

                {/* Banner Preview */}
                {editIsAnnouncementActive && editAnnouncementBanner && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                    <span className="truncate">{editAnnouncementBanner}</span>
                  </div>
                )}

                {/* Header Preview */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-2">
                    {editLogoUrl ? (
                      <img src={editLogoUrl} alt="Logo" className="h-6 max-w-[80px] object-contain rounded" />
                    ) : null}
                    <span>{editCompanyName || 'NCodes Technologies'}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-600 text-white">Cadastre-se & Solicite</span>
                </div>

                {/* Hero Preview Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-[10px] font-bold text-cyan-400 uppercase">
                    ✨ {editHeroBadge || 'Badge Hero'}
                  </div>
                  <h4 className="text-lg font-black text-white leading-tight">
                    {editHeroTitle || 'Título Principal'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {editHeroSubtitle || 'Subtítulo do hero em tempo real...'}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <div className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-[11px]">
                      Cadastre-se e solicite seu orçamento
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p><strong>Atendimento:</strong> {editPhone} | {editWhatsapp}</p>
                  <p><strong>E-mail:</strong> {editEmail}</p>
                  <p className="text-[10px] opacity-75">{editAddress}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: GESTÃO DE SERVIÇOS DO SITE */}
      {activeTab === 'services' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>Gestão do Catálogo de Serviços • Tempo Real</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Serviços Oferecidos no Site
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Crie, edite e personalize os serviços exibidos na página pública de Serviços e no Portal do Cliente. As alterações são sincronizadas instantaneamente no banco Firestore.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveView('services')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Ver no Site Público</span>
              </button>
              <button
                onClick={handleOpenNewServiceModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Serviço</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Total de Serviços</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{services.length}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Prazos de Entrega</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">2 a 12 semanas</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Sincronização</p>
                <p className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Firestore On (Live)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => (
              <div 
                key={service.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                        <Code className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
                        <p className="text-[11px] text-slate-400">ID: {service.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditServiceModal(service)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-all cursor-pointer"
                        title="Editar Serviço"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteServiceConfirmId(service.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-all cursor-pointer"
                        title="Excluir Serviço"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Prazo Médio</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{service.avgTime}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Modalidade</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">Sob Orçamento</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Benefícios:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.benefits.map((b, i) => (
                          <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {service.technologies && service.technologies.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tecnologias:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.technologies.map((t, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/40 dark:border-blue-800/40">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Publicado no site</span>
                  <button
                    onClick={() => handleOpenEditServiceModal(service)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Editar Informações</span>
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
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

      {/* New Admin User Modal */}
      {showNewAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Incluir Administrador
                </h3>
                <p className="text-xs text-slate-500">
                  Cadastrar novo usuário com permissão de login
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={e => setNewAdminName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome de Usuário (Login)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="text-xs font-bold">@</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={newAdminUsername}
                    onChange={e => setNewAdminUsername(e.target.value)}
                    placeholder="carlos_admin (não utilizar e-mail)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Este será o login para acesso na tela de cadeado.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={newAdminPassword}
                    onChange={e => setNewAdminPassword(e.target.value)}
                    placeholder="SuaSenhaSegura123"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cargo / Título
                </label>
                <select
                  value={newAdminRoleTitle}
                  onChange={e => setNewAdminRoleTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="Administrador Master">Administrador Master</option>
                  <option value="Gerente de Operações">Gerente de Operações</option>
                  <option value="Administrador Financeiro">Administrador Financeiro</option>
                  <option value="Tech Lead / DevOps">Tech Lead / DevOps</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAdminModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Admin</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* New Client Subscription Modal */}
      {showNewSubModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-emerald-500" />
                  <span>Cadastrar Nova Mensalidade Recorrente</span>
                </h3>
                <p className="text-xs text-slate-500">Contrato de serviço contínuo com cobrança automática recorrente.</p>
              </div>
              <button
                onClick={() => setShowNewSubModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-4">
              {/* Select Client Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Selecionar Cliente Cadastrado *</span>
                  {selectedSubClientId && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Vinculado
                    </span>
                  )}
                </label>
                <select
                  value={selectedSubClientId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedSubClientId(id);
                    if (id === 'custom') {
                      setSubClientName('');
                      setSubClientEmail('');
                    } else if (id) {
                      const found = clientUsers.find(c => c.id === id);
                      if (found) {
                        setSubClientName(found.company ? `${found.name} (${found.company})` : found.name);
                        setSubClientEmail(found.email);
                      }
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Escolha um cliente da base cadastrada --</option>
                  {clientUsers.map(client => (
                    <option key={client.id} value={client.id}>
                      👤 {client.name} {client.company ? `• ${client.company}` : ''} ({client.email})
                    </option>
                  ))}
                  <option value="custom">✏️ Digitar outro cliente manualmente...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Cliente / Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={subClientName}
                  onChange={e => setSubClientName(e.target.value)}
                  placeholder="Ex: Farmácia Vida & Saúde LTDA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail do Cliente (para acesso no portal)
                </label>
                <input
                  type="email"
                  value={subClientEmail}
                  onChange={e => setSubClientEmail(e.target.value)}
                  placeholder="contato@farmaciavida.com.br"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Serviço / Nome do Plano Contratado *
                </label>
                <input
                  type="text"
                  required
                  value={subServiceName}
                  onChange={e => setSubServiceName(e.target.value)}
                  placeholder="Ex: Sustentação de App Mobile & Hospedagem AWS VIP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Valor Mensal (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={subMonthlyValue}
                    onChange={e => setSubMonthlyValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dia de Vencimento *
                  </label>
                  <select
                    value={subBillingCycleDay}
                    onChange={e => setSubBillingCycleDay(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={5}>Dia 05</option>
                    <option value={10}>Dia 10</option>
                    <option value={15}>Dia 15</option>
                    <option value={20}>Dia 20</option>
                    <option value={25}>Dia 25</option>
                    <option value={30}>Dia 30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Forma Principal
                  </label>
                  <select
                    value={subPaymentMethod}
                    onChange={e => setSubPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 uppercase"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="transferencia">Transferência</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Observações / Escopo do Contrato
                </label>
                <textarea
                  rows={2}
                  value={subNotes}
                  onChange={e => setSubNotes(e.target.value)}
                  placeholder="Ex: Inclui até 8 horas de manutenção mensal e monitoramento de servidores 24/7."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewSubModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Ativar Mensalidade</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXCLUSIVO PARA ALTERAR MENSALIDADE DO CLIENTE */}
      {showEditSubModal && editingSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span>Painel Restrito • Alteração de Mensalidade</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Alterar Valores de {editingSub.clientName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowEditSubModal(false);
                  setEditingSub(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSub} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Modalidade de Cobrança
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditSubBillingType('recorrente')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      editSubBillingType === 'recorrente'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Mensalidade Recorrente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditSubBillingType('valor_unico')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      editSubBillingType === 'valor_unico'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Valor Final Único</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Cliente / Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={editSubClientName}
                    onChange={e => setEditSubClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail do Cliente
                  </label>
                  <input
                    type="email"
                    value={editSubClientEmail}
                    onChange={e => setEditSubClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Serviço / Plano Contratado
                </label>
                <input
                  type="text"
                  required
                  value={editSubServiceName}
                  onChange={e => setEditSubServiceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {editSubBillingType === 'recorrente' ? 'Valor Mensal (R$)' : 'Valor da Parcela (R$)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editSubMonthlyValue}
                    onChange={e => setEditSubMonthlyValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold"
                  />
                </div>

                {editSubBillingType === 'valor_unico' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Valor Final Único (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editSubOneTimeTotalValue}
                      onChange={e => setEditSubOneTimeTotalValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-purple-600 dark:text-purple-400 font-extrabold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dia Vencimento
                  </label>
                  <select
                    value={editSubBillingCycleDay}
                    onChange={e => setEditSubBillingCycleDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={5}>Dia 05</option>
                    <option value={10}>Dia 10</option>
                    <option value={15}>Dia 15</option>
                    <option value={20}>Dia 20</option>
                    <option value={25}>Dia 25</option>
                    <option value={30}>Dia 30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status do Contrato
                  </label>
                  <select
                    value={editSubStatus}
                    onChange={e => setEditSubStatus(e.target.value as SubscriptionStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white uppercase"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inadimplente">Inadimplente</option>
                    <option value="suspenso">Suspenso</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Observações / Notas do Contrato
                </label>
                <textarea
                  rows={2}
                  value={editSubNotes}
                  onChange={e => setEditSubNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSubModal(false);
                    setEditingSub(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Alterações de Mensalidade</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: CADASTRAR / EDITAR CLIENTE */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  <UserPlus className="w-4 h-4 text-blue-500" />
                  <span>{editingClient ? 'Editar Cadastro de Cliente' : 'Novo Cadastro de Cliente'}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {editingClient ? editingClient.name : 'Incluir Cliente no Sistema'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddClientModal(false);
                  setEditingClient(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientFormName}
                    onChange={e => setClientFormName(e.target.value)}
                    placeholder="Ex: Ana Clara Souza"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail do Cliente *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientFormEmail}
                    onChange={e => setClientFormEmail(e.target.value)}
                    placeholder="cliente@empresa.com.br"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Empresa / Razão Social
                  </label>
                  <input
                    type="text"
                    value={clientFormCompany}
                    onChange={e => setClientFormCompany(e.target.value)}
                    placeholder="Ex: Tech Solutions Ltda"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={clientFormPhone}
                    onChange={e => setClientFormPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={clientFormCity}
                    onChange={e => setClientFormCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={clientFormState}
                    onChange={e => setClientFormState(e.target.value)}
                    placeholder="Ex: SP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Senha de Acesso ao Portal {editingClient && '(deixe em branco para manter a atual)'}
                </label>
                <input
                  type="text"
                  value={clientFormPassword}
                  onChange={e => setClientFormPassword(e.target.value)}
                  placeholder={editingClient ? '••••••••' : 'Digite a senha de acesso'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddClientModal(false);
                    setEditingClient(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DO CLIENTE */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 uppercase">
                  {viewingClient.avatar ? (
                    <img src={viewingClient.avatar} alt={viewingClient.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    viewingClient.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {viewingClient.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {viewingClient.company || 'Pessoa Física'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {viewingClient.email} • {viewingClient.phone || 'Sem telefone'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingClient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Localização</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {viewingClient.city ? `${viewingClient.city} - ${viewingClient.state || ''}` : 'Não informada'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Data de Cadastro</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {viewingClient.createdAt ? new Date(viewingClient.createdAt).toLocaleDateString('pt-BR') : 'Recente'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase block">Projetos</span>
                <p className="font-black text-blue-600 dark:text-blue-400 text-sm mt-0.5">
                  {projects.filter(p => p.clientName.toLowerCase() === viewingClient.name.toLowerCase() || p.clientName.toLowerCase() === viewingClient.company?.toLowerCase()).length}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Mensalidades</span>
                <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {subscriptions.filter(s => s.clientName.toLowerCase() === viewingClient.name.toLowerCase() || s.clientName.toLowerCase() === viewingClient.company?.toLowerCase()).length}
                </p>
              </div>
            </div>

            {/* Linked Projects */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-blue-500" />
                <span>Projetos Vinculados ao Cliente</span>
              </h4>
              {projects.filter(p => p.clientName.toLowerCase() === viewingClient.name.toLowerCase() || p.clientName.toLowerCase() === viewingClient.company?.toLowerCase()).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                  Nenhum projeto encontrado para este cliente.
                </div>
              ) : (
                <div className="space-y-2">
                  {projects
                    .filter(p => p.clientName.toLowerCase() === viewingClient.name.toLowerCase() || p.clientName.toLowerCase() === viewingClient.company?.toLowerCase())
                    .map(proj => (
                      <div key={proj.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{proj.title}</p>
                          <p className="text-[10px] text-slate-500">Valor: R$ {proj.totalValue.toLocaleString('pt-BR')} • Prazo: {proj.deadline}</p>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                          {proj.status === 'em_andamento' ? 'Em Andamento' : proj.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Linked Subscriptions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-emerald-500" />
                <span>Contratos de Mensalidade</span>
              </h4>
              {subscriptions.filter(s => s.clientName.toLowerCase() === viewingClient.name.toLowerCase() || s.clientName.toLowerCase() === viewingClient.company?.toLowerCase()).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                  Nenhuma mensalidade encontrada para este cliente.
                </div>
              ) : (
                <div className="space-y-2">
                  {subscriptions
                    .filter(s => s.clientName.toLowerCase() === viewingClient.name.toLowerCase() || s.clientName.toLowerCase() === viewingClient.company?.toLowerCase())
                    .map(sub => (
                      <div key={sub.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{sub.serviceName}</p>
                          <p className="text-[10px] text-slate-500">
                            R$ {sub.monthlyValue.toLocaleString('pt-BR')}/mês • Vencimento: Dia {sub.billingCycleDay}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          sub.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Linked Quotes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Orçamentos Solicitados</span>
              </h4>
              {quotes.filter(q => q.clientName.toLowerCase() === viewingClient.name.toLowerCase() || q.email.toLowerCase() === viewingClient.email.toLowerCase()).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                  Nenhum orçamento registrado para este e-mail/cliente.
                </div>
              ) : (
                <div className="space-y-2">
                  {quotes
                    .filter(q => q.clientName.toLowerCase() === viewingClient.name.toLowerCase() || q.email.toLowerCase() === viewingClient.email.toLowerCase())
                    .map(quote => (
                      <div key={quote.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Orçamento #{quote.id}</p>
                          <p className="text-[10px] text-slate-500">{quote.description.slice(0, 60)}...</p>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
                          {quote.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingClient(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
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

      {/* Service Modal Form (Add / Edit) */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {editingService ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingService ? `Alterando dados do serviço ID ${editingService.id}` : 'Insira os dados do serviço para exibir no site'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Desenvolvimento de Apps Mobile iOS & Android"
                  value={serviceTitle}
                  onChange={e => setServiceTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição Completa *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva detalhadamente a solução tecnológica..."
                  value={serviceDescription}
                  onChange={e => setServiceDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prazo Médio de Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 4 a 8 semanas"
                    value={serviceAvgTime}
                    onChange={e => setServiceAvgTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Modelo de Orçamento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sob Orçamento / Sob Consulta"
                    value={serviceStartingPrice}
                    onChange={e => setServiceStartingPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Benefícios (separados por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Código único para iOS & Android, Interface Material Design, Sincronização em Tempo Real"
                  value={serviceBenefitsInput}
                  onChange={e => setServiceBenefitsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tecnologias Utilizadas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Flutter, Dart, Firebase, REST/GraphQL"
                  value={serviceTechnologiesInput}
                  onChange={e => setServiceTechnologiesInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingService ? 'Salvar Alterações' : 'Criar Serviço'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Deletion Confirm Modal */}
      {deleteServiceConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Excluir Serviço</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tem certeza que deseja excluir este serviço? Ele deixará de ser exibido imediatamente no catálogo público do site.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteServiceConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await deleteService(deleteServiceConfirmId);
                  setDeleteServiceConfirmId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-rose-500/20"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Quote Positioning Modal */}
      {positioningQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setPositioningQuote(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enviar Posicionamento ao Cliente
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Orçamento <strong className="text-blue-600 font-mono">#{positioningQuote.id}</strong> • {positioningQuote.clientName} ({positioningQuote.company})
                </p>
              </div>
            </div>

            {positionSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{positionSuccessMsg}</span>
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSendingPosition(true);
                await updateQuoteStatus(positioningQuote.id, positionStatus, positionMessage.trim());
                setIsSendingPosition(false);
                setPositionSuccessMsg(`Posicionamento e e-mail enviados com sucesso para ${positioningQuote.email}!`);
                setTimeout(() => {
                  setPositionSuccessMsg(null);
                  setPositioningQuote(null);
                }, 2200);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail do Cliente (Destinatário):
                </label>
                <input
                  type="text"
                  disabled
                  value={positioningQuote.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Novo Status do Orçamento:
                </label>
                <select
                  value={positionStatus}
                  onChange={e => setPositionStatus(e.target.value as QuoteStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold outline-none"
                >
                  <option value="solicitado">Solicitado</option>
                  <option value="em_analise">Em Análise Técnica</option>
                  <option value="em_elaboracao">Em Elaboração de Proposta</option>
                  <option value="proposta_enviada">Proposta Emitida / Enviada</option>
                  <option value="em_negociacao">Em Negociação</option>
                  <option value="aprovado">Aprovado / Em Execução</option>
                  <option value="rejeitado">Recusado</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mensagem / Parecer Técnico para o Cliente:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ex: Prezado cliente, analisamos seu projeto. Nossa equipe técnica deu início à elaboração da arquitetura e em breve enviaremos a proposta..."
                  value={positionMessage}
                  onChange={e => setPositionMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Sua mensagem será enviada por e-mail com a confirmação e o posicionamento oficial da empresa.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPositioningQuote(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSendingPosition}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSendingPosition ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando E-mail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar E-mail ao Cliente</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
