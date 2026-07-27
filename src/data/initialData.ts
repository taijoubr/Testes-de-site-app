import { 
  ServiceItem, 
  PortfolioProject, 
  QuoteRequest, 
  Proposal, 
  Project, 
  FinancialTransaction, 
  ChatMessage, 
  SupportTicket, 
  LeadCRM,
  UserProfile,
  NotificationItem,
  AdminUser,
  ClientUser,
  ClientSubscription,
  SiteConfig
} from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Desenvolvimento de Sites & Portais',
    slug: 'sites',
    iconName: 'Globe',
    shortDesc: 'Sites institucionais e portais web de alta performance com design ultra moderno.',
    description: 'Criamos experiências web responsivas com foco em SEO, tempos de carregamento instantâneos e conversion rate optimization (CRO).',
    benefits: ['Performance Lighthouse 95+', 'Design Responsivo Adaptativo', 'Painel de Gestão Amigável', 'Otimização Técnica para SEO'],
    technologies: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    avgTime: '2 a 4 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's2',
    title: 'Aplicativos Mobile iOS & Android',
    slug: 'apps',
    iconName: 'Smartphone',
    shortDesc: 'Aplicativos nativos e multiplataforma sincronizados em tempo real.',
    description: 'Desenvolvimento completo de apps em Flutter/React Native com notificações push, autenticação biométrica e arquitetura offline-first.',
    benefits: ['Código único para iOS & Android', 'Interface Material Design 3', 'Sincronização em Tempo Real', 'Publicação nas lojas Apple e Google'],
    technologies: ['Flutter', 'Dart', 'Firebase', 'REST/GraphQL', 'SQLite'],
    avgTime: '4 a 8 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's3',
    title: 'Sistemas Web Empresariais',
    slug: 'sistemas-web',
    iconName: 'Cpu',
    shortDesc: 'Plataformas SaaS, ERPs, CRMs e painéis administrativos para automação de processos.',
    description: 'Sistemas complexos sob medida construídos com segurança de nível bancário, relatórios em gráficos dinâmicos e controle refinado de permissões.',
    benefits: ['Controle Avançado de Acesso', 'Relatórios & BI Interativos', 'Exportação PDF/Excel', 'Arquitetura Escalável em Nuvem'],
    technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Firestore', 'React'],
    avgTime: '6 a 12 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's4',
    title: 'Landing Pages de Alta Conversão',
    slug: 'landing-pages',
    iconName: 'Zap',
    shortDesc: 'Páginas focadas em vendas, captura de leads e lançamento de produtos digitais.',
    description: 'Design persuasivo baseado em comportamento do usuário, testes A/B, integrações com WhatsApp e pixels de rastreamento de anúncios.',
    benefits: ['Copywriting Estratégico', 'Integração Direta no WhatsApp', 'Carregamento Ultra Rápido', 'Captura Automática de Leads'],
    technologies: ['React', 'Tailwind CSS', 'Motion', 'Vercel Analytics'],
    avgTime: '1 a 2 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's5',
    title: 'Automações & Inteligência Artificial',
    slug: 'automacoes',
    iconName: 'Bot',
    shortDesc: 'Automação de workflows, robôs de atendimento e modelos IA integrados.',
    description: 'Elimine tarefas repetitivas integrando Gemini AI, OpenAI, WhatsApp API e fluxos operacionais automatizados.',
    benefits: ['Atendimento 24/7 Automatizado', 'Redução de Custos Operacionais', 'Processamento de Documentos por IA', 'Disparo de Alertas em Tempo Real'],
    technologies: ['Gemini API', 'Python', 'Node.js', 'n8n', 'WhatsApp Cloud API'],
    avgTime: '2 a 5 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's6',
    title: 'APIs & Integrações de Sistemas',
    slug: 'apis',
    iconName: 'Layers',
    shortDesc: 'Conexão segura entre sistemas legados, gateways de pagamento e plataformas terceiras.',
    description: 'Desenvolvimento de APIs RESTful e GraphQL documentadas, escaláveis e protegidas contra falhas e ataques.',
    benefits: ['Documentação Swagger/OpenAPI', 'Integração com Pix, Stripe, PagSeguro', 'Autenticação JWT / OAuth2', 'Webhooks em Tempo Real'],
    technologies: ['Express', 'Node.js', 'PostgreSQL', 'Docker', 'Swagger'],
    avgTime: '2 a 4 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's7',
    title: 'Sistemas Financeiros & Pix',
    slug: 'financeiro',
    iconName: 'DollarSign',
    shortDesc: 'Módulos de gestão de caixa, geração de cobranças Pix, faturamento e relatórios.',
    description: 'Gestão completa de assinaturas, controle de parcelas, emissão automatizada de boletos e chave Pix Copia e Cola.',
    benefits: ['Conciliação Bancária Automática', 'Gráficos de DRE e Fluxo de Caixa', 'Avisos Automáticos de Vencimento', 'Ambiente Seguro Auditado'],
    technologies: ['React', 'Chart.js / Recharts', 'PostgreSQL', 'Asaas / Mercado Pago API'],
    avgTime: '4 a 8 semanas',
    startingPrice: 'Sob Orçamento'
  },
  {
    id: 's8',
    title: 'Sistemas Personalizados Sob Medida',
    slug: 'personalizados',
    iconName: 'Code',
    shortDesc: 'Soluções customizadas de ponta a ponta para demandas tecnológicas exclusivas.',
    description: 'Análise detalhada do problema de negócio e arquitetura sob medida para transformar conceitos inéditos em produtos de alta tecnologia.',
    benefits: ['Arquitetura MVVM / Clean Architecture', 'Código Proprietário do Cliente', 'Suporte Técnico e SLA Garantido', 'Escalabilidade Global'],
    technologies: ['TypeScript', 'Flutter', 'Cloud Run', 'Firebase', 'Docker'],
    avgTime: '6 a 16 semanas',
    startingPrice: 'Sob Orçamento'
  }
];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'p1',
    title: 'PayNext FinTech App',
    subtitle: 'Plataforma de Pagamentos Pix e Gestão de Carteiras Digitais',
    category: 'Mobile',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    description: 'Aplicativo iOS/Android com autorização biométrica, transferências instantâneas Pix, extrato inteligente com categorias e emissão de cobranças.',
    tags: ['Flutter', 'Firebase', 'Pix API', 'Clean Architecture', 'Node.js'],
    metrics: '+45.000 usuários ativos e R$ 12M+ transacionados',
    clientName: 'PayNext Brasil',
    year: '2025'
  },
  {
    id: 'p2',
    title: 'LogiExpress Gestão de Frotas',
    subtitle: 'Sistema Web e App para Rastreamento em Tempo Real',
    category: 'Sistemas',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    description: 'Painel administrativo logístico completo integrado com aplicativo móvel para motoristas com roteirização, comprovante digital e alertas via FCM.',
    tags: ['React', 'Flutter', 'Google Maps API', 'Firestore', 'Node.js'],
    metrics: 'Redução de 32% no tempo de entrega',
    clientName: 'LogiExpress Logística',
    year: '2025'
  },
  {
    id: 'p3',
    title: 'Portal Saúde360 Telemedicina',
    subtitle: 'Plataforma de Consultas Online e Prontuário Eletrônico',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    description: 'Sistema web seguro para agendamento, salas de videoconferência com WebRTC, assinatura digital de receitas e prontuário criptografado.',
    tags: ['Next.js', 'TypeScript', 'WebRTC', 'Tailwind CSS', 'PostgreSQL'],
    metrics: 'Atendimento de mais de 10.000 consultas médicas',
    clientName: 'Grupo Saúde360',
    year: '2026'
  },
  {
    id: 'p4',
    title: 'CRM SalesFlow Pro',
    subtitle: 'SaaS para Gestão de Pipelines de Vendas com IA',
    category: 'Sistemas',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    description: 'Software de automação comercial com funil de vendas drag-and-drop, análise preditiva de conversão com Gemini AI e sincronização com WhatsApp.',
    tags: ['React', 'Gemini AI', 'Node.js', 'Express', 'Recharts'],
    metrics: 'Aumento médio de 28% no fechamento de contratos',
    clientName: 'SalesFlow Corp',
    year: '2025'
  },
  {
    id: 'p5',
    title: 'TechStore E-commerce Ultra Fast',
    subtitle: 'Loja Virtual Headless com Checkout Transparente',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=80',
    description: 'Loja virtual com tempo de resposta em menos de 100ms, filtros em tempo real, integração com gateways Pix/Cartão e calculador de frete expresso.',
    tags: ['Vite', 'React', 'Tailwind CSS', 'Stripe API', 'Cloudflare'],
    metrics: 'Taxa de conversão 4.2% (dobro da média de mercado)',
    clientName: 'TechStore Brasil',
    year: '2026'
  },
  {
    id: 'p6',
    title: 'BotAtende IA para Imobiliárias',
    subtitle: 'Atendimento Inteligente e Qualificação de Leads',
    category: 'IA',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    description: 'Assistente virtual treinado com portfólio imobiliário capaz de responder dúvidas, agendar visitas e qualificar compradores 24 horas por dia.',
    tags: ['Gemini API', 'Node.js', 'WhatsApp Cloud API', 'Firestore'],
    metrics: 'Mais de 180.000 mensagens processadas sem intervenção humana',
    clientName: 'ImobiGroup',
    year: '2026'
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [];

export const INITIAL_PROPOSALS: Proposal[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_FINANCIALS: FinancialTransaction[] = [];

export const INITIAL_SUBSCRIPTIONS: ClientSubscription[] = [];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_LEADS: LeadCRM[] = [];

export const TEAM_MEMBERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Nikolas P.',
    email: 'nikolas@ncodes.com.br',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    company: 'NCodes Technologies',
    phone: '(11) 99999-0001'
  },
  {
    id: 'usr-2',
    name: 'Gabriel Souza',
    email: 'gabriel@ncodes.com.br',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    company: 'NCodes Technologies'
  },
  {
    id: 'usr-3',
    name: 'Amanda Lima',
    email: 'amanda@ncodes.com.br',
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    company: 'NCodes Technologies'
  },
  {
    id: 'usr-4',
    name: 'Juliana Costa',
    email: 'juliana@ncodes.com.br',
    role: 'financial',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    company: 'NCodes Technologies'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Nikolas',
    username: 'Nikolas',
    passwordHash: 'Taijou13!',
    roleTitle: 'Administrador Master',
    createdAt: '2026-01-10T10:00:00.000Z',
    addedBy: 'Sistema NCodes'
  }
];

export const INITIAL_CLIENT_USERS: ClientUser[] = [];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  id: 'main',
  companyName: 'NCodes Technologies',
  logoUrl: '',
  heroBadge: 'Cadastre-se e solicite seu orçamento online',
  heroTitle: 'Transformamos Ideias em Software de Alto Desempenho',
  heroSubtitle: 'Desenvolvemos ecossistemas tecnológicos completos: aplicativos móveis, sistemas web empresariais, automações com IA e APIs na nuvem. Cadastre-se na nossa Área do Cliente para solicitar seu orçamento de forma rápida e segura.',
  phone: '(11) 99887-6655',
  whatsapp: '5511998876655',
  email: 'contato@ncodestechnologies.com.br',
  notificationEmail: 'contato@ncodestechnologies.com.br',
  address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  announcementBanner: '',
  isAnnouncementActive: false,
  primaryColor: '#2563eb',
  maintenanceMode: false,
  lastUpdated: '25/07/2026 12:00',
  updatedBy: 'Admin Master'
};
