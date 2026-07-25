import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEAM_MEMBERS[0]); // Default Admin
  const [mobileSimDevice, setMobileSimDevice] = useState<'iphone' | 'android'>('iphone');

  // State collections
  const [quotes, setQuotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [financials, setFinancials] = useState<FinancialTransaction[]>(INITIAL_FINANCIALS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [leads, setLeads] = useState<LeadCRM[]>(INITIAL_LEADS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Firestore Realtime Sync Effect
  useEffect(() => {
    // Seed initial collections if empty and subscribe
    const seedAndSubscribe = async () => {
      // 1. Quotes
      try {
        const qSnap = await getDocs(collection(db, 'quotes'));
        if (qSnap.empty) {
          for (const item of INITIAL_QUOTES) {
            await setDoc(doc(db, 'quotes', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Quotes check warning:', err);
      }

      const unsubQuotes = onSnapshot(collection(db, 'quotes'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data() as QuoteRequest);
          setQuotes(list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

      // 2. Proposals
      try {
        const pSnap = await getDocs(collection(db, 'proposals'));
        if (pSnap.empty) {
          for (const item of INITIAL_PROPOSALS) {
            await setDoc(doc(db, 'proposals', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Proposals check warning:', err);
      }

      const unsubProposals = onSnapshot(collection(db, 'proposals'), (snap) => {
        if (!snap.empty) {
          setProposals(snap.docs.map(d => d.data() as Proposal));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'proposals'));

      // 3. Projects
      try {
        const prjSnap = await getDocs(collection(db, 'projects'));
        if (prjSnap.empty) {
          for (const item of INITIAL_PROJECTS) {
            await setDoc(doc(db, 'projects', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Projects check warning:', err);
      }

      const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
        if (!snap.empty) {
          setProjects(snap.docs.map(d => d.data() as Project));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'projects'));

      // 4. Financials
      try {
        const finSnap = await getDocs(collection(db, 'financials'));
        if (finSnap.empty) {
          for (const item of INITIAL_FINANCIALS) {
            await setDoc(doc(db, 'financials', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Financials check warning:', err);
      }

      const unsubFinancials = onSnapshot(collection(db, 'financials'), (snap) => {
        if (!snap.empty) {
          setFinancials(snap.docs.map(d => d.data() as FinancialTransaction));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'financials'));

      // 5. Chat Messages
      try {
        const chatSnap = await getDocs(collection(db, 'chatMessages'));
        if (chatSnap.empty) {
          for (const item of INITIAL_CHAT_MESSAGES) {
            await setDoc(doc(db, 'chatMessages', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Chat check warning:', err);
      }

      const unsubChat = onSnapshot(collection(db, 'chatMessages'), (snap) => {
        if (!snap.empty) {
          const msgs = snap.docs.map(d => d.data() as ChatMessage);
          setChatMessages(msgs);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'chatMessages'));

      // 6. Tickets
      try {
        const tSnap = await getDocs(collection(db, 'tickets'));
        if (tSnap.empty) {
          for (const item of INITIAL_TICKETS) {
            await setDoc(doc(db, 'tickets', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Tickets check warning:', err);
      }

      const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
        if (!snap.empty) {
          setTickets(snap.docs.map(d => d.data() as SupportTicket));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'tickets'));

      // 7. Leads
      try {
        const lSnap = await getDocs(collection(db, 'leads'));
        if (lSnap.empty) {
          for (const item of INITIAL_LEADS) {
            await setDoc(doc(db, 'leads', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Leads check warning:', err);
      }

      const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
        if (!snap.empty) {
          setLeads(snap.docs.map(d => d.data() as LeadCRM));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'leads'));

      // 8. Notifications
      try {
        const nSnap = await getDocs(collection(db, 'notifications'));
        if (nSnap.empty) {
          for (const item of INITIAL_NOTIFICATIONS) {
            await setDoc(doc(db, 'notifications', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Notifications check warning:', err);
      }

      const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snap) => {
        if (!snap.empty) {
          setNotifications(snap.docs.map(d => d.data() as NotificationItem));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'notifications'));

      return () => {
        unsubQuotes();
        unsubProposals();
        unsubProjects();
        unsubFinancials();
        unsubChat();
        unsubTickets();
        unsubLeads();
        unsubNotifs();
      };
    };

    seedAndSubscribe();
  }, []);

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
      link
    };
    try {
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
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

    await addNotification('Novo Orçamento Recebido!', `${data.clientName} (${data.company}) enviou uma solicitação para ${data.projectType}.`, 'quote');

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

      await setDoc(doc(db, 'projects', newProjectId), newProject);

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

      await setDoc(doc(db, 'financials', newFinancial.id), newFinancial);

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
      await setDoc(doc(db, 'leads', newLead.id), newLead);

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

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus) => {
    const q = quotes.find(item => item.id === quoteId);
    if (q) {
      const updated = { ...q, status, updatedAt: new Date().toISOString() };
      try {
        await setDoc(doc(db, 'quotes', quoteId), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
      }
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
      await setDoc(doc(db, 'chatMessages', msgId), newMsg);
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
          await setDoc(doc(db, 'chatMessages', replyId), autoReply);
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
      await setDoc(doc(db, 'tickets', newTicket.id), newTicket);
      await addNotification('Novo Chamado Aberto', `Chamado ${newTicket.id} criado por ${currentUser.name}.`, 'ticket');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tickets/${newTicket.id}`);
    }
  };

  const updateLeadStage = async (leadId: string, stage: LeadCRM['stage']) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      await setDoc(doc(db, 'leads', leadId), { ...lead, stage });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `leads/${leadId}`);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif) return;

    try {
      await setDoc(doc(db, 'notifications', id), { ...notif, read: true });
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
