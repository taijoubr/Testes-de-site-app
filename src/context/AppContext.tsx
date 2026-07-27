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
  ServiceItem
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
  INITIAL_SERVICES
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

  // Data collections
  quotes: QuoteRequest[];
  proposals: Proposal[];
  projects: Project[];
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
  updateQuoteStatus: (quoteId: string, status: QuoteStatus, customMessage?: string) => Promise<void>;
  deleteQuote: (quoteId: string) => Promise<void>;
  
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectHours: (projectId: string, hours: number) => void;
  addProjectFile: (projectId: string, fileName: string, size: string, type: 'pdf' | 'doc' | 'image' | 'code' | 'zip') => void;
  
  addFinancialTransaction: (data: Omit<FinancialTransaction, 'id'>) => void;
  updateFinancialStatus: (id: string, status: FinancialTransaction['status']) => void;

  // Subscriptions & Monthly Fees Actions
  addSubscription: (data: Omit<ClientSubscription, 'id'>) => Promise<void>;
  updateSubscription: (subId: string, data: Partial<ClientSubscription>) => Promise<void>;
  updateSubscriptionStatus: (subId: string, status: SubscriptionStatus, nextDueDate?: string, lastPaymentDate?: string) => Promise<void>;
  deleteSubscription: (subId: string) => Promise<void>;
  generateSubscriptionBilling: (subId: string) => Promise<void>;
  
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
  const [quotes, setQuotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
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

      return () => {
        unsubQuotes();
        unsubProposals();
        unsubProjects();
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
      
      // Send email alert to configured admin email
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
        console.warn('E-mail dispatch error (new client):', eErr);
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
      await deleteDoc(doc(db, 'clientUsers', id));
      await addNotification('Cliente Removido', `O cadastro do cliente foi removido.`, 'project');
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

    await addNotification('Novo Orçamento Recebido!', `${data.clientName} (${data.company}) enviou uma nova solicitação de orçamento.`, 'quote');

    // Send email alert to configured admin email
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
      console.warn('E-mail dispatch error (new quote):', eErr);
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

  // Digital Acceptance Flow
  const acceptProposal = async (proposalId: string, signatureName: string) => {
    const now = new Date().toISOString();
    const simulatedIp = '187.58.122.94';
    const simulatedDevice = `${navigator.platform} - ${navigator.userAgent.slice(0, 40)}...`;

    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return;

    try {
      // Update proposal in Firestore
      await setDoc(doc(db, 'proposals', proposalId), {
        ...prop,
        status: 'aceito',
        acceptedAt: now,
        clientIp: simulatedIp,
        clientDevice: simulatedDevice,
        signatureName
      });

      // Update associated quote status to aprovado in Firestore
      if (prop.quoteId) {
        const qToUpdate = quotes.find(q => q.id === prop.quoteId);
        if (qToUpdate) {
          await setDoc(doc(db, 'quotes', prop.quoteId), {
            ...qToUpdate,
            status: 'aprovado',
            updatedAt: now
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
        tasks: [
          { id: `t-${Date.now()}-1`, title: 'Reunião de Kick-off & Definição de Protótipos', completed: true, category: 'Gestão' },
          { id: `t-${Date.now()}-2`, title: 'Configuração dos Ambientes de Staging & Firestore', completed: false, category: 'DevOps' },
          { id: `t-${Date.now()}-3`, title: 'Desenvolvimento do Módulo Principal', completed: false, category: 'Dev' },
          { id: `t-${Date.now()}-4`, title: 'Homologação e Teste de Aceite com Cliente', completed: false, category: 'QA' }
        ],
        files: [
          { id: `f-${Date.now()}`, name: `Contrato_Assinado_${proposalId}.pdf`, size: '1.8 MB', uploadedBy: signatureName, date: now.split('T')[0], type: 'pdf', url: '#' }
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
      const subValue = prop.recurringMonthlyValue && prop.recurringMonthlyValue > 0 ? prop.recurringMonthlyValue : Math.round(prop.totalValue / 12);
      const subId = `SUB-PROP-${Date.now()}`;
      const today = new Date();
      const nextDue = new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString().split('T')[0];
      const defaultPix = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${subValue}.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304`;

      const autoSub: ClientSubscription = {
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
        ...(prop.quoteId ? { quoteId: prop.quoteId } : {}),
        billingType: prop.recurringMonthlyValue && prop.recurringMonthlyValue > 0 ? 'recorrente' : 'valor_unico',
        oneTimeTotalValue: prop.totalValue
      };
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

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, customMessage?: string) => {
    const q = quotes.find(item => item.id === quoteId);
    if (q) {
      const updated = { 
        ...q, 
        status, 
        adminNotes: customMessage || q.adminNotes,
        updatedAt: new Date().toISOString() 
      };
      try {
        await setDoc(doc(db, 'quotes', quoteId), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
      }

      const statusLabels: Record<QuoteStatus, string> = {
        solicitado: 'Solicitado',
        em_analise: 'Em Análise Técnica',
        em_elaboracao: 'Em Elaboração de Proposta',
        proposta_enviada: 'Proposta Emitida',
        em_negociacao: 'Em Negociação',
        aprovado: 'Aprovado / Em Execução',
        rejeitado: 'Recusado',
        cancelado: 'Cancelado'
      };

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
        `Status do orçamento #${quoteId} (${q.clientName}) alterado para ${statusLabels[status] || status}. E-mail enviado ao cliente.`,
        'quote'
      );
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

  const updateFinancialStatus = async (id: string, status: FinancialTransaction['status']) => {
    const fin = financials.find(f => f.id === id);
    if (!fin) return;

    const updated = {
      ...fin,
      status,
      paymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : fin.paymentDate
    };

    try {
      await setDoc(doc(db, 'financials', id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `financials/${id}`);
    }
  };

  const addSubscription = async (data: Omit<ClientSubscription, 'id'>) => {
    const subId = `SUB-${Date.now()}`;
    const newSub: ClientSubscription = {
      ...data,
      id: subId
    };
    try {
      await saveDoc('clientSubscriptions', subId, newSub);
      await addNotification('Nova Mensalidade Cadastrada', `Contrato de R$ ${data.monthlyValue.toLocaleString('pt-BR')}/mês cadastrado para ${data.clientName}.`, 'payment');
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
    try {
      await deleteDoc(doc(db, 'clientSubscriptions', subId));
      await addNotification('Mensalidade Removida', `Assinatura ${subId} foi removida.`, 'payment');
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
      quotes,
      proposals,
      projects,
      financials,
      subscriptions,
      chatMessages,
      tickets,
      leads,
      notifications,
      createQuoteRequest,
      createProposal,
      acceptProposal,
      updateQuoteStatus,
      deleteQuote,
      toggleProjectTask,
      addProjectHours,
      addProjectFile,
      addFinancialTransaction,
      updateFinancialStatus,
      addSubscription,
      updateSubscription,
      updateSubscriptionStatus,
      deleteSubscription,
      generateSubscriptionBilling,
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
