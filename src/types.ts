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
  | 'em_elaboracao' 
  | 'proposta_enviada' 
  | 'em_negociacao' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'cancelado';

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
  aiAnalysis?: {
    recommendedTech: string[];
    estimatedHours: number;
    suggestedBudget: number;
    complexity: 'Baixa' | 'Média' | 'Alta';
    summary: string;
  };
  proposalId?: string;
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
  contractText: string;
  status: 'pendente' | 'aceito' | 'rejeitado';
  createdAt: string;
  acceptedAt?: string;
  clientIp?: string;
  clientDevice?: string;
  signatureName?: string;
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
  billingType?: 'recorrente' | 'valor_unico';
  oneTimeTotalValue?: number;
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
  address: string;
  announcementBanner: string;
  isAnnouncementActive: boolean;
  primaryColor: string;
  maintenanceMode: boolean;
  lastUpdated: string;
  updatedBy: string;
}
