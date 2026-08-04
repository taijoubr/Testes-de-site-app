export type UserRole = 
  | 'admin' 
  | 'manager' 
  | 'financial' 
  | 'developer' 
  | 'designer' 
  | 'support' 
  | 'client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  company?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string; // Login exclusivo por nome de usuário (não e-mail)
  passwordHash: string; // Senha de acesso
  roleTitle: string;
  createdAt: string;
  addedBy: string;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  passwordHash: string;
  createdAt: string;
  avatar?: string;
  city?: string;
  state?: string;
}

export type QuoteStatus = 
  | 'solicitado' 
  | 'em_analise' 
  | 'aguardando_informacoes'
  | 'orcamento_disponivel'
  | 'proposta_enviada' 
  | 'em_negociacao' 
  | 'aprovado' 
  | 'recusado'
  | 'rejeitado' 
  | 'cancelado';

export interface QuoteAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedRole: 'admin' | 'client';
  createdAt: string;
  url: string;
}

export interface QuoteTimelineItem {
  id: string;
  timestamp: string;
  dateStr?: string;
  timeStr?: string;
  user: string;
  userRole: 'admin' | 'client' | 'system';
  statusChangedTo?: QuoteStatus;
  statusLabel?: string;
  notes: string;
  attachments?: QuoteAttachment[];
}

export interface QuoteVersion {
  versionNumber: number;
  updatedAt: string;
  updatedBy: string;
  value?: number;
  estimatedDays?: string;
  paymentTerms?: string;
  notes?: string;
}

export interface PaymentConditions {
  paymentType: 'entrada_parcelamento' | 'vista' | 'parcelado_sem_entrada';
  downPaymentPercent?: number; // e.g. 30 for 30%
  downPaymentValue?: number;   // calculated or overridden R$ value
  installmentsCount?: number;  // e.g. 3 for 3x
  installmentValue?: number;   // R$ per installment
  paymentMethod?: string;      // Pix, Boleto, Cartao
}

export interface CounterProposal {
  id: string;
  createdAt: string;
  clientName: string;
  clientEmail?: string;
  proposedTotalValue: number;
  proposedPaymentType?: 'entrada_parcelamento' | 'vista' | 'parcelado_sem_entrada';
  proposedDownPaymentPercent?: number;
  proposedDownPaymentValue?: number;
  proposedInstallmentsCount?: number;
  notes: string;
  status: 'pendente' | 'aceita' | 'recusada';
  reviewedAt?: string;
  adminResponse?: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  projectType: string;
  description: string;
  deadline: string;
  budgetRange: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  projectTitle?: string;
  category?: string;
  selectedFeatures?: string[];
  references?: string;
  additionalNotes?: string;
  isImprovement?: boolean;
  parentProjectId?: string;
  parentProjectTitle?: string;
  urgency?: string;
  
  // Responsável e Valores Oferecidos
  assignedTo?: string;
  assignedToName?: string;
  assignedToRole?: string;
  
  offeredValue?: number;
  recurringMonthlyValue?: number;
  offeredDeadline?: string;
  paymentTerms?: string;
  paymentConditions?: PaymentConditions;
  counterProposal?: CounterProposal;
  scopeItems?: string[];
  refusalReason?: string;
  
  // Anexos, Linha do Tempo e Versões
  attachments?: QuoteAttachment[];
  timeline?: QuoteTimelineItem[];
  versions?: QuoteVersion[];

  aiAnalysis?: {
    recommendedTech: string[];
    estimatedHours: number;
    suggestedBudget: number;
    complexity: 'Baixa' | 'Média' | 'Alta';
    summary: string;
  };
  proposalId?: string;
  convertedProjectId?: string;
  contractId?: string;
  contractNumber?: string;
}

export interface ProposalDeliverable {
  phase: string;
  duration: string;
  deliverable: string;
}

export interface Proposal {
  id: string;
  quoteId: string;
  title: string;
  clientName: string;
  company: string;
  description: string;
  scope: string[];
  schedule: ProposalDeliverable[];
  totalValue: number;
  recurringMonthlyValue?: number;
  paymentTerms: string;
  paymentConditions?: PaymentConditions;
  counterProposal?: CounterProposal;
  contractText: string;
  status: 'pendente' | 'aceito' | 'rejeitado';
  createdAt: string;
  acceptedAt?: string;
  clientIp?: string;
  clientDevice?: string;
  signatureName?: string;
  contractId?: string;
  contractNumber?: string;
}

export interface ContractInstallment {
  number: number;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pendente' | 'pago' | 'atrasado';
}

export interface ContractHistoryItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  version: string;
}

export interface ContractSignatureInfo {
  signed: boolean;
  signerName?: string;
  signerDocument?: string;
  signerEmail?: string;
  signedAt?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  digitalHash?: string;
  contractorName?: string;
  contractorSignedAt?: string;
  externalProvider?: 'internal' | 'docusign' | 'clicksign' | 'zapsign';
  externalStatus?: string;
}

export interface ServiceContract {
  id: string; // e.g. CTR-2026-001
  contractNumber: string;
  quoteId: string;
  proposalId?: string;
  projectId?: string;
  
  // Contratada (NCodes)
  contractor: {
    companyName: string;
    cnpj: string;
    email: string;
    phone: string;
    address: string;
    jurisdiction: string;
    legalRepresentative: string;
  };

  // Contratante (Cliente)
  client: {
    fullName: string;
    companyName: string;
    cpfCnpj: string;
    phone: string;
    email: string;
    legalRepresentative: string;
  };

  // Informações do Projeto / Orçamento
  projectTitle: string;
  category: string;
  description: string;
  approvedScope: string[];
  contractedFeatures: string[];
  
  // Condições Financeiras
  totalValue: number;
  entryValue: number;
  recurringMonthlyValue?: number;
  monthlyDueDate?: string;
  paymentMethod: string;
  paymentTerms: string;
  installments: ContractInstallment[];
  lateFeeClause: string;

  // Prazos
  estimatedDays: number | string;
  startDate: string;
  estimatedDeliveryDate: string;

  // Cláusulas detalhadas
  objectClause: string;
  scopeClause: string;
  contractorObligations: string[];
  clientObligations: string[];
  paymentClause: string;
  changesAndExtraScopeClause: string;
  timelineClause: string;
  warrantyClause: string;
  warrantyDays: number;
  terminationClause: string;
  jurisdictionClause: string;

  // Assinatura Eletrônica
  signature: ContractSignatureInfo;

  // Metadata / Histórico
  status: 'rascunho' | 'aguardando_assinatura' | 'assinado' | 'cancelado';
  createdAt: string;
  version: string;
  history: ContractHistoryItem[];
  pdfUrl?: string;
  qrCodeValue?: string;
}

export type ProjectStatus = 'planejamento' | 'em_andamento' | 'em_revisao' | 'concluido' | 'pausado';

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  category: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  type: 'pdf' | 'doc' | 'image' | 'code' | 'zip';
  url: string;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  category: string;
  description: string;
  status: ProjectStatus;
  progressPercentage: number;
  estimatedHours: number;
  completedHours: number;
  team: string[];
  technologies: string[];
  startDate: string;
  endDate: string;
  tasks: ProjectTask[];
  files: ProjectFile[];
  proposalId?: string;
  recurringMonthlyValue?: number;
  subscriptionId?: string;
  contractId?: string;
  contractNumber?: string;
  completedAt?: string;
  billingRuleApplied?: string;
}

export type FinancialStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado' | 'reembolsado';

export type SubscriptionStatus = 'ativo' | 'inadimplente' | 'suspenso' | 'cancelado';

export interface ClientSubscription {
  id: string;
  clientName: string;
  clientEmail?: string;
  serviceName: string;
  monthlyValue: number;
  billingCycleDay: number;
  status: SubscriptionStatus;
  startDate: string;
  nextDueDate: string;
  paymentMethod: 'pix' | 'cartao' | 'boleto' | 'transferencia';
  notes?: string;
  lastPaymentDate?: string;
  pixCopyPaste?: string;
  proposalId?: string;
  quoteId?: string;
  projectId?: string;
  billingType?: 'recorrente' | 'valor_unico';
  oneTimeTotalValue?: number;
  entityType?: 'empresa' | 'cliente';
  category?: string;
  entryType?: 'receita' | 'despesa';
}

export interface FinancialTransaction {
  id: string;
  title: string;
  type: 'receita' | 'despesa';
  category: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: FinancialStatus;
  paymentMethod: 'pix' | 'cartao' | 'transferencia' | 'dinheiro' | 'boleto';
  clientName?: string;
  projectId?: string;
  subscriptionId?: string;
  invoiceUrl?: string;
  isRecurring?: boolean;
  entityType?: 'empresa' | 'cliente';
}

export interface ChatAttachment {
  name: string;
  type: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  projectId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  isAudio?: boolean;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_atendimento' | 'resolvido' | 'fechado';
  clientName: string;
  createdAt: string;
  messagesCount: number;
  lastUpdate: string;
}

export interface LeadCRM {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: 'prospeccao' | 'qualificacao' | 'proposta' | 'fechamento' | 'ganho' | 'perdido';
  value: number;
  nextFollowUp: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  metrics?: string;
  clientName: string;
  year: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  shortDesc: string;
  description: string;
  benefits: string[];
  technologies: string[];
  avgTime: string;
  startingPrice: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'quote' | 'proposal' | 'payment' | 'project' | 'chat' | 'ticket';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface QuoteCategoryOption {
  id: string;
  label: string;
  desc?: string;
  hidden?: boolean;
}

export interface QuoteFeatureOption {
  id: string;
  label: string;
  hidden?: boolean;
}

export interface SiteConfig {
  id: string;
  companyName: string;
  logoUrl?: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  whatsapp: string;
  email: string;
  notificationEmail?: string;
  resendApiKey?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
  address: string;
  announcementBanner: string;
  isAnnouncementActive: boolean;
  primaryColor: string;
  maintenanceMode: boolean;
  quoteCategories?: QuoteCategoryOption[];
  quoteFeatures?: QuoteFeatureOption[];
  lastUpdated: string;
  updatedBy: string;
}
