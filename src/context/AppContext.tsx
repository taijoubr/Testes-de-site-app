import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
  QuoteStatus
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
  INITIAL_NOTIFICATIONS 
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
  | 'admin_panel' 
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

  // Data collections
  quotes: QuoteRequest[];
  proposals: Proposal[];
  projects: Project[];
  financials: FinancialTransaction[];
  chatMessages: ChatMessage[];
  tickets: SupportTicket[];
  leads: LeadCRM[];
  notifications: NotificationItem[];

  // Actions
  createQuoteRequest: (data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<QuoteRequest>;
  createProposal: (data: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => Proposal;
  acceptProposal: (proposalId: string, signatureName: string) => Promise<void>;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => void;
  
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectHours: (projectId: string, hours: number) => void;
  addProjectFile: (projectId: string, fileName: string, size: string, type: 'pdf' | 'doc' | 'image' | 'code' | 'zip') => void;
  
  addFinancialTransaction: (data: Omit<FinancialTransaction, 'id'>) => void;
  updateFinancialStatus: (id: string, status: FinancialTransaction['status']) => void;
  
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
  const [selectedProposalIdForAcceptance, setSelectedProposalIdForAcceptance] = useState<string | undefined>('PROP-2026-001');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>('PRJ-2026-01');
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEAM_MEMBERS[0]); // Default Admin Nikolas
  const [mobileSimDevice, setMobileSimDevice] = useState<'iphone' | 'android'>('iphone');

  // Load or fallback data
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('ncodes_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('ncodes_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ncodes_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [financials, setFinancials] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('ncodes_financials');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ncodes_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('ncodes_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [leads, setLeads] = useState<LeadCRM[]>(() => {
    const saved = localStorage.getItem('ncodes_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ncodes_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('ncodes_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('ncodes_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('ncodes_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ncodes_financials', JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem('ncodes_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('ncodes_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('ncodes_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('ncodes_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
  const addNotification = (title: string, description: string, type: NotificationItem['type'], link?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      description,
      type,
      timestamp: 'Agora mesmo',
      read: false,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
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

    // Save initial
    setQuotes(prev => [newQuote, ...prev]);
    addNotification('Novo Orçamento Recebido!', `${data.clientName} (${data.company}) enviou uma solicitação para ${data.projectType}.`, 'quote');

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
          setQuotes(prev => prev.map(q => q.id === newId ? {
            ...q,
            status: 'em_analise',
            aiAnalysis: json.analysis
          } : q));
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

    setProposals(prev => [newProposal, ...prev]);

    // Update Quote status
    setQuotes(prev => prev.map(q => q.id === data.quoteId ? {
      ...q,
      status: 'proposta_enviada',
      proposalId: newPropId,
      updatedAt: new Date().toISOString()
    } : q));

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

    // Update proposal
    setProposals(prev => prev.map(p => p.id === proposalId ? {
      ...p,
      status: 'aceito',
      acceptedAt: now,
      clientIp: simulatedIp,
      clientDevice: simulatedDevice,
      signatureName
    } : p));

    // Update associated quote status to aprovado
    setQuotes(prev => prev.map(q => q.id === prop.quoteId ? {
      ...q,
      status: 'aprovado',
      updatedAt: now
    } : q));

    // Automatically instantiate a new Project!
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

    setProjects(prev => [newProject, ...prev]);

    // Automatically create initial entry invoice (30% entry fee)
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

    setFinancials(prev => [newFinancial, ...prev]);

    // Add Lead conversion in CRM
    setLeads(prev => [
      {
        id: `lead-conv-${Date.now()}`,
        name: signatureName,
        company: prop.company || 'Empresa',
        email: 'cliente@ncodes.com.br',
        phone: '(11) 99999-9999',
        stage: 'ganho',
        value: prop.totalValue,
        nextFollowUp: 'Projeto em Andamento'
      },
      ...prev
    ]);

    addNotification('Proposta Aprovada Digitalmente! 🎉', `${prop.clientName} assinou o contrato da proposta ${proposalId}. Projeto ${newProjectId} iniciado!`, 'project');

    // Trigger visual celebration confetti!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const updateQuoteStatus = (quoteId: string, status: QuoteStatus) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status, updatedAt: new Date().toISOString() } : q));
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(prj => {
      if (prj.id !== projectId) return prj;
      const updatedTasks = prj.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const progress = Math.round((completedCount / updatedTasks.length) * 100);
      return {
        ...prj,
        tasks: updatedTasks,
        progressPercentage: progress
      };
    }));
  };

  const addProjectHours = (projectId: string, hours: number) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      completedHours: p.completedHours + hours
    } : p));
  };

  const addProjectFile = (projectId: string, name: string, size: string, type: 'pdf' | 'doc' | 'image' | 'code' | 'zip') => {
    const newFile = {
      id: `f-${Date.now()}`,
      name,
      size,
      uploadedBy: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      type,
      url: '#'
    };
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      files: [newFile, ...p.files]
    } : p));

    addNotification('Novo Arquivo Adicionado', `${currentUser.name} enviou o arquivo ${name} para o projeto.`, 'project');
  };

  const addFinancialTransaction = (data: Omit<FinancialTransaction, 'id'>) => {
    const newFin: FinancialTransaction = {
      ...data,
      id: `FIN-${Date.now()}`
    };
    setFinancials(prev => [newFin, ...prev]);
    addNotification('Novo Lançamento Financeiro', `${data.type === 'receita' ? 'Receita' : 'Despesa'} de R$ ${data.amount.toLocaleString('pt-BR')} cadastrada.`, 'payment');
  };

  const updateFinancialStatus = (id: string, status: FinancialTransaction['status']) => {
    setFinancials(prev => prev.map(f => f.id === id ? {
      ...f,
      status,
      paymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : f.paymentDate
    } : f));
  };

  const sendChatMessage = (text: string, projectId?: string, attachments?: { name: string; type: string; url: string }[], isAudio?: boolean) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
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

    setChatMessages(prev => [...prev, newMsg]);

    // Simulated response if user is client
    if (currentUser.role === 'client') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          projectId: projectId || selectedProjectId || 'PRJ-2026-01',
          senderId: 'usr-1',
          senderName: 'Nikolas (NCodes Tech Lead)',
          senderRole: 'admin',
          senderAvatar: TEAM_MEMBERS[0].avatar,
          text: 'Recebido! Nossa equipe de engenharia está acompanhando sua solicitação.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(p => [...p, autoReply]);
      }, 1500);
    }
  };

  const createSupportTicket = (title: string, category: string, priority: SupportTicket['priority']) => {
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

    setTickets(prev => [newTicket, ...prev]);
    addNotification('Novo Chamado Aberto', `Chamado ${newTicket.id} criado por ${currentUser.name}.`, 'ticket');
  };

  const updateLeadStage = (leadId: string, stage: LeadCRM['stage']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
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
      quotes,
      proposals,
      projects,
      financials,
      chatMessages,
      tickets,
      leads,
      notifications,
      createQuoteRequest,
      createProposal,
      acceptProposal,
      updateQuoteStatus,
      toggleProjectTask,
      addProjectHours,
      addProjectFile,
      addFinancialTransaction,
      updateFinancialStatus,
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
