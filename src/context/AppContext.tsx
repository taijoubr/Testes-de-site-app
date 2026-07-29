import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendEmailWithFallback } from '../utils/emailService';
import confetti from 'canvas-confetti';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const saveDoc = async (colName: string, id: string, data: any) => {
  const sanitized = JSON.parse(JSON.stringify(data));
  await setDoc(doc(db, colName, id), sanitized);
};
import { 
  QuoteRequest, 
  QuoteAttachment,
  QuoteTimelineItem,
  QuoteVersion,
  Proposal, 
  Project, 
  FinancialTransaction, 
  ChatMessage, 
  SupportTicket, 
  LeadCRM, 
  UserProfile,
  NotificationItem,
  UserRole,
  QuoteStatus,
  AdminUser,
  ClientUser,
  ClientSubscription,
  SubscriptionStatus,
  SiteConfig,
  ServiceItem,
  ServiceContract,
  ContractInstallment,
  PortfolioProject
} from '../types';

import { 
  INITIAL_QUOTES, 
  INITIAL_PROPOSALS, 
  INITIAL_PROJECTS, 
  INITIAL_FINANCIALS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_TICKETS, 
  INITIAL_LEADS, 
  TEAM_MEMBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_CLIENT_USERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SITE_CONFIG,
  INITIAL_SERVICES,
  INITIAL_CONTRACTS,
  INITIAL_PORTFOLIO
} from '../data/initialData';

export type ActiveView = 
  | 'home' 
  | 'services' 
  | 'portfolio' 
  | 'about' 
  | 'contact' 
  | 'quote_wizard' 
  | 'proposal_accept' 
  | 'client_portal' 
  | 'client_auth'
  | 'admin_panel' 
  | 'admin_login'
  | 'mobile_sim';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedQuoteIdForProposal?: string;
  setSelectedQuoteIdForProposal: (id?: string) => void;
  selectedProposalIdForAcceptance?: string;
  setSelectedProposalIdForAcceptance: (id?: string) => void;
  selectedProjectId?: string;
  setSelectedProjectId: (id?: string) => void;
  selectedContractId?: string;
  setSelectedContractId: (id?: string) => void;
  
  // Theme & User
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  mobileSimDevice: 'iphone' | 'android';
  setMobileSimDevice: (device: 'iphone' | 'android') => void;

  // Admin Auth State
  isAdminAuthenticated: boolean;
  currentAdminUser: AdminUser | null;
  adminUsers: AdminUser[];
  loginAdmin: (username: string, pass: string) => boolean;
  logoutAdmin: () => void;
  addAdminUser: (data: Omit<AdminUser, 'id' | 'createdAt' | 'addedBy'>) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;

  // Client Auth State
  isClientAuthenticated: boolean;
  currentClientUser: ClientUser | null;
  clientUsers: ClientUser[];
  loginClient: (email: string, pass: string) => boolean;
  checkEmailExists: (email: string) => boolean;
  registerClient: (data: Omit<ClientUser, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  addClientUser: (data: Omit<ClientUser, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateClientUser: (id: string, data: Partial<ClientUser>) => Promise<void>;
  deleteClientUser: (id: string) => Promise<void>;
  logoutClient: () => void;

  // Site Management Config
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfigData: Partial<SiteConfig>) => Promise<void>;

  // Services Catalog
  services: ServiceItem[];
  addService: (data: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, data: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Portfolio Management
  portfolioProjects: PortfolioProject[];
  addPortfolioProject: (data: Omit<PortfolioProject, 'id'>) => Promise<void>;
  updatePortfolioProject: (id: string, data: Partial<PortfolioProject>) => Promise<void>;
  deletePortfolioProject: (id: string) => Promise<void>;

  // Data collections
  quotes: QuoteRequest[];
  proposals: Proposal[];
  projects: Project[];
  contracts: ServiceContract[];
  financials: FinancialTransaction[];
  subscriptions: ClientSubscription[];
  chatMessages: ChatMessage[];
  tickets: SupportTicket[];
  leads: LeadCRM[];
  notifications: NotificationItem[];

  // Actions
  createQuoteRequest: (data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<QuoteRequest>;
  createProposal: (data: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => Proposal;
  acceptProposal: (proposalId: string, signatureName: string) => Promise<void>;
  generateContractForQuote: (quoteId: string, customData?: any) => Promise<ServiceContract>;
  signContract: (contractId: string, signatureData: { signerName: string; signerDocument: string; signerEmail?: string }) => Promise<void>;
  deleteContract: (contractId: string) => Promise<void>;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus, customMessage?: string) => Promise<void>;
  updateQuoteDetails: (quoteId: string, updates: Partial<QuoteRequest>, notes?: string) => Promise<void>;
  addQuoteTimelineItem: (quoteId: string, notes: string, user?: string, userRole?: 'admin' | 'client' | 'system', statusChangedTo?: QuoteStatus) => Promise<void>;
  addQuoteAttachment: (quoteId: string, attachment: Omit<QuoteAttachment, 'id' | 'createdAt'>) => Promise<void>;
  approveQuoteByClient: (quoteId: string) => Promise<void>;
  refuseQuoteByClient: (quoteId: string, reason?: string) => Promise<void>;
  requestQuoteChangesByClient: (quoteId: string, changeRequestText: string) => Promise<void>;
  respondToQuoteRequest: (quoteId: string, responseText: string) => Promise<void>;
  convertQuoteToProject: (quoteId: string) => Promise<string | undefined>;
  deleteQuote: (quoteId: string) => Promise<void>;
  deleteProposal: (proposalId: string) => Promise<void>;
  
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectHours: (projectId: string, hours: number) => void;
  addProjectFile: (projectId: string, fileName: string, size: string, type: 'pdf' | 'doc' | 'image' | 'code' | 'zip') => void;
  finalizeProjectAndStartSubscription: (projectId: string, customMonthlyValue?: number, completionDateInput?: string) => Promise<{ ruleApplied: string; firstChargeAmount: number; nextDueDate: string; subscriptionId: string; } | null>;
  deleteProject: (projectId: string) => Promise<void>;
  
  addFinancialTransaction: (data: Omit<FinancialTransaction, 'id'>) => void;
  updateFinancialStatus: (id: string, status: FinancialTransaction['status'], customPaymentDate?: string) => Promise<void>;
  deleteFinancialTransaction: (id: string) => Promise<void>;

  // Subscriptions & Monthly Fees Actions
  addSubscription: (data: Omit<ClientSubscription, 'id'>) => Promise<void>;
  updateSubscription: (subId: string, data: Partial<ClientSubscription>) => Promise<void>;
  updateSubscriptionStatus: (subId: string, status: SubscriptionStatus, nextDueDate?: string, lastPaymentDate?: string) => Promise<void>;
  deleteSubscription: (subId: string) => Promise<void>;
  generateSubscriptionBilling: (subId: string) => Promise<void>;
  manualSettleSubscription: (subId: string, customPaymentDate?: string) => Promise<void>;
  
  sendChatMessage: (text: string, projectId?: string, attachments?: { name: string; type: string; url: string }[], isAudio?: boolean) => void;
  createSupportTicket: (title: string, category: string, priority: SupportTicket['priority']) => void;
  updateLeadStage: (leadId: string, stage: LeadCRM['stage']) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedQuoteIdForProposal, setSelectedQuoteIdForProposal] = useState<string | undefined>();
  const [selectedProposalIdForAcceptance, setSelectedProposalIdForAcceptance] = useState<string | undefined>(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [selectedContractId, setSelectedContractId] = useState<string | undefined>(undefined);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEAM_MEMBERS[0]); // Default Admin
  const [mobileSimDevice, setMobileSimDevice] = useState<'iphone' | 'android'>('iphone');

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('ncodes_admin_user');
  });
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('ncodes_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);

  // Client Auth State
  const [isClientAuthenticated, setIsClientAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('ncodes_client_user');
  });
  const [currentClientUser, setCurrentClientUser] = useState<ClientUser | null>(() => {
    try {
      const saved = localStorage.getItem('ncodes_client_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [clientUsers, setClientUsers] = useState<ClientUser[]>(INITIAL_CLIENT_USERS);

  // Sync session state changes to localStorage
  useEffect(() => {
    if (currentClientUser) {
      localStorage.setItem('ncodes_client_user', JSON.stringify(currentClientUser));
      setIsClientAuthenticated(true);
    } else {
      localStorage.removeItem('ncodes_client_user');
      setIsClientAuthenticated(false);
    }
  }, [currentClientUser]);

  useEffect(() => {
    if (currentAdminUser) {
      localStorage.setItem('ncodes_admin_user', JSON.stringify(currentAdminUser));
      setIsAdminAuthenticated(true);
    } else {
      localStorage.removeItem('ncodes_admin_user');
      setIsAdminAuthenticated(false);
    }
  }, [currentAdminUser]);

  // Site Configuration State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);

  // State collections
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [contracts, setContracts] = useState<ServiceContract[]>(INITIAL_CONTRACTS);
  const [financials, setFinancials] = useState<FinancialTransaction[]>(INITIAL_FINANCIALS);
  const [subscriptions, setSubscriptions] = useState<ClientSubscription[]>(INITIAL_SUBSCRIPTIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [leads, setLeads] = useState<LeadCRM[]>(INITIAL_LEADS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Firestore Realtime Sync Effect
  useEffect(() => {
    const seedAndSubscribe = async () => {
      // 1. Quotes
      const unsubQuotes = onSnapshot(collection(db, 'quotes'), (snap) => {
        const list = snap.docs.map(d => d.data() as QuoteRequest);
        setQuotes(list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

      // 2. Proposals
      const unsubProposals = onSnapshot(collection(db, 'proposals'), (snap) => {
        setProposals(snap.docs.map(d => d.data() as Proposal));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'proposals'));

      // 3. Projects
      const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
        setProjects(snap.docs.map(d => d.data() as Project));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'projects'));

      // 4. Financials
      const unsubFinancials = onSnapshot(collection(db, 'financials'), (snap) => {
        setFinancials(snap.docs.map(d => d.data() as FinancialTransaction));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'financials'));

      // 5. Chat Messages
      const unsubChat = onSnapshot(collection(db, 'chatMessages'), (snap) => {
        const msgs = snap.docs.map(d => d.data() as ChatMessage);
        setChatMessages(msgs);
      }, (err) => handleFirestoreError(err, OperationType.GET, 'chatMessages'));

      // 6. Tickets
      const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
        setTickets(snap.docs.map(d => d.data() as SupportTicket));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'tickets'));

      // 7. Leads
      const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
        setLeads(snap.docs.map(d => d.data() as LeadCRM));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'leads'));

      // 8. Notifications
      const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snap) => {
        setNotifications(snap.docs.map(d => d.data() as NotificationItem));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'notifications'));

      // 9. Admin Users
      try {
        const admSnap = await getDocs(collection(db, 'adminUsers'));
        if (admSnap.empty) {
          await setDoc(doc(db, 'adminUsers', INITIAL_ADMIN_USERS[0].id), INITIAL_ADMIN_USERS[0]);
        }
      } catch (err) {
        console.warn('AdminUsers setup warning:', err);
      }

      const unsubAdminUsers = onSnapshot(collection(db, 'adminUsers'), (snap) => {
        if (!snap.empty) {
          setAdminUsers(snap.docs.map(d => d.data() as AdminUser));
        } else {
          setAdminUsers(INITIAL_ADMIN_USERS);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'adminUsers'));

      // 10. Client Users
      const unsubClientUsers = onSnapshot(collection(db, 'clientUsers'), (snap) => {
        setClientUsers(snap.docs.map(d => d.data() as ClientUser));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'clientUsers'));

      // 11. Site Settings
      try {
        const siteSnap = await getDocs(collection(db, 'siteSettings'));
        if (siteSnap.empty) {
          await setDoc(doc(db, 'siteSettings', 'main'), INITIAL_SITE_CONFIG);
        }
      } catch (err) {
        console.warn('SiteSettings check warning:', err);
      }

      const unsubSiteSettings = onSnapshot(doc(db, 'siteSettings', 'main'), (snap) => {
        if (snap.exists()) {
          setSiteConfig(snap.data() as SiteConfig);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'siteSettings'));

      // 12. Client Subscriptions
      const unsubSubscriptions = onSnapshot(collection(db, 'clientSubscriptions'), (snap) => {
        setSubscriptions(snap.docs.map(d => d.data() as ClientSubscription));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'clientSubscriptions'));

      // 13. Services Catalog
      try {
        const servSnap = await getDocs(collection(db, 'services'));
        if (servSnap.empty) {
          for (const item of INITIAL_SERVICES) {
            await setDoc(doc(db, 'services', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Services check warning:', err);
      }

      const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
        if (!snap.empty) {
          setServices(snap.docs.map(d => d.data() as ServiceItem));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'services'));

      // 14. Portfolio Catalog
      try {
        const portSnap = await getDocs(collection(db, 'portfolio'));
        if (portSnap.empty) {
          for (const item of INITIAL_PORTFOLIO) {
            await setDoc(doc(db, 'portfolio', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Portfolio check warning:', err);
      }

      const unsubPortfolio = onSnapshot(collection(db, 'portfolio'), (snap) => {
        if (!snap.empty) {
          setPortfolioProjects(snap.docs.map(d => d.data() as PortfolioProject));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'portfolio'));

      const unsubContracts = onSnapshot(collection(db, 'contracts'), (snap) => {
        if (!snap.empty) {
          setContracts(snap.docs.map(d => d.data() as ServiceContract));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'contracts'));

      return () => {
        unsubQuotes();
        unsubProposals();
        unsubProjects();
        unsubContracts();
        unsubFinancials();
        unsubChat();
        unsubTickets();
        unsubLeads();
        unsubNotifs();
        unsubAdminUsers();
        unsubClientUsers();
        unsubSiteSettings();
        unsubSubscriptions();
        unsubServices();
        unsubPortfolio();
      };
    };

    seedAndSubscribe();
  }, []);

  const updateSiteConfig = async (newConfigData: Partial<SiteConfig>): Promise<void> => {
    const updated: SiteConfig = {
      ...siteConfig,
      ...newConfigData,
      lastUpdated: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      updatedBy: currentAdminUser?.name || currentUser?.name || 'Administrador'
    };
    setSiteConfig(updated);
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), updated);
      confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
      
      // Add notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Site Atualizado com Sucesso!',
        description: `O site foi atualizado em tempo real por ${updated.updatedBy}.`,
        type: 'project',
        timestamp: 'Agora',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings');
    }
  };

  const addService = async (data: Omit<ServiceItem, 'id'>) => {
    const newId = `s_${Date.now()}`;
    const newService: ServiceItem = {
      ...data,
      id: newId
    };
    setServices(prev => [newService, ...prev]);
    try {
      await saveDoc('services', newId, newService);
      await addNotification('Novo Serviço Cadastrado', `O serviço "${data.title}" foi adicionado ao site.`, 'project');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `services/${newId}`);
    }
  };

  const updateService = async (id: string, data: Partial<ServiceItem>) => {
    const existing = services.find(s => s.id === id);
    if (!existing) return;
    const updated = { ...existing, ...data };
    setServices(prev => prev.map(s => s.id === id ? updated : s));
    try {
      await saveDoc('services', id, updated);
      await addNotification('Serviço Atualizado', `Os dados do serviço "${updated.title}" foram salvos com sucesso.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `services/${id}`);
    }
  };

  const deleteService = async (id: string) => {
    const existing = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));
    try {
      await deleteDoc(doc(db, 'services', id));
      if (existing) {
        await addNotification('Serviço Removido', `O serviço "${existing.title}" foi removido do catálogo.`, 'project');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  const addPortfolioProject = async (data: Omit<PortfolioProject, 'id'>) => {
    const newId = `p_${Date.now()}`;
    const newProject: PortfolioProject = {
      ...data,
      id: newId
    };
    setPortfolioProjects(prev => [newProject, ...prev]);
    try {
      await saveDoc('portfolio', newId, newProject);
      await addNotification('Projeto de Portfólio Adicionado', `O projeto "${data.title}" foi publicado no portfólio.`, 'project');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `portfolio/${newId}`);
    }
  };

  const updatePortfolioProject = async (id: string, data: Partial<PortfolioProject>) => {
    const existing = portfolioProjects.find(p => p.id === id);
    if (!existing) return;
    const updated = { ...existing, ...data };
    setPortfolioProjects(prev => prev.map(p => p.id === id ? updated : p));
    try {
      await saveDoc('portfolio', id, updated);
      await addNotification('Portfólio Atualizado', `Os dados do projeto "${updated.title}" foram salvos com sucesso.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `portfolio/${id}`);
    }
  };

  const deletePortfolioProject = async (id: string) => {
    const existing = portfolioProjects.find(p => p.id === id);
    setPortfolioProjects(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      if (existing) {
        await addNotification('Projeto do Portfólio Removido', `O projeto "${existing.title}" foi removido do portfólio.`, 'project');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `portfolio/${id}`);
    }
  };

  // Admin Login and Management Handlers
  const loginAdmin = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const found = adminUsers.find(u => u.username.trim().toLowerCase() === cleanUser && u.passwordHash === pass);
    if (found) {
      setIsAdminAuthenticated(true);
      setCurrentAdminUser(found);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('ncodes_admin_user');
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    setActiveView('home');
  };

  const addAdminUser = async (data: Omit<AdminUser, 'id' | 'createdAt' | 'addedBy'>) => {
    const newId = `adm-${Date.now()}`;
    const newAdmin: AdminUser = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      addedBy: currentAdminUser?.name || 'Administrador Master'
    };

    try {
      await setDoc(doc(db, 'adminUsers', newId), newAdmin);
      await addNotification('Novo Administrador Cadastrado', `O usuário @${data.username} foi adicionado como ${data.roleTitle}.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `adminUsers/${newId}`);
    }
  };

  const deleteAdminUser = async (id: string) => {
    if (adminUsers.length <= 1) {
      alert('Não é possível remover o único administrador do sistema.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'adminUsers', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `adminUsers/${id}`);
    }
  };

  // Client Auth Handlers
  const loginClient = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = clientUsers.find(u => u.email.trim().toLowerCase() === cleanEmail && u.passwordHash === pass);
    if (found) {
      setIsClientAuthenticated(true);
      setCurrentClientUser(found);
      setCurrentUser({
        id: found.id,
        name: found.name,
        email: found.email,
        company: found.company,
        phone: found.phone,
        role: 'client',
        avatar: found.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      return true;
    }
    return false;
  };

  const checkEmailExists = (email: string): boolean => {
    if (!email || !email.trim()) return false;
    const cleanEmail = email.trim().toLowerCase();
    return clientUsers.some(u => u.email.trim().toLowerCase() === cleanEmail);
  };

  const registerClient = async (data: Omit<ClientUser, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    
    // 1. Check local state
    const existingLocal = clientUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
    if (existingLocal) {
      return {
        success: false,
        error: `O e-mail "${data.email.trim()}" já está cadastrado no sistema. Por favor, faça login com sua conta.`
      };
    }

    // 2. Double-check directly in Firestore collection
    try {
      const qSnap = await getDocs(query(collection(db, 'clientUsers'), where('email', '==', cleanEmail)));
      if (!qSnap.empty) {
        return {
          success: false,
          error: `O e-mail "${data.email.trim()}" já possui um cadastro ativo no sistema.`
        };
      }
    } catch (dbErr) {
      console.warn('Verificação de e-mail no Firestore:', dbErr);
    }

    const newId = `cli-user-${Date.now()}`;
    const newClient: ClientUser = {
      ...data,
      email: cleanEmail,
      id: newId,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'clientUsers', newId), newClient);
      setIsClientAuthenticated(true);
      setCurrentClientUser(newClient);
      setCurrentUser({
        id: newId,
        name: data.name,
        email: cleanEmail,
        company: data.company,
        phone: data.phone,
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      await addNotification('Novo Cliente Cadastrado', `${data.name} (${data.company || 'Pessoa Física'}) criou uma conta no Portal do Cliente.`, 'project');

      // 1. Send automatic registration confirmation email directly to the CLIENT
      try {
        await sendEmailWithFallback({
          endpoint: '/api/send-email-notification',
          recipientEmail: cleanEmail,
          type: 'client_registration_confirmation',
          emailConfig: {
            resendApiKey: siteConfig.resendApiKey,
            smtpHost: siteConfig.smtpHost,
            smtpPort: siteConfig.smtpPort,
            smtpUser: siteConfig.smtpUser,
            smtpPass: siteConfig.smtpPass,
            smtpFrom: siteConfig.smtpFrom
          },
          data: {
            name: data.name,
            email: cleanEmail,
            company: data.company,
            phone: data.phone
          }
        });
      } catch (cErr) {
        console.warn('E-mail dispatch error to client (registration confirmation):', cErr);
      }

      // 2. Send email alert to configured admin email
      try {
        const adminAlertEmail = siteConfig.notificationEmail || siteConfig.email || 'contato@ncodestechnologies.com.br';
        await sendEmailWithFallback({
          endpoint: '/api/send-email-notification',
          recipientEmail: adminAlertEmail,
          type: 'new_client',
          emailConfig: {
            resendApiKey: siteConfig.resendApiKey,
            smtpHost: siteConfig.smtpHost,
            smtpPort: siteConfig.smtpPort,
            smtpUser: siteConfig.smtpUser,
            smtpPass: siteConfig.smtpPass,
            smtpFrom: siteConfig.smtpFrom
          },
          data: {
            name: data.name,
            email: cleanEmail,
            company: data.company,
            phone: data.phone,
            city: data.city,
            state: data.state
          }
        });
      } catch (eErr) {
        console.warn('E-mail dispatch error (new client admin alert):', eErr);
      }

      // 3. Create initial welcome chat message in Firestore
      try {
        const welcomeChatMsg: ChatMessage = {
          id: `chat-welcome-${Date.now()}`,
          senderId: 'sys-ncodes',
          senderName: 'NCodes Tech',
          senderRole: 'admin',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
          text: `Olá ${data.name}! Seja muito bem-vindo(a) à NCodes Technologies! Seu cadastro foi realizado com sucesso. Através do nosso portal você pode solicitar orçamentos, acompanhar projetos e visualizar propostas comerciais. Como podemos ajudar?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        await saveDoc('chatMessages', welcomeChatMsg.id, welcomeChatMsg);
      } catch (chatErr) {
        console.warn('Welcome chat message save error:', chatErr);
      }

      return { success: true };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `clientUsers/${newId}`);
      return { success: false, error: 'Ocorreu um erro ao salvar o cadastro. Tente novamente.' };
    }
  };

  const addClientUser = async (data: Omit<ClientUser, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    return registerClient(data);
  };

  const updateClientUser = async (id: string, data: Partial<ClientUser>) => {
    const existing = clientUsers.find(c => c.id === id);
    if (!existing) return;
    const updated: ClientUser = {
      ...existing,
      ...data
    };
    try {
      await saveDoc('clientUsers', id, updated);
      await addNotification('Cliente Atualizado', `Os dados do cliente ${updated.name} foram atualizados.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `clientUsers/${id}`);
    }
  };

  const deleteClientUser = async (id: string) => {
    try {
      const clientToDelete = clientUsers.find(c => c.id === id);
      const targetEmail = clientToDelete?.email?.trim().toLowerCase();

      // 1. Delete document by ID from Firestore
      await deleteDoc(doc(db, 'clientUsers', id));

      // 2. Search and delete any remaining document in Firestore matching the target email
      if (targetEmail) {
        try {
          const qSnap = await getDocs(query(collection(db, 'clientUsers'), where('email', '==', targetEmail)));
          for (const docSnap of qSnap.docs) {
            await deleteDoc(doc(db, 'clientUsers', docSnap.id));
          }
        } catch (qErr) {
          console.warn('Erro ao remover registros duplicados por e-mail no Firestore:', qErr);
        }
      }

      // 3. Immediately update local clientUsers state
      setClientUsers(prev => prev.filter(c => c.id !== id && (targetEmail ? c.email.trim().toLowerCase() !== targetEmail : true)));

      // 4. Clear current client session if matches deleted user
      if (currentClientUser && (currentClientUser.id === id || (targetEmail && currentClientUser.email.trim().toLowerCase() === targetEmail))) {
        logoutClient();
      }

      await addNotification('Cliente Removido do Servidor', `O cadastro do cliente foi removido permanentemente da base de dados.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `clientUsers/${id}`);
    }
  };

  const logoutClient = () => {
    localStorage.removeItem('ncodes_client_user');
    setIsClientAuthenticated(false);
    setCurrentClientUser(null);
    setActiveView('home');
  };

  // Handle dark mode class on HTML body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const setCurrentUserRole = (role: UserRole) => {
    const found = TEAM_MEMBERS.find(m => m.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: `Usuário ${role.toUpperCase()}`,
        email: `${role}@ncodes.com.br`,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        company: 'NCodes Technologies'
      });
    }
  };

  // Helper notification adder
  const addNotification = async (title: string, description: string, type: NotificationItem['type'], link?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      description,
      type,
      timestamp: 'Agora mesmo',
      read: false,
      ...(link ? { link } : {})
    };
    try {
      await saveDoc('notifications', newNotif.id, newNotif);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `notifications/${newNotif.id}`);
    }
  };

  // Create Quote Request with Gemini AI Analysis integration
  const createQuoteRequest = async (data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<QuoteRequest> => {
    const newId = `ORC-2026-${String(quotes.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newQuote: QuoteRequest = {
      ...data,
      id: newId,
      status: 'solicitado',
      createdAt: now,
      updatedAt: now
    };

    try {
      await setDoc(doc(db, 'quotes', newId), newQuote);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${newId}`);
    }

    await addNotification('Novo Orçamento Recebido!', `${data.clientName} (${data.company}) enviou uma nova solicitação de orçamento (${newId}).`, 'quote');

    // 1. Send automatic quote request confirmation email directly to the CLIENT
    if (data.email) {
      try {
        await sendEmailWithFallback({
          endpoint: '/api/send-email-notification',
          recipientEmail: data.email,
          type: 'quote_confirmation_client',
          emailConfig: {
            resendApiKey: siteConfig.resendApiKey,
            smtpHost: siteConfig.smtpHost,
            smtpPort: siteConfig.smtpPort,
            smtpUser: siteConfig.smtpUser,
            smtpPass: siteConfig.smtpPass,
            smtpFrom: siteConfig.smtpFrom
          },
          data: {
            quoteId: newId,
            clientName: data.clientName,
            projectTitle: data.projectTitle || data.projectType,
            category: data.category || data.projectType,
            selectedFeatures: data.selectedFeatures || [],
            deadline: data.deadline,
            budgetRange: data.budgetRange,
            description: data.description
          }
        });
      } catch (cErr) {
        console.warn('E-mail dispatch error to client (quote confirmation):', cErr);
      }
    }

    // 2. Send email alert to configured admin email
    try {
      const adminAlertEmail = siteConfig.notificationEmail || siteConfig.email || 'contato@ncodestechnologies.com.br';
      await sendEmailWithFallback({
        endpoint: '/api/send-email-notification',
        recipientEmail: adminAlertEmail,
        type: 'new_quote',
        emailConfig: {
          resendApiKey: siteConfig.resendApiKey,
          smtpHost: siteConfig.smtpHost,
          smtpPort: siteConfig.smtpPort,
          smtpUser: siteConfig.smtpUser,
          smtpPass: siteConfig.smtpPass,
          smtpFrom: siteConfig.smtpFrom
        },
        data: {
          quoteId: newId,
          clientName: data.clientName,
          company: data.company,
          email: data.email,
          whatsapp: data.whatsapp,
          description: data.description,
          deadline: data.deadline,
          budgetRange: data.budgetRange
        }
      });
    } catch (eErr) {
      console.warn('E-mail dispatch error (new quote admin alert):', eErr);
    }

    // 3. Create initial automated chat message confirming quote receipt
    try {
      const quoteChatMsg: ChatMessage = {
        id: `chat-quote-${Date.now()}`,
        senderId: 'sys-ncodes',
        senderName: 'Engenharia NCodes',
        senderRole: 'admin',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
        text: `Confirmamos o recebimento da sua solicitação de orçamento #${newId} ("${data.projectTitle || data.projectType}"). Nossa equipe técnica e Inteligência Artificial iniciaram a análise de viabilidade técnica. Você receberá atualizações no seu e-mail e nesta conversa!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      await saveDoc('chatMessages', quoteChatMsg.id, quoteChatMsg);
    } catch (chatErr) {
      console.warn('Quote chat message save error:', chatErr);
    }

    // Trigger server-side AI quote analysis
    try {
      const res = await fetch('/api/ai-analyze-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: data.projectType,
          description: data.description,
          deadline: data.deadline,
          budgetRange: data.budgetRange
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.analysis) {
          const updatedQuote = {
            ...newQuote,
            status: 'em_analise' as QuoteStatus,
            aiAnalysis: json.analysis
          };
          await setDoc(doc(db, 'quotes', newId), updatedQuote);
        }
      }
    } catch (err) {
      console.warn('Erro ao chamar API de análise por IA:', err);
    }

    return newQuote;
  };

  // Create Digital Proposal
  const createProposal = (data: Omit<Proposal, 'id' | 'createdAt' | 'status'>): Proposal => {
    const newPropId = `PROP-2026-${String(proposals.length + 1).padStart(3, '0')}`;
    const newProposal: Proposal = {
      ...data,
      id: newPropId,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    try {
      setDoc(doc(db, 'proposals', newPropId), newProposal);
      
      // Update Quote status in Firestore
      const quoteToUpdate = quotes.find(q => q.id === data.quoteId);
      if (quoteToUpdate) {
        setDoc(doc(db, 'quotes', quoteToUpdate.id), {
          ...quoteToUpdate,
          status: 'proposta_enviada',
          proposalId: newPropId,
          updatedAt: new Date().toISOString()
        });

        // Send proposal notification email directly to client
        if (quoteToUpdate.email) {
          sendEmailWithFallback({
            endpoint: '/api/send-email-notification',
            recipientEmail: quoteToUpdate.email,
            type: 'proposal_issued',
            emailConfig: {
              resendApiKey: siteConfig.resendApiKey,
              smtpHost: siteConfig.smtpHost,
              smtpPort: siteConfig.smtpPort,
              smtpUser: siteConfig.smtpUser,
              smtpPass: siteConfig.smtpPass,
              smtpFrom: siteConfig.smtpFrom
            },
            data: {
              proposalId: newPropId,
              quoteId: quoteToUpdate.id,
              clientName: data.clientName,
              title: data.title,
              totalValue: data.totalValue,
              paymentTerms: data.paymentTerms
            }
          }).catch(err => console.warn('Erro ao enviar e-mail de proposta ao cliente:', err));
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `proposals/${newPropId}`);
    }

    addNotification('Proposta Emitida!', `Proposta ${newPropId} criada para ${data.clientName}. Link enviado para aceite digital.`, 'proposal');
    return newProposal;
  };

  // Generate Contract Automatically for Approved Quote or Proposal
  const generateContractForQuote = async (quoteId: string, customData?: any): Promise<ServiceContract> => {
    const quote = quotes.find(q => q.id === quoteId);
    const proposal = proposals.find(p => p.quoteId === quoteId || p.id === quoteId);
    const existingContract = contracts.find(c => c.quoteId === quoteId || (proposal && c.proposalId === proposal.id));

    if (existingContract) {
      if (customData?.projectId && !existingContract.projectId) {
        const updated = { ...existingContract, projectId: customData.projectId };
        await saveDoc('contracts', existingContract.id, updated);
        return updated;
      }
      return existingContract;
    }

    const contractNum = `CTR-2026-${String(contracts.length + 1).padStart(3, '0')}`;
    const nowISO = new Date().toISOString();
    const todayStr = nowISO.split('T')[0];

    const clientName = customData?.clientName || proposal?.clientName || quote?.clientName || 'Cliente NCodes';
    const companyName = customData?.company || proposal?.company || quote?.company || clientName;
    const clientEmail = customData?.email || quote?.email || `${clientName.toLowerCase().replace(/\s+/g, '')}@cliente.com.br`;
    const clientPhone = customData?.phone || quote?.phone || '(11) 98765-4321';
    const clientCpfCnpj = customData?.cpfCnpj || customData?.signerDocument || '34.567.890/0001-12';
    const legalRep = customData?.signatureName || customData?.legalRepresentative || clientName;

    const projectTitle = proposal?.title || quote?.projectTitle || quote?.projectType || 'Projeto de Software Customizado';
    const totalVal = Number(customData?.totalValue || proposal?.totalValue || quote?.offeredValue || 15000);
    const entryVal = Math.round(totalVal * 0.3);
    const remVal = totalVal - entryVal;
    const paymentTermsText = proposal?.paymentTerms || quote?.paymentTerms || '30% de entrada no aceite + 3 parcelas mensais de 23,33%';

    const scopeList = proposal?.scope && proposal.scope.length > 0 
      ? proposal.scope 
      : (quote?.scopeItems && quote.scopeItems.length > 0 ? quote.scopeItems : [
          'Desenvolvimento de Aplicação Web / Mobile Responsiva',
          'Modelagem de Banco de Dados na Nuvem',
          'Painel Administrativo para Gestão de Dados',
          'Autenticação Segura e Controle de Acesso',
          'Publicação em Ambiente de Produção'
        ]);

    const contractedFeats = quote?.selectedFeatures && quote.selectedFeatures.length > 0
      ? quote.selectedFeatures
      : ['Área do Cliente', 'Painel Administrativo', 'Banco de Dados Firestore', 'Módulo Financeiro Pix'];

    // Generate Installments
    const installmentsList: ContractInstallment[] = [
      {
        number: 1,
        description: 'Entrada 30% — Aceite do Contrato',
        amount: entryVal,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: customData?.signed ? 'pago' : 'pendente'
      },
      {
        number: 2,
        description: 'Parcela 2/3 — Entrega da 1ª Fase do Protótipo',
        amount: Math.round(remVal / 2),
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pendente'
      },
      {
        number: 3,
        description: 'Parcela 3/3 — Entrega Final e Homologação',
        amount: remVal - Math.round(remVal / 2),
        dueDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pendente'
      }
    ];

    const newContract: ServiceContract = {
      id: contractNum,
      contractNumber: contractNum,
      quoteId,
      ...(proposal ? { proposalId: proposal.id } : {}),
      ...(customData?.projectId ? { projectId: customData.projectId } : {}),
      contractor: {
        companyName: 'NCodes Technologies Ltda.',
        cnpj: '48.912.345/0001-90',
        email: siteConfig.email || 'contato@ncodes.com.br',
        phone: siteConfig.phone || '(11) 98765-4321',
        address: siteConfig.address || 'Av. Paulista, 1000 - Cj. 1402, São Paulo - SP',
        jurisdiction: 'Foro da Comarca de São Paulo / SP',
        legalRepresentative: 'Nikolas P. — CEO & Diretor de Tecnologia'
      },
      client: {
        fullName: clientName,
        companyName,
        cpfCnpj: clientCpfCnpj,
        phone: clientPhone,
        email: clientEmail,
        legalRepresentative: legalRep
      },
      projectTitle,
      category: quote?.category || 'Sistemas Web',
      description: proposal?.description || quote?.description || 'Desenvolvimento de solução de software proprietário sob medida.',
      approvedScope: scopeList,
      contractedFeatures: contractedFeats,
      totalValue: totalVal,
      entryValue: entryVal,
      paymentMethod: 'PIX / Boleto',
      paymentTerms: paymentTermsText,
      installments: installmentsList,
      lateFeeClause: 'Em caso de atraso injustificado no pagamento de qualquer parcela por período superior a 5 (cinco) dias corridos, incidirá automaticamente multa moratória de 10% (dez por cento) sobre o valor da parcela em atraso, a ser acrescida no lançamento da fatura subsequente.',
      estimatedDays: quote?.offeredDeadline || quote?.deadline || '45 dias úteis',
      startDate: todayStr,
      estimatedDeliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      objectClause: `O presente contrato tem por objeto a prestação de serviços de engenharia de software pela CONTRATADA em favor do CONTRATANTE, englobando o planejamento, design de interface, codificação, integração de banco de dados, testes e publicação do projeto "${projectTitle}".`,
      scopeClause: 'O escopo do projeto contempla estritamente as funcionalidades e entregáveis aprovados na proposta e especificação técnica vinculada.',
      contractorObligations: [
        'Desenvolver o software rigorosamente de acordo com o escopo e especificações técnicas aprovadas.',
        'Manter sigilo absoluto sobre todas as informações estratégicas, operacionais e dados do CONTRATANTE.',
        'Informar e reportar o andamento do desenvolvimento periodicamente através da Área do Cliente.',
        'Corrigir quaisquer falhas, vícios ou erros de código durante o período de garantia sem custos adicionais.',
        'Cumprir os prazos acordados no cronograma de execução, salvo prorrogações motivadas por alterações de escopo ou atraso no envio de insumos pelo cliente.'
      ],
      clientObligations: [
        'Fornecer tempestivamente todas as informações, logotipos, textos, acessos de API e credenciais necessárias para a execução dos serviços.',
        'Aprovar os protótipos e etapas intermediárias do projeto dentro dos prazos solicitados pela equipe técnica.',
        'Efetuar os pagamentos estipulados rigorosamente nas datas de vencimento contratadas.'
      ],
      paymentClause: `Pelos serviços contratados, o CONTRATANTE pagará à CONTRATADA o valor total fixo de R$ ${totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, mediante as condições financeiras ajustadas. Juros de 10% incidirão na parcela posterior em caso de inadimplência superior a 5 dias.`,
      changesAndExtraScopeClause: 'Qualquer funcionalidade, modificação visual ou integração não prevista expressamente no escopo aprovado neste instrumento será considerada solicitação adicional, ensejando emissão de novo orçamento, aditivo contratual e reajuste no prazo de entrega.',
      timelineClause: `O projeto terá início na data de aceite e prazo estimado de ${quote?.offeredDeadline || quote?.deadline || '45 dias úteis'}, podendo ser prorrogado mediante acordo formal em caso de força maior ou novos requisitos.`,
      warrantyClause: 'A CONTRATADA concede ao CONTRATANTE a garantia técnica de 90 (noventa) dias corridos a contar da entrega final do projeto para a correção de eventuais falhas operacionais do código entregue, não cobrindo novas funcionalidades.',
      warrantyDays: 90,
      terminationClause: 'O presente contrato poderá ser rescindido por descumprimento injustificado de quaisquer de suas cláusulas ou por falência/recuperação judicial, respondendo a parte infrante pelas perdas e danos apurados.',
      jurisdictionClause: 'Fica eleito o Foro da Comarca de São Paulo / SP para dirimir quaisquer dúvidas ou litígios oriundos deste contrato, com renúncia expressa a qualquer outro.',
      signature: {
        signed: Boolean(customData?.signed),
        signerName: legalRep,
        signerDocument: clientCpfCnpj,
        signerEmail: clientEmail,
        signedAt: customData?.signed ? nowISO : undefined,
        ipAddress: '187.58.122.94',
        deviceFingerprint: `${navigator.platform} - Browser Client`,
        digitalHash: `SHA256-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`,
        contractorName: 'NCodes Technologies Ltda.',
        contractorSignedAt: nowISO,
        externalProvider: 'internal',
        externalStatus: 'ready'
      },
      status: customData?.signed ? 'assinado' : 'aguardando_assinatura',
      createdAt: nowISO,
      version: 'v1.0',
      history: [
        {
          id: `hst-${Date.now()}-1`,
          timestamp: nowISO,
          user: 'Sistema NCodes (Automação)',
          action: 'Contrato Gerado Automático',
          details: `Contrato ${contractNum} gerado automaticamente para o orçamento ${quoteId}.`,
          version: 'v1.0'
        },
        ...(customData?.signed ? [{
          id: `hst-${Date.now()}-2`,
          timestamp: nowISO,
          user: legalRep,
          action: 'Assinatura Eletrônica Registrada',
          details: `Contrato assinado eletronicamente por ${legalRep} (CPF/CNPJ ${clientCpfCnpj}).`,
          version: 'v1.0'
        }] : [])
      ],
      qrCodeValue: `${window.location.origin}?contractId=${contractNum}`
    };

    try {
      await saveDoc('contracts', contractNum, newContract);

      // Link contractNumber and contractId to quote and proposal
      if (quote) {
        await saveDoc('quotes', quote.id, {
          ...quote,
          contractId: contractNum,
          contractNumber: contractNum
        });
      }
      if (proposal) {
        await saveDoc('proposals', proposal.id, {
          ...proposal,
          contractId: contractNum,
          contractNumber: contractNum
        });
      }

      await addNotification(
        'Contrato Gerado Automático 📄', 
        `O contrato ${contractNum} foi gerado automaticamente para ${clientName}. Disponível no painel do cliente.`, 
        'project'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `contracts/${contractNum}`);
    }

    return newContract;
  };

  const signContract = async (contractId: string, signatureData: { signerName: string; signerDocument: string; signerEmail?: string }) => {
    const target = contracts.find(c => c.id === contractId);
    if (!target) return;

    const nowISO = new Date().toISOString();
    const simIp = '187.58.122.94';
    const hash = `SHA256-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const updated: ServiceContract = {
      ...target,
      status: 'assinado',
      signature: {
        ...target.signature,
        signed: true,
        signerName: signatureData.signerName,
        signerDocument: signatureData.signerDocument,
        signerEmail: signatureData.signerEmail || target.client.email,
        signedAt: nowISO,
        ipAddress: simIp,
        digitalHash: hash
      },
      client: {
        ...target.client,
        legalRepresentative: signatureData.signerName,
        cpfCnpj: signatureData.signerDocument
      },
      history: [
        ...target.history,
        {
          id: `hst-${Date.now()}`,
          timestamp: nowISO,
          user: signatureData.signerName,
          action: 'Assinatura Eletrônica Registrada',
          details: `Assinatura digital confirmada pelo cliente (Doc: ${signatureData.signerDocument}, IP: ${simIp}).`,
          version: target.version
        }
      ]
    };

    try {
      await saveDoc('contracts', contractId, updated);

      await addNotification(
        'Contrato Assinado pelo Cliente! 🖊️', 
        `${signatureData.signerName} assinou o contrato ${contractId} em ${new Date(nowISO).toLocaleDateString('pt-BR')}.`, 
        'project'
      );

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `contracts/${contractId}`);
    }
  };

  const deleteContract = async (contractId: string) => {
    setContracts(prev => prev.filter(c => c.id !== contractId));
    try {
      await deleteDoc(doc(db, 'contracts', contractId));
      await addNotification('Contrato Excluído', `O contrato ${contractId} foi removido com sucesso.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `contracts/${contractId}`);
    }
  };

  // Digital Acceptance Flow
  const acceptProposal = async (proposalId: string, signatureName: string) => {
    const now = new Date().toISOString();
    const simulatedIp = '187.58.122.94';
    const simulatedDevice = `${navigator.platform} - ${navigator.userAgent.slice(0, 40)}...`;

    let prop = proposals.find(p => p.id === proposalId || p.quoteId === proposalId);

    if (!prop) {
      const associatedQuote = quotes.find(q => q.id === proposalId || q.proposalId === proposalId);
      if (associatedQuote) {
        prop = {
          id: associatedQuote.proposalId || `PROP-${associatedQuote.id}`,
          quoteId: associatedQuote.id,
          title: associatedQuote.projectTitle || associatedQuote.projectType || 'Proposta de Desenvolvimento de Software',
          clientName: associatedQuote.clientName,
          company: associatedQuote.company || associatedQuote.clientName,
          description: associatedQuote.description,
          scope: associatedQuote.scopeItems || associatedQuote.selectedFeatures || ['Desenvolvimento Web/Mobile', 'Painel Admin', 'API'],
          totalValue: associatedQuote.offeredValue || 15000,
          paymentTerms: associatedQuote.paymentTerms || '30% de entrada no aceite + parcelamento',
          contractText: `INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS...`,
          status: 'pendente',
          createdAt: associatedQuote.createdAt
        };
      }
    }

    if (!prop) return;

    try {
      // Automatically generate contract first!
      const autoContract = await generateContractForQuote(prop.quoteId || proposalId, {
        signatureName,
        signed: true,
        clientName: prop.clientName,
        company: prop.company,
        totalValue: prop.totalValue
      });

      // Update proposal in Firestore
      await setDoc(doc(db, 'proposals', prop.id), {
        ...prop,
        status: 'aceito',
        acceptedAt: now,
        clientIp: simulatedIp,
        clientDevice: simulatedDevice,
        signatureName,
        contractId: autoContract.id,
        contractNumber: autoContract.contractNumber
      });

      // Update associated quote status to aprovado in Firestore
      if (prop.quoteId) {
        const qToUpdate = quotes.find(q => q.id === prop.quoteId);
        if (qToUpdate) {
          await setDoc(doc(db, 'quotes', prop.quoteId), {
            ...qToUpdate,
            status: 'aprovado',
            updatedAt: now,
            contractId: autoContract.id,
            contractNumber: autoContract.contractNumber
          });
        }
      }

      // Automatically instantiate a new Project in Firestore!
      const newProjectId = `PRJ-2026-${String(projects.length + 1).padStart(2, '0')}`;
      const newProject: Project = {
        id: newProjectId,
        title: prop.title,
        clientName: prop.clientName,
        clientId: `cli-${Date.now()}`,
        category: 'Iniciado via Aceite Digital',
        description: prop.description,
        status: 'planejamento',
        progressPercentage: 10,
        estimatedHours: 160,
        completedHours: 0,
        team: ['Nikolas (Tech Lead)', 'Amanda (UI/UX)', 'Gabriel (Dev)'],
        technologies: ['Flutter', 'React', 'Firebase', 'Node.js'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        proposalId,
        contractId: autoContract.id,
        contractNumber: autoContract.contractNumber,
        tasks: [
          { id: `t-${Date.now()}-1`, title: 'Reunião de Kick-off & Definição de Protótipos', completed: true, category: 'Gestão' },
          { id: `t-${Date.now()}-2`, title: 'Configuração dos Ambientes de Staging & Firestore', completed: false, category: 'DevOps' },
          { id: `t-${Date.now()}-3`, title: 'Desenvolvimento do Módulo Principal', completed: false, category: 'Dev' },
          { id: `t-${Date.now()}-4`, title: 'Homologação e Teste de Aceite com Cliente', completed: false, category: 'QA' }
        ],
        files: [
          { id: `f-${Date.now()}`, name: `Contrato_${autoContract.contractNumber}.pdf`, size: '1.8 MB', uploadedBy: signatureName, date: now.split('T')[0], type: 'pdf', url: '#' }
        ]
      };

      await saveDoc('projects', newProjectId, newProject);

      // Automatically create initial entry invoice (30% entry fee) in Firestore
      const entryAmount = Math.round(prop.totalValue * 0.3);
      const newFinancial: FinancialTransaction = {
        id: `FIN-${Date.now()}`,
        title: `Entrada 30% - ${prop.title}`,
        type: 'receita',
        category: 'Desenvolvimento de Software',
        amount: entryAmount,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pendente',
        paymentMethod: 'pix',
        clientName: prop.clientName,
        projectId: newProjectId
      };

      await saveDoc('financials', newFinancial.id, newFinancial);

      // Automatically instantiate or link Client Subscription for recurring monthly fee or single value agreement
      const existingSubForProp = subscriptions.find(s => s.proposalId === proposalId || (s.clientName === prop.clientName && s.serviceName.includes(prop.title)));
      const subValue = prop.recurringMonthlyValue && prop.recurringMonthlyValue > 0 ? prop.recurringMonthlyValue : Math.round(prop.totalValue / 12);
      const subId = existingSubForProp ? existingSubForProp.id : `SUB-PROP-${Date.now()}`;
      const today = new Date();
      const nextDue = new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString().split('T')[0];
      const defaultPix = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${subValue}.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304`;

      const autoSub: ClientSubscription = {
        ...(existingSubForProp || {}),
        id: subId,
        clientName: prop.clientName,
        clientEmail: `${prop.clientName.toLowerCase().replace(/\s+/g, '')}@cliente.com.br`,
        serviceName: `Contrato de Sustentação & Suporte - ${prop.title}`,
        monthlyValue: subValue,
        billingCycleDay: 10,
        status: 'ativo',
        startDate: today.toISOString().split('T')[0],
        nextDueDate: nextDue,
        paymentMethod: 'pix',
        notes: `Vinculado automaticamente ao Aceite Digital da Proposta ${proposalId}. Valor total do projeto: R$ ${prop.totalValue.toLocaleString('pt-BR')}.`,
        pixCopyPaste: defaultPix,
        proposalId,
        projectId: newProjectId,
        ...(prop.quoteId ? { quoteId: prop.quoteId } : {}),
        billingType: prop.recurringMonthlyValue && prop.recurringMonthlyValue > 0 ? 'recorrente' : 'valor_unico',
        oneTimeTotalValue: prop.totalValue
      };

      newProject.subscriptionId = subId;

      await saveDoc('projects', newProjectId, newProject);
      await saveDoc('clientSubscriptions', subId, autoSub);

      // Add Lead conversion in CRM
      const newLead: LeadCRM = {
        id: `lead-conv-${Date.now()}`,
        name: signatureName,
        company: prop.company || 'Empresa',
        email: 'cliente@ncodes.com.br',
        phone: '(11) 99999-9999',
        stage: 'ganho',
        value: prop.totalValue,
        nextFollowUp: 'Projeto em Andamento'
      };
      await saveDoc('leads', newLead.id, newLead);

      await addNotification('Proposta Aprovada Digitalmente! 🎉', `${prop.clientName} assinou o contrato da proposta ${proposalId}. Projeto ${newProjectId} iniciado!`, 'project');

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `proposals/${proposalId}`);
    }
  };

  const deleteProposal = async (proposalId: string) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
    try {
      await deleteDoc(doc(db, 'proposals', proposalId));
      await addNotification('Proposta Removida', `A proposta ${proposalId} foi excluída com sucesso.`, 'quote');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `proposals/${proposalId}`);
    }
  };

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, customMessage?: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (q) {
      const nowISO = new Date().toISOString();
      const dateObj = new Date();
      const dateStr = dateObj.toLocaleDateString('pt-BR');
      const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const statusLabels: Record<QuoteStatus, string> = {
        solicitado: 'Solicitação Enviada',
        em_analise: 'Em Análise',
        aguardando_informacoes: 'Aguardando Informações',
        orcamento_disponivel: 'Orçamento Disponível',
        proposta_enviada: 'Orçamento Disponível',
        em_negociacao: 'Em Negociação',
        aprovado: 'Aprovado',
        recusado: 'Recusado',
        rejeitado: 'Recusado',
        cancelado: 'Cancelado'
      };

      const newTimelineItem = {
        id: `tl-${Date.now()}`,
        timestamp: nowISO,
        dateStr,
        timeStr,
        user: currentAdminUser ? `${currentAdminUser.name} (Atendimento)` : 'Equipe NCodes',
        userRole: 'admin' as const,
        statusChangedTo: status,
        statusLabel: statusLabels[status] || status,
        notes: customMessage || `Status alterado para ${statusLabels[status] || status}.`
      };

      const existingTimeline = q.timeline || [];

      const updated = { 
        ...q, 
        status, 
        adminNotes: customMessage || q.adminNotes,
        updatedAt: nowISO,
        timeline: [...existingTimeline, newTimelineItem]
      };

      try {
        await setDoc(doc(db, 'quotes', quoteId), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
      }

      // Notify Client via Email
      if (q.email) {
        try {
          await sendEmailWithFallback({
            endpoint: '/api/send-email-notification',
            recipientEmail: q.email,
            type: 'quote_status_update',
            emailConfig: {
              resendApiKey: siteConfig.resendApiKey,
              smtpHost: siteConfig.smtpHost,
              smtpPort: siteConfig.smtpPort,
              smtpUser: siteConfig.smtpUser,
              smtpPass: siteConfig.smtpPass,
              smtpFrom: siteConfig.smtpFrom
            },
            data: {
              quoteId,
              clientName: q.clientName,
              status,
              statusLabel: statusLabels[status] || status,
              adminNotes: customMessage || ''
            }
          });
        } catch (eErr) {
          console.warn('Erro ao enviar e-mail de posicionamento ao cliente:', eErr);
        }
      }

      await addNotification(
        'Posicionamento de Orçamento Atualizado',
        `Status do orçamento #${quoteId} (${q.clientName}) alterado para ${statusLabels[status] || status}.`,
        'quote'
      );

      // Auto convert to Project if approved
      if (status === 'aprovado' && !q.convertedProjectId) {
        try {
          await convertQuoteToProject(quoteId);
        } catch (convErr) {
          console.warn('Erro ao converter orçamento aprovado em projeto:', convErr);
        }
      }

      // Create automated chat message update for the quote
      try {
        const updateChatMsg: ChatMessage = {
          id: `chat-status-${Date.now()}`,
          senderId: 'sys-ncodes',
          senderName: 'NCodes Tech',
          senderRole: 'admin',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
          text: `🔔 Atualização do Orçamento #${quoteId}: Status alterado para "${statusLabels[status] || status}". ${customMessage ? `\n\nObservação: "${customMessage}"` : ''}`,
          timestamp: timeStr
        };
        await saveDoc('chatMessages', updateChatMsg.id, updateChatMsg);
      } catch (chatErr) {
        console.warn('Status update chat message save error:', chatErr);
      }
    }
  };

  const updateQuoteDetails = async (quoteId: string, updates: Partial<QuoteRequest>, notes?: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const dateObj = new Date();
    const dateStr = dateObj.toLocaleDateString('pt-BR');
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Versioning
    const currentVersions = q.versions || [];
    const newVersion = {
      versionNumber: currentVersions.length + 1,
      updatedAt: nowISO,
      updatedBy: currentAdminUser ? currentAdminUser.name : 'Equipe NCodes',
      value: updates.offeredValue ?? q.offeredValue,
      estimatedDays: updates.offeredDeadline ?? q.offeredDeadline,
      paymentTerms: updates.paymentTerms ?? q.paymentTerms,
      notes: notes || 'Atualização dos valores e escopo do orçamento'
    };

    const newTimelineItem = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr,
      timeStr,
      user: currentAdminUser ? `${currentAdminUser.name} (Atendimento)` : 'Equipe NCodes',
      userRole: 'admin' as const,
      statusChangedTo: updates.status || q.status,
      statusLabel: 'Orçamento Atualizado',
      notes: notes || `Valores/Escopo atualizados. Valor: R$ ${(updates.offeredValue || q.offeredValue || 0).toLocaleString('pt-BR')}`
    };

    const updatedQuote: QuoteRequest = {
      ...q,
      ...updates,
      updatedAt: nowISO,
      versions: [...currentVersions, newVersion],
      timeline: [...(q.timeline || []), newTimelineItem]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
      await addNotification('Orçamento Atualizado', `Valores do orçamento #${quoteId} foram atualizados pela equipe.`, 'quote');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const addQuoteTimelineItem = async (
    quoteId: string, 
    notes: string, 
    user?: string, 
    userRole: 'admin' | 'client' | 'system' = 'admin',
    statusChangedTo?: QuoteStatus
  ) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const dateObj = new Date();
    const item = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr: dateObj.toLocaleDateString('pt-BR'),
      timeStr: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: user || (userRole === 'client' ? (currentClientUser?.name || 'Cliente') : 'Equipe NCodes'),
      userRole,
      statusChangedTo: statusChangedTo || q.status,
      statusLabel: statusChangedTo ? statusChangedTo : undefined,
      notes
    };

    const updatedQuote = {
      ...q,
      updatedAt: nowISO,
      timeline: [...(q.timeline || []), item]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const addQuoteAttachment = async (quoteId: string, attachment: Omit<QuoteAttachment, 'id' | 'createdAt'>) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const newAtt: QuoteAttachment = {
      ...attachment,
      id: `att-${Date.now()}`,
      createdAt: nowISO
    };

    const dateObj = new Date();
    const timelineEntry = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr: dateObj.toLocaleDateString('pt-BR'),
      timeStr: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: attachment.uploadedBy,
      userRole: attachment.uploadedRole,
      notes: `Anexo enviado: ${attachment.name} (${attachment.size})`,
      attachments: [newAtt]
    };

    const updatedQuote = {
      ...q,
      updatedAt: nowISO,
      attachments: [...(q.attachments || []), newAtt],
      timeline: [...(q.timeline || []), timelineEntry]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const approveQuoteByClient = async (quoteId: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const dateObj = new Date();

    const timelineItem = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr: dateObj.toLocaleDateString('pt-BR'),
      timeStr: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: currentClientUser ? `${currentClientUser.name} (Cliente)` : (q.clientName || 'Cliente'),
      userRole: 'client' as const,
      statusChangedTo: 'aprovado' as QuoteStatus,
      statusLabel: 'Aprovado pelo Cliente',
      notes: 'Orçamento e proposta comercial aprovados pelo cliente no Portal.'
    };

    const updatedQuote: QuoteRequest = {
      ...q,
      status: 'aprovado',
      updatedAt: nowISO,
      timeline: [...(q.timeline || []), timelineItem]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
      await addNotification('Orçamento Aprovado pelo Cliente! 🎉', `O cliente ${q.clientName} aprovou o orçamento #${quoteId}.`, 'quote');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto convert to Project if not converted yet
      if (!q.convertedProjectId) {
        await convertQuoteToProject(quoteId);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const refuseQuoteByClient = async (quoteId: string, reason?: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const dateObj = new Date();

    const timelineItem = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr: dateObj.toLocaleDateString('pt-BR'),
      timeStr: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: currentClientUser ? `${currentClientUser.name} (Cliente)` : (q.clientName || 'Cliente'),
      userRole: 'client' as const,
      statusChangedTo: 'recusado' as QuoteStatus,
      statusLabel: 'Recusado pelo Cliente',
      notes: reason ? `Orçamento recusado pelo cliente. Motivo informado: "${reason}"` : 'Orçamento recusado pelo cliente.'
    };

    const updatedQuote: QuoteRequest = {
      ...q,
      status: 'recusado',
      refusalReason: reason,
      updatedAt: nowISO,
      timeline: [...(q.timeline || []), timelineItem]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
      await addNotification('Orçamento Recusado', `O cliente ${q.clientName} recusou o orçamento #${quoteId}. Motivo: ${reason || 'Não informado'}`, 'quote');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const requestQuoteChangesByClient = async (quoteId: string, changeRequestText: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const dateObj = new Date();

    const timelineItem = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr: dateObj.toLocaleDateString('pt-BR'),
      timeStr: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: currentClientUser ? `${currentClientUser.name} (Cliente)` : (q.clientName || 'Cliente'),
      userRole: 'client' as const,
      statusChangedTo: 'em_negociacao' as QuoteStatus,
      statusLabel: 'Solicitação de Alteração',
      notes: `Solicitação de alteração do cliente: "${changeRequestText}"`
    };

    const updatedQuote: QuoteRequest = {
      ...q,
      status: 'em_negociacao',
      updatedAt: nowISO,
      timeline: [...(q.timeline || []), timelineItem]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
      await addNotification('Solicitação de Ajuste de Orçamento', `${q.clientName} solicitou ajustes no orçamento #${quoteId}: "${changeRequestText.slice(0, 60)}..."`, 'quote');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const respondToQuoteRequest = async (quoteId: string, responseText: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return;

    const nowISO = new Date().toISOString();
    const dateObj = new Date();

    const isClient = !!currentClientUser;
    const newStatus: QuoteStatus = isClient ? 'em_analise' : 'aguardando_informacoes';

    const timelineItem = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      dateStr: dateObj.toLocaleDateString('pt-BR'),
      timeStr: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: isClient ? `${currentClientUser?.name} (Cliente)` : (currentAdminUser ? `${currentAdminUser.name} (Atendimento)` : 'Equipe NCodes'),
      userRole: isClient ? ('client' as const) : ('admin' as const),
      statusChangedTo: newStatus,
      statusLabel: isClient ? 'Informações Fornecidas' : 'Informações Solicitadas',
      notes: responseText
    };

    const updatedQuote: QuoteRequest = {
      ...q,
      status: newStatus,
      updatedAt: nowISO,
      timeline: [...(q.timeline || []), timelineItem]
    };

    try {
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);
      await addNotification('Resposta ao Orçamento', `Nova mensagem registrada no orçamento #${quoteId}.`, 'quote');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }
  };

  const convertQuoteToProject = async (quoteId: string): Promise<string | undefined> => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return undefined;

    const newProjectId = `PRJ-${Date.now().toString().slice(-5)}`;
    const nowISO = new Date().toISOString();

    // Auto generate or link contract
    const autoContract = await generateContractForQuote(quoteId, {
      projectId: newProjectId,
      signed: true,
      clientName: q.clientName,
      company: q.company,
      totalValue: q.offeredValue
    });

    const initialTasks = (q.scopeItems && q.scopeItems.length > 0)
      ? q.scopeItems.map((item, idx) => ({
          id: `tsk-${idx + 1}`,
          title: item,
          completed: false,
          category: 'Desenvolvimento'
        }))
      : [
          { id: 'tsk-1', title: 'Alinhamento de Escopo e Arquitetura', completed: true, category: 'Planejamento' },
          { id: 'tsk-2', title: 'Criação de Protótipos UI/UX', completed: false, category: 'Design' },
          { id: 'tsk-3', title: 'Desenvolvimento do Frontend Responsivo', completed: false, category: 'Desenvolvimento' },
          { id: 'tsk-4', title: 'Desenvolvimento de APIs e Banco de Dados', completed: false, category: 'Backend' },
          { id: 'tsk-5', title: 'Homologação e Testes de Segurança', completed: false, category: 'QA' },
          { id: 'tsk-6', title: 'Lançamento & Publicação em Produção', completed: false, category: 'Lançamento' }
        ];

    const projectFiles = (q.attachments || []).map(att => ({
      id: att.id,
      name: att.name,
      size: att.size,
      uploadedBy: att.uploadedBy,
      date: new Date(att.createdAt).toLocaleDateString('pt-BR'),
      type: (att.name.endsWith('.pdf') ? 'pdf' : att.name.endsWith('.png') || att.name.endsWith('.jpg') ? 'image' : 'doc') as any,
      url: att.url
    }));

    const newProject: Project = {
      id: newProjectId,
      title: q.projectTitle || q.projectType || 'Novo Projeto NCodes',
      clientName: q.clientName,
      clientId: q.email,
      category: q.category || q.projectType,
      description: q.description,
      status: 'planejamento',
      progressPercentage: 5,
      estimatedHours: q.aiAnalysis?.estimatedHours || 120,
      completedHours: 0,
      team: ['Nikolas P. (Engenheiro Chefe)', 'Lucas V. (Dev Lead)', 'Carolina M. (Design Lead)'],
      technologies: q.aiAnalysis?.recommendedTech || ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      startDate: new Date().toLocaleDateString('pt-BR'),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      tasks: initialTasks,
      files: projectFiles,
      proposalId: q.proposalId,
      contractId: autoContract.id,
      contractNumber: autoContract.contractNumber,
      recurringMonthlyValue: q.recurringMonthlyValue || 1200
    };

    try {
      await saveDoc('projects', newProjectId, newProject);

      // Update quote with convertedProjectId and contract
      const updatedQuote = {
        ...q,
        status: 'aprovado' as QuoteStatus,
        convertedProjectId: newProjectId,
        contractId: autoContract.id,
        contractNumber: autoContract.contractNumber,
        updatedAt: nowISO,
        timeline: [
          ...(q.timeline || []),
          {
            id: `tl-${Date.now()}`,
            timestamp: nowISO,
            dateStr: new Date().toLocaleDateString('pt-BR'),
            timeStr: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            user: 'Sistema NCodes',
            userRole: 'system' as const,
            statusChangedTo: 'aprovado' as QuoteStatus,
            statusLabel: 'Convertido em Projeto',
            notes: `Orçamento #${quoteId} convertido em projeto de execução real #${newProjectId}.`
          }
        ]
      };
      await setDoc(doc(db, 'quotes', quoteId), updatedQuote);

      await addNotification('Projeto Criado com Sucesso! 🚀', `Orçamento #${quoteId} convertido no Projeto #${newProjectId}.`, 'project');

      return newProjectId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${newProjectId}`);
      return undefined;
    }
  };

  const deleteQuote = async (quoteId: string) => {
    setQuotes(prev => prev.filter(q => q.id !== quoteId));
    try {
      await deleteDoc(doc(db, 'quotes', quoteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `quotes/${quoteId}`);
    }
  };

  const toggleProjectTask = async (projectId: string, taskId: string) => {
    const prj = projects.find(p => p.id === projectId);
    if (!prj) return;

    const updatedTasks = prj.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject = {
      ...prj,
      tasks: updatedTasks,
      progressPercentage: progress
    };

    try {
      await setDoc(doc(db, 'projects', projectId), updatedProject);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${projectId}`);
    }
  };

  const addProjectHours = async (projectId: string, hours: number) => {
    const prj = projects.find(p => p.id === projectId);
    if (!prj) return;

    const updated = {
      ...prj,
      completedHours: prj.completedHours + hours
    };

    try {
      await setDoc(doc(db, 'projects', projectId), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${projectId}`);
    }
  };

  const addProjectFile = async (projectId: string, name: string, size: string, type: 'pdf' | 'doc' | 'image' | 'code' | 'zip') => {
    const prj = projects.find(p => p.id === projectId);
    if (!prj) return;

    const newFile = {
      id: `f-${Date.now()}`,
      name,
      size,
      uploadedBy: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      type,
      url: '#'
    };

    const updated = {
      ...prj,
      files: [newFile, ...prj.files]
    };

    try {
      await setDoc(doc(db, 'projects', projectId), updated);
      await addNotification('Novo Arquivo Adicionado', `${currentUser.name} enviou o arquivo ${name} para o projeto.`, 'project');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${projectId}`);
    }
  };

  const finalizeProjectAndStartSubscription = async (
    projectId: string, 
    customMonthlyValue?: number,
    completionDateInput?: string
  ) => {
    const prj = projects.find(p => p.id === projectId);
    if (!prj) return null;

    const compDate = completionDateInput ? new Date(completionDateInput + 'T12:00:00') : new Date();
    const dayOfMonth = compDate.getDate();

    let monthlyValue = customMonthlyValue || prj.recurringMonthlyValue || 0;
    if (!monthlyValue && prj.proposalId) {
      const prop = proposals.find(p => p.id === prj.proposalId);
      if (prop?.recurringMonthlyValue) {
        monthlyValue = prop.recurringMonthlyValue;
      }
    }
    if (!monthlyValue || monthlyValue <= 0) {
      monthlyValue = 1200;
    }

    const isFirstHalf = dayOfMonth <= 15;
    const year = compDate.getFullYear();
    const month = compDate.getMonth();

    const nextMonthObj = new Date(year, month + 1, 10);
    const nextDueDateStr = nextMonthObj.toISOString().split('T')[0];
    const nextMonthName = nextMonthObj.toLocaleString('pt-BR', { month: 'long' });

    let firstChargeAmount = 0;
    let ruleAppliedText = '';

    if (isFirstHalf) {
      firstChargeAmount = Math.round((monthlyValue * 0.5) * 100) / 100;
      ruleAppliedText = `Projeto concluído na 1ª quinzena (dia ${dayOfMonth}). Cobrado 50% pro-rata (R$ ${firstChargeAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) no mês atual. Próxima cobrança integral (R$ ${monthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) em 10 de ${nextMonthName}.`;
    } else {
      firstChargeAmount = 0;
      ruleAppliedText = `Projeto concluído após o dia 15 (dia ${dayOfMonth}). Isento no mês atual. Cobrança de R$ ${monthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} inicia em 10 de ${nextMonthName}.`;
    }

    const updatedTasks = prj.tasks.map(t => ({ ...t, completed: true }));
    const updatedProject: Project = {
      ...prj,
      status: 'concluido',
      progressPercentage: 100,
      recurringMonthlyValue: monthlyValue,
      completedAt: compDate.toISOString(),
      billingRuleApplied: ruleAppliedText,
      tasks: updatedTasks
    };

    try {
      await setDoc(doc(db, 'projects', projectId), updatedProject);

      // Check if subscription already exists for this project, proposal, or client service
      const existingSub = subscriptions.find(s => 
        s.id === prj.subscriptionId || 
        s.projectId === prj.id || 
        (prj.proposalId && s.proposalId === prj.proposalId) ||
        (s.clientName.toLowerCase() === prj.clientName.toLowerCase() && s.serviceName.toLowerCase().includes(prj.title.toLowerCase()))
      );

      const subId = existingSub ? existingSub.id : (prj.subscriptionId || `SUB-${Date.now()}`);
      const defaultPix = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${monthlyValue}.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304`;

      const newSub: ClientSubscription = {
        ...(existingSub || {}),
        id: subId,
        clientName: prj.clientName,
        clientEmail: prj.clientId || existingSub?.clientEmail || `${prj.clientName.toLowerCase().replace(/\s+/g, '')}@cliente.com.br`,
        serviceName: existingSub?.serviceName || `Manutenção & Suporte - ${prj.title}`,
        monthlyValue: monthlyValue,
        billingCycleDay: 10,
        status: 'ativo',
        startDate: existingSub?.startDate || compDate.toISOString().split('T')[0],
        nextDueDate: isFirstHalf ? new Date(year, month, 25).toISOString().split('T')[0] : nextDueDateStr,
        paymentMethod: 'pix',
        pixCopyPaste: defaultPix,
        lastPaymentDate: isFirstHalf ? compDate.toISOString().split('T')[0] : existingSub?.lastPaymentDate,
        notes: ruleAppliedText,
        projectId: prj.id,
        proposalId: prj.proposalId
      };

      await saveDoc('clientSubscriptions', subId, newSub);

      // Prevent generating duplicate financial installment transactions if one already exists
      const existingFin = financials.find(f => 
        f.projectId === prj.id || 
        f.subscriptionId === subId || 
        (f.clientName === prj.clientName && f.title.includes(prj.title) && f.status === 'pendente')
      );

      if (!existingFin) {
        if (isFirstHalf) {
          const finCurrentMonth: FinancialTransaction = {
            id: `FIN-PRO-RATA-${Date.now()}`,
            title: `Mensalidade Pro-rata (50%) - ${prj.title}`,
            type: 'receita',
            category: 'Sustentação e Suporte Recorrente',
            amount: firstChargeAmount,
            dueDate: new Date(year, month, 25).toISOString().split('T')[0],
            status: 'pendente',
            paymentMethod: 'pix',
            clientName: prj.clientName,
            projectId: prj.id,
            subscriptionId: subId
          };
          await setDoc(doc(db, 'financials', finCurrentMonth.id), finCurrentMonth);
        } else {
          const finNextMonth: FinancialTransaction = {
            id: `FIN-SUB-NEXT-${Date.now()}`,
            title: `1ª Mensalidade Integral - ${prj.title}`,
            type: 'receita',
            category: 'Sustentação e Suporte Recorrente',
            amount: monthlyValue,
            dueDate: nextDueDateStr,
            status: 'pendente',
            paymentMethod: 'pix',
            clientName: prj.clientName,
            projectId: prj.id,
            subscriptionId: subId
          };
          await setDoc(doc(db, 'financials', finNextMonth.id), finNextMonth);
        }
      }

      await addNotification(
        'Projeto Concluído & Mensalidade Ativada! 🎉',
        `O projeto "${prj.title}" foi finalizado. ${ruleAppliedText}`,
        'project'
      );

      return {
        ruleApplied: ruleAppliedText,
        firstChargeAmount,
        nextDueDate: nextDueDateStr,
        subscriptionId: subId
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${projectId}`);
      return null;
    }
  };

  const deleteProject = async (projectId: string) => {
    const prj = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));

    // Find linked subscriptions to delete automatically as well
    const linkedSubs = subscriptions.filter(s => 
      s.projectId === projectId ||
      (prj && prj.subscriptionId && s.id === prj.subscriptionId) ||
      (prj && prj.title && s.serviceName.toLowerCase().includes(prj.title.toLowerCase()))
    );

    if (linkedSubs.length > 0) {
      const linkedIds = new Set(linkedSubs.map(s => s.id));
      setSubscriptions(prev => prev.filter(s => !linkedIds.has(s.id)));
    }

    try {
      await deleteDoc(doc(db, 'projects', projectId));

      // Cascade delete linked subscriptions from Firestore
      for (const sub of linkedSubs) {
        try {
          await deleteDoc(doc(db, 'clientSubscriptions', sub.id));
          await deleteDoc(doc(db, 'subscriptions', sub.id));
        } catch (subErr) {
          console.warn('Erro ao excluir mensalidade vinculada:', subErr);
        }
      }

      await addNotification(
        'Projeto Removido', 
        `O projeto ID ${projectId}${linkedSubs.length > 0 ? ' e a mensalidade/contrato vinculados foram excluídos' : ''} com sucesso.`, 
        'project'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  const addFinancialTransaction = async (data: Omit<FinancialTransaction, 'id'>) => {
    const newFin: FinancialTransaction = {
      ...data,
      id: `FIN-${Date.now()}`
    };

    try {
      await setDoc(doc(db, 'financials', newFin.id), newFin);
      await addNotification('Novo Lançamento Financeiro', `${data.type === 'receita' ? 'Receita' : 'Despesa'} de R$ ${data.amount.toLocaleString('pt-BR')} cadastrada.`, 'payment');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `financials/${newFin.id}`);
    }
  };

  const updateFinancialStatus = async (id: string, status: FinancialTransaction['status'], customPaymentDate?: string) => {
    const fin = financials.find(f => f.id === id);
    if (!fin) return;

    const chosenPaymentDate = customPaymentDate || new Date().toISOString().split('T')[0];

    const updated = {
      ...fin,
      status,
      paymentDate: status === 'pago' ? chosenPaymentDate : fin.paymentDate
    };

    try {
      await setDoc(doc(db, 'financials', id), updated);
      if (status === 'pago') {
        await addNotification('Baixa efetuada', `Lançamento ${fin.title} marcado como PAGO (Data: ${chosenPaymentDate}).`, 'payment');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `financials/${id}`);
    }
  };

  const deleteFinancialTransaction = async (id: string) => {
    setFinancials(prev => prev.filter(f => f.id !== id));
    try {
      await deleteDoc(doc(db, 'financials', id));
      await addNotification('Lançamento Removido', `O lançamento financeiro foi excluído com sucesso.`, 'payment');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `financials/${id}`);
    }
  };

  const addSubscription = async (data: Omit<ClientSubscription, 'id'>) => {
    // Deduplicate if a subscription with exact clientName & serviceName already exists
    const existing = subscriptions.find(s => 
      s.clientName.toLowerCase().trim() === data.clientName.toLowerCase().trim() &&
      s.serviceName.toLowerCase().trim() === data.serviceName.toLowerCase().trim()
    );

    const subId = existing ? existing.id : `SUB-${Date.now()}`;
    const newSub: ClientSubscription = {
      ...(existing || {}),
      ...data,
      id: subId
    };

    try {
      await saveDoc('clientSubscriptions', subId, newSub);
      await addNotification('Mensalidade Salva', `Contrato de R$ ${data.monthlyValue.toLocaleString('pt-BR')}/mês salvo para ${data.clientName}.`, 'payment');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `clientSubscriptions/${subId}`);
    }
  };

  const updateSubscription = async (subId: string, data: Partial<ClientSubscription>) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    const updated: ClientSubscription = {
      ...sub,
      ...data
    };

    try {
      await saveDoc('clientSubscriptions', subId, updated);
      await addNotification('Mensalidade Atualizada', `Os dados da mensalidade de ${updated.clientName} foram alterados.`, 'payment');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `clientSubscriptions/${subId}`);
    }
  };

  const updateSubscriptionStatus = async (subId: string, status: SubscriptionStatus, nextDueDate?: string, lastPaymentDate?: string) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    const updated: ClientSubscription = {
      ...sub,
      status,
      nextDueDate: nextDueDate || sub.nextDueDate,
      lastPaymentDate: lastPaymentDate || sub.lastPaymentDate
    };

    try {
      await saveDoc('clientSubscriptions', subId, updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `clientSubscriptions/${subId}`);
    }
  };

  const deleteSubscription = async (subId: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    try {
      await deleteDoc(doc(db, 'clientSubscriptions', subId));
      await deleteDoc(doc(db, 'subscriptions', subId));
      await addNotification('Mensalidade Removida', `Assinatura/Mensalidade foi excluída com sucesso.`, 'payment');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `clientSubscriptions/${subId}`);
    }
  };

  const generateSubscriptionBilling = async (subId: string) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const monthNum = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    const newFin: FinancialTransaction = {
      id: `FIN-SUB-${Date.now()}`,
      title: `Mensalidade Mês ${monthNum} - ${sub.serviceName}`,
      type: 'receita',
      category: 'Mensalidade de Serviço',
      amount: sub.monthlyValue,
      dueDate: sub.nextDueDate || todayStr,
      status: 'pendente',
      paymentMethod: sub.paymentMethod || 'pix',
      clientName: sub.clientName,
      subscriptionId: sub.id,
      isRecurring: true
    };

    try {
      await setDoc(doc(db, 'financials', newFin.id), newFin);
      await addNotification('Fatura de Mensalidade Gerada', `Cobrança de R$ ${sub.monthlyValue.toLocaleString('pt-BR')} gerada para ${sub.clientName}.`, 'payment');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `financials/${newFin.id}`);
    }
  };

  const manualSettleSubscription = async (subId: string, customPaymentDate?: string) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    const chosenPaymentDate = customPaymentDate || new Date().toISOString().split('T')[0];
    const baseDate = new Date(chosenPaymentDate + 'T12:00:00');

    let nextYear = baseDate.getFullYear();
    let nextMonth = baseDate.getMonth() + 1;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    const cycleDay = Math.min(sub.billingCycleDay || 10, daysInNextMonth);
    const calculatedNextDueDate = new Date(nextYear, nextMonth, cycleDay).toISOString().split('T')[0];

    const updatedSub: ClientSubscription = {
      ...sub,
      status: 'ativo',
      lastPaymentDate: chosenPaymentDate,
      nextDueDate: calculatedNextDueDate
    };

    try {
      await saveDoc('clientSubscriptions', subId, updatedSub);

      const pendingFin = financials.find(f => 
        (f.subscriptionId === subId || (f.clientName === sub.clientName && (f.category.includes('Suporte') || f.category.includes('Mensalidade')))) && 
        f.status === 'pendente'
      );

      if (pendingFin) {
        await setDoc(doc(db, 'financials', pendingFin.id), {
          ...pendingFin,
          status: 'pago',
          paymentDate: chosenPaymentDate
        });
      } else {
        const paidFin: FinancialTransaction = {
          id: `FIN-PAID-${Date.now()}`,
          title: `Baixa Manual de Mensalidade - ${sub.serviceName}`,
          type: 'receita',
          category: 'Sustentação e Suporte Recorrente',
          amount: sub.monthlyValue,
          dueDate: sub.nextDueDate || chosenPaymentDate,
          paymentDate: chosenPaymentDate,
          status: 'pago',
          paymentMethod: sub.paymentMethod || 'pix',
          clientName: sub.clientName,
          subscriptionId: sub.id,
          isRecurring: true
        };
        await setDoc(doc(db, 'financials', paidFin.id), paidFin);
      }

      await addNotification(
        'Baixa Manual Concluída! 💰',
        `A mensalidade de ${sub.clientName} (${sub.serviceName}) foi baixada como PAGA (Data do pagamento: ${chosenPaymentDate}). Próximo vencimento: ${calculatedNextDueDate}.`,
        'payment'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `clientSubscriptions/${subId}`);
    }
  };

  const sendChatMessage = async (text: string, projectId?: string, attachments?: { name: string; type: string; url: string }[], isAudio?: boolean) => {
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      projectId: projectId || selectedProjectId || 'PRJ-2026-01',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      attachments,
      isAudio
    };

    try {
      await saveDoc('chatMessages', msgId, newMsg);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `chatMessages/${msgId}`);
    }

    // Simulated response if user is client
    if (currentUser.role === 'client') {
      setTimeout(async () => {
        const replyId = `msg-reply-${Date.now()}`;
        const autoReply: ChatMessage = {
          id: replyId,
          projectId: projectId || selectedProjectId || 'PRJ-2026-01',
          senderId: 'usr-1',
          senderName: 'Nikolas (NCodes Tech Lead)',
          senderRole: 'admin',
          senderAvatar: TEAM_MEMBERS[0].avatar,
          text: 'Recebido! Nossa equipe de engenharia está acompanhando sua solicitação em tempo real no Firestore.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        try {
          await saveDoc('chatMessages', replyId, autoReply);
        } catch (e) {
          console.warn('Auto reply write error:', e);
        }
      }, 1500);
    }
  };

  const createSupportTicket = async (title: string, category: string, priority: SupportTicket['priority']) => {
    const newTicket: SupportTicket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      category,
      priority,
      status: 'aberto',
      clientName: currentUser.name,
      createdAt: new Date().toLocaleString('pt-BR'),
      messagesCount: 1,
      lastUpdate: 'Agora mesmo'
    };

    try {
      await saveDoc('tickets', newTicket.id, newTicket);
      await addNotification('Novo Chamado Aberto', `Chamado ${newTicket.id} criado por ${currentUser.name}.`, 'ticket');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tickets/${newTicket.id}`);
    }
  };

  const updateLeadStage = async (leadId: string, stage: LeadCRM['stage']) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      await saveDoc('leads', leadId, { ...lead, stage });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `leads/${leadId}`);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif) return;

    try {
      await saveDoc('notifications', id, { ...notif, read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `notifications/${id}`);
    }
  };

  const clearAllNotifications = async () => {
    for (const n of notifications) {
      try {
        await deleteDoc(doc(db, 'notifications', n.id));
      } catch (err) {
        console.warn('Failed to delete notification', err);
      }
    }
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      activeView,
      setActiveView,
      selectedQuoteIdForProposal,
      setSelectedQuoteIdForProposal,
      selectedProposalIdForAcceptance,
      setSelectedProposalIdForAcceptance,
      selectedProjectId,
      setSelectedProjectId,
      selectedContractId,
      setSelectedContractId,
      isDarkMode,
      toggleTheme,
      currentUser,
      setCurrentUserRole,
      mobileSimDevice,
      setMobileSimDevice,
      isAdminAuthenticated,
      currentAdminUser,
      adminUsers,
      loginAdmin,
      logoutAdmin,
      addAdminUser,
      deleteAdminUser,
      isClientAuthenticated,
      currentClientUser,
      clientUsers,
      loginClient,
      checkEmailExists,
      registerClient,
      addClientUser,
      updateClientUser,
      deleteClientUser,
      logoutClient,
      siteConfig,
      updateSiteConfig,
      services,
      addService,
      updateService,
      deleteService,
      portfolioProjects,
      addPortfolioProject,
      updatePortfolioProject,
      deletePortfolioProject,
      quotes,
      proposals,
      projects,
      contracts,
      financials,
      subscriptions,
      chatMessages,
      tickets,
      leads,
      notifications,
      createQuoteRequest,
      createProposal,
      acceptProposal,
      generateContractForQuote,
      signContract,
      deleteContract,
      updateQuoteStatus,
      updateQuoteDetails,
      addQuoteTimelineItem,
      addQuoteAttachment,
      approveQuoteByClient,
      refuseQuoteByClient,
      requestQuoteChangesByClient,
      respondToQuoteRequest,
      convertQuoteToProject,
      deleteQuote,
      deleteProposal,
      toggleProjectTask,
      addProjectHours,
      addProjectFile,
      finalizeProjectAndStartSubscription,
      deleteProject,
      addFinancialTransaction,
      updateFinancialStatus,
      deleteFinancialTransaction,
      addSubscription,
      updateSubscription,
      updateSubscriptionStatus,
      deleteSubscription,
      generateSubscriptionBilling,
      manualSettleSubscription,
      sendChatMessage,
      createSupportTicket,
      updateLeadStage,
      markNotificationAsRead,
      clearAllNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
