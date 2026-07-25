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
    startingPrice: 'R$ 4.500'
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
    startingPrice: 'R$ 9.800'
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
    startingPrice: 'R$ 14.000'
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
    startingPrice: 'R$ 2.800'
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
    startingPrice: 'R$ 5.500'
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
    startingPrice: 'R$ 4.200'
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
    startingPrice: 'R$ 8.900'
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
    startingPrice: 'Sob Consulta'
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

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'ORC-2026-001',
    clientName: 'Lucas Ferreira',
    company: 'FinTech Alfa',
    email: 'lucas@fintechalfa.com.br',
    phone: '(11) 98877-6655',
    whatsapp: '(11) 98877-6655',
    city: 'São Paulo',
    state: 'SP',
    projectType: 'Aplicativo Mobile iOS/Android + Painel Web',
    description: 'Preciso de um aplicativo de investimentos com módulo Pix, extrato detalhado, notificações push de compras e painel web administrativo para gestão de usuários e auditoria.',
    deadline: '60 dias',
    budgetRange: 'R$ 20.000 a R$ 40.000',
    status: 'proposta_enviada',
    createdAt: '2026-07-20T10:30:00Z',
    updatedAt: '2026-07-21T14:15:00Z',
    aiAnalysis: {
      recommendedTech: ['Flutter', 'Firebase', 'Express', 'Node.js', 'Firestore', 'Pix API'],
      estimatedHours: 180,
      suggestedBudget: 28500,
      complexity: 'Alta',
      summary: 'Projeto de alta prioridade. Requer autenticação por biometria, integrações financeiras seguras e websockets para atualização de saldo em tempo real.'
    },
    proposalId: 'PROP-2026-001'
  },
  {
    id: 'ORC-2026-002',
    clientName: 'Mariana Santos',
    company: 'Clinica Vivence',
    email: 'mariana@clinicavivence.com.br',
    phone: '(21) 97654-3210',
    whatsapp: '(21) 97654-3210',
    city: 'Rio de Janeiro',
    state: 'RJ',
    projectType: 'Sistema Web de Agendamento + WhatsApp Bot',
    description: 'Queremos automatizar o agendamento de consultas médicas com envio de lembretes automáticos no WhatsApp 24h antes e prontuário online.',
    deadline: '30 dias',
    budgetRange: 'R$ 10.000 a R$ 20.000',
    status: 'em_analise',
    createdAt: '2026-07-22T16:00:00Z',
    updatedAt: '2026-07-22T16:00:00Z',
    aiAnalysis: {
      recommendedTech: ['React', 'Gemini API', 'WhatsApp API', 'Node.js', 'Tailwind CSS'],
      estimatedHours: 95,
      suggestedBudget: 14200,
      complexity: 'Média',
      summary: 'Sistema focado em UX com integração de WhatsApp para confirmação de presenças e redução de faltas.'
    }
  },
  {
    id: 'ORC-2026-003',
    clientName: 'Rodrigo Mendonça',
    company: 'RM Distribuidora',
    email: 'rodrigo@rmdistribuidora.com.br',
    phone: '(31) 99123-4567',
    whatsapp: '(31) 99123-4567',
    city: 'Belo Horizonte',
    state: 'MG',
    projectType: 'Sistema de Gestão de Estoque & Faturamento',
    description: 'Sistema interno para controle de entradas/saídas de mercadorias, conciliação Pix/boleto e emissão de notas fiscais.',
    deadline: '45 dias',
    budgetRange: 'R$ 15.000 a R$ 30.000',
    status: 'solicitado',
    createdAt: '2026-07-24T18:20:00Z',
    updatedAt: '2026-07-24T18:20:00Z'
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-2026-001',
    quoteId: 'ORC-2026-001',
    title: 'Proposta Técnica e Comercial - App FinTech Alfa',
    clientName: 'Lucas Ferreira',
    company: 'FinTech Alfa',
    description: 'Desenvolvimento completo de aplicativo nativo multiplataforma (iOS & Android) com suporte a Pix, segurança reforçada e Painel Web para gestão e relatórios.',
    scope: [
      'Desenvolvimento do App Mobile em Flutter (iOS & Android)',
      'Design UI/UX com diretrizes Material Design 3 e Tema Escuro/Claro',
      'Módulo de Autenticação com biometria e criptografia de chave de acesso',
      'Integração com Gateway de Pagamento Pix com geração de QR Code e Copia e Cola',
      'Painel Administrativo Web em React com gráficos e auditoria em tempo real',
      'Notificações Push com Firebase Cloud Messaging (FCM)',
      'Infraestrutura Cloud Run / Firebase com banco de dados Firestore em tempo real'
    ],
    schedule: [
      { phase: 'Fase 1 - Arquitetura & UX Design', duration: '10 dias', deliverable: 'Protótipo navegável Figma e documento de arquitetura da API' },
      { phase: 'Fase 2 - App Mobile (Módulo Base & Pix)', duration: '20 dias', deliverable: 'App com login biométrico, saldo e extrato instantâneo' },
      { phase: 'Fase 3 - Painel Web Admin & Notificações', duration: '15 dias', deliverable: 'Painel completo com controle de usuários e disparo FCM' },
      { phase: 'Fase 4 - Testes, Homologação e Publicação', duration: '15 dias', deliverable: 'Envio para App Store e Google Play Store + Treinamento da equipe' }
    ],
    totalValue: 28500,
    paymentTerms: '30% de entrada no aceite digital (R$ 8.550) + 3 parcelas mensais de R$ 6.650 via Pix ou Boleto.',
    contractText: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE

CONTRATADA: NCODES TECHNOLOGIES LTDA, inscrita no CNPJ/MF sob o nº 00.000.000/0001-00, sediada na Av. Paulista, São Paulo - SP.
CONTRATANTE: FINTECH ALFA LTDA, representada por Lucas Ferreira.

1. OBJETO DO CONTRATO: A CONTRATADA compromete-se a desenvolver a solução de software conforme especificada no escopo e cronograma aprovados nesta proposta.
2. PROPRIEDADE INTELECTUAL: Após a quitação integral do valor acordado, todo o código-fonte desenvolvido será de propriedade exclusiva do CONTRATANTE.
3. CONFIDENCIALIDADE (NDA): Ambas as partes comprometem-se a manter sigilo absoluto sobre todas as informações operacionais e financeiras compartilhadas.
4. GARANTIA E SUPORTE: A CONTRATADA oferece garantia técnica de 90 (noventa) dias após a publicação oficial nas lojas para correção de eventuais inconsistências ou falhas no software.
5. ACEITE DIGITAL: O aceite do presente contrato é efetuado eletronicamente através de validação de IP, dados do dispositivo, data/hora e assinatura do representante legal.`,
    status: 'pendente',
    createdAt: '2026-07-21T14:15:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-2026-01',
    title: 'PayNext App & Web Platform',
    clientName: 'PayNext Brasil',
    clientId: 'cli-01',
    category: 'Mobile & Web',
    description: 'Ecossistema completo de pagamentos Pix, extrato inteligente e gestão de cartões de débito virtual.',
    status: 'em_andamento',
    progressPercentage: 75,
    estimatedHours: 220,
    completedHours: 165,
    team: ['Nikolas (Tech Lead)', 'Gabriel (Flutter Dev)', 'Amanda (UI/UX Designer)', 'Carlos (Backend Node)'],
    technologies: ['Flutter', 'Node.js', 'Firestore', 'TypeScript', 'Docker'],
    startDate: '2026-05-10',
    endDate: '2026-08-30',
    tasks: [
      { id: 't1', title: 'Integração do Gateway Pix Copia e Cola', completed: true, category: 'Backend', assignee: 'Carlos' },
      { id: 't2', title: 'Tela de Autenticação Biométrica iOS/Android', completed: true, category: 'Mobile', assignee: 'Gabriel' },
      { id: 't3', title: 'Painel Web de Conciliação Financeira', completed: true, category: 'Frontend', assignee: 'Nikolas' },
      { id: 't4', title: 'Notificações Push via FCM na confirmação de pagamento', completed: false, category: 'DevOps', assignee: 'Carlos' },
      { id: 't5', title: 'Ajustes finais de acessibilidade e tema escuro', completed: false, category: 'Design', assignee: 'Amanda' }
    ],
    files: [
      { id: 'f1', name: 'Manual_Integracao_Pix_v2.pdf', size: '2.4 MB', uploadedBy: 'Carlos', date: '2026-06-12', type: 'pdf', url: '#' },
      { id: 'f2', name: 'Layout_Mobile_Figma_Export.zip', size: '18.5 MB', uploadedBy: 'Amanda', date: '2026-05-18', type: 'zip', url: '#' }
    ]
  },
  {
    id: 'PRJ-2026-02',
    title: 'Plataforma Saúde360 Telemedicina',
    clientName: 'Grupo Saúde360',
    clientId: 'cli-02',
    category: 'Sistemas Web',
    description: 'Sistema web seguro para agendamento de consultas com vídeo salas integradas.',
    status: 'em_revisao',
    progressPercentage: 92,
    estimatedHours: 150,
    completedHours: 140,
    team: ['Nikolas (Tech Lead)', 'Juliana (Frontend React)', 'Eduardo (DevOps)'],
    technologies: ['React', 'Next.js', 'WebRTC', 'Tailwind CSS'],
    startDate: '2026-04-01',
    endDate: '2026-08-10',
    tasks: [
      { id: 't10', title: 'Implementar salas de vídeo WebRTC criptografadas', completed: true, category: 'Core', assignee: 'Nikolas' },
      { id: 't11', title: 'Assinatura digital de receita médica em PDF', completed: true, category: 'Security', assignee: 'Juliana' },
      { id: 't12', title: 'Testes de carga e homologação com 50 medicos simultaneos', completed: false, category: 'QA', assignee: 'Eduardo' }
    ],
    files: [
      { id: 'f10', name: 'Certificado_LGPD_Auditoria.pdf', size: '1.2 MB', uploadedBy: 'Nikolas', date: '2026-07-01', type: 'pdf', url: '#' }
    ]
  }
];

export const INITIAL_FINANCIALS: FinancialTransaction[] = [
  {
    id: 'FIN-101',
    title: 'Parcela 2/3 - Projeto PayNext App',
    type: 'receita',
    category: 'Desenvolvimento de Software',
    amount: 9500,
    dueDate: '2026-07-15',
    paymentDate: '2026-07-14',
    status: 'pago',
    paymentMethod: 'pix',
    clientName: 'PayNext Brasil',
    projectId: 'PRJ-2026-01'
  },
  {
    id: 'FIN-102',
    title: 'Parcela Final - Plataforma Saúde360',
    type: 'receita',
    category: 'Desenvolvimento de Software',
    amount: 12000,
    dueDate: '2026-08-05',
    status: 'pendente',
    paymentMethod: 'pix',
    clientName: 'Grupo Saúde360',
    projectId: 'PRJ-2026-02'
  },
  {
    id: 'FIN-103',
    title: 'Entrada 30% - App FinTech Alfa',
    type: 'receita',
    category: 'Desenvolvimento de Software',
    amount: 8550,
    dueDate: '2026-07-28',
    status: 'pendente',
    paymentMethod: 'pix',
    clientName: 'Lucas Ferreira',
    projectId: 'PRJ-2026-03'
  },
  {
    id: 'FIN-104',
    title: 'Infraestrutura Cloud Run / Firebase Servers',
    type: 'despesa',
    category: 'Servidores & Cloud',
    amount: 1480,
    dueDate: '2026-07-25',
    paymentDate: '2026-07-24',
    status: 'pago',
    paymentMethod: 'cartao',
    isRecurring: true
  },
  {
    id: 'FIN-105',
    title: 'Licenças Figma, GitHub Enterprise & OpenAI/Gemini API',
    type: 'despesa',
    category: 'Ferramentas & Software',
    amount: 920,
    dueDate: '2026-07-20',
    paymentDate: '2026-07-19',
    status: 'pago',
    paymentMethod: 'cartao',
    isRecurring: true
  },
  {
    id: 'FIN-106',
    title: 'Mensalidade Mês 07 - FinTech Alfa (Sustentação App)',
    type: 'receita',
    category: 'Mensalidade de Serviço',
    amount: 1800,
    dueDate: '2026-07-10',
    paymentDate: '2026-07-09',
    status: 'pago',
    paymentMethod: 'pix',
    clientName: 'Lucas Ferreira',
    subscriptionId: 'SUB-101',
    isRecurring: true
  },
  {
    id: 'FIN-107',
    title: 'Mensalidade Mês 07 - Clínica Vivence (Hospedagem & Suporte)',
    type: 'receita',
    category: 'Mensalidade de Serviço',
    amount: 950,
    dueDate: '2026-07-15',
    paymentDate: '2026-07-14',
    status: 'pago',
    paymentMethod: 'pix',
    clientName: 'Mariana Santos',
    subscriptionId: 'SUB-102',
    isRecurring: true
  },
  {
    id: 'FIN-108',
    title: 'Mensalidade Mês 07 - Nexus Logística (Licença API & IA)',
    type: 'receita',
    category: 'Mensalidade de Serviço',
    amount: 2400,
    dueDate: '2026-07-20',
    status: 'pendente',
    paymentMethod: 'pix',
    clientName: 'Roberto Silva',
    subscriptionId: 'SUB-103',
    isRecurring: true
  }
];

export const INITIAL_SUBSCRIPTIONS: ClientSubscription[] = [
  {
    id: 'SUB-101',
    clientName: 'Lucas Ferreira',
    clientEmail: 'lucas@fintechalfa.com.br',
    serviceName: 'Sustentação de App Mobile & Cloud AWS/Firebase',
    monthlyValue: 1800,
    billingCycleDay: 10,
    status: 'ativo',
    startDate: '2026-01-10',
    nextDueDate: '2026-08-10',
    paymentMethod: 'pix',
    notes: 'Contrato anual com suporte até 20hs/mês e monitoramento 24/7.',
    lastPaymentDate: '2026-07-09',
    pixCopyPaste: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-42661417400052040000530398654071800.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304E2D1'
  },
  {
    id: 'SUB-102',
    clientName: 'Mariana Santos',
    clientEmail: 'mariana@clinicavivence.com.br',
    serviceName: 'Hospedagem Dedicada & Manutenção Preventiva Web',
    monthlyValue: 950,
    billingCycleDay: 15,
    status: 'ativo',
    startDate: '2026-02-15',
    nextDueDate: '2026-08-15',
    paymentMethod: 'pix',
    notes: 'Incluso backup diário de banco de dados e certificados SSL.',
    lastPaymentDate: '2026-07-14',
    pixCopyPaste: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865406950.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304C1B8'
  },
  {
    id: 'SUB-103',
    clientName: 'Roberto Silva',
    clientEmail: 'roberto@nexuslog.com.br',
    serviceName: 'Licenciamento de APIs de Logística & Automação IA',
    monthlyValue: 2400,
    billingCycleDay: 20,
    status: 'inadimplente',
    startDate: '2026-03-01',
    nextDueDate: '2026-07-20',
    paymentMethod: 'pix',
    notes: 'Mensalidade do mês de Julho pendente de pagamento.',
    lastPaymentDate: '2026-06-20',
    pixCopyPaste: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-42661417400052040000530398654072400.005802BR5920NCodes Technologies6009SAO PAULO62070503***6304B8A2'
  },
  {
    id: 'SUB-104',
    clientName: 'Eduardo Ramos',
    clientEmail: 'eduardo@odontoplus.com.br',
    serviceName: 'Sustentação de Sistema de Gestão Odontológica',
    monthlyValue: 1200,
    billingCycleDay: 5,
    status: 'suspenso',
    startDate: '2025-11-05',
    nextDueDate: '2026-08-05',
    paymentMethod: 'boleto',
    notes: 'Serviço temporariamente pausado por solicitação do cliente.',
    lastPaymentDate: '2026-05-05'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    projectId: 'PRJ-2026-01',
    senderId: 'cli-01',
    senderName: 'Lucas Ferreira (Cliente)',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: 'Olá equipe NCodes! Vi o andamento das tarefas do App PayNext. Quando faremos a homologação da geração do QR Code Pix?',
    timestamp: '14:20'
  },
  {
    id: 'm2',
    projectId: 'PRJ-2026-01',
    senderId: 'dev-01',
    senderName: 'Nikolas (NCodes Tech Lead)',
    senderRole: 'admin',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    text: 'Boa tarde Lucas! Finalizamos a integração do Pix em ambiente de sandbox hoje. Já está liberado no ambiente de teste no aplicativo e no portal!',
    timestamp: '14:25',
    attachments: [
      { name: 'Comprovante_Sandbox_Pix.pdf', type: 'application/pdf', url: '#' }
    ]
  },
  {
    id: 'm3',
    projectId: 'PRJ-2026-01',
    senderId: 'cli-01',
    senderName: 'Lucas Ferreira (Cliente)',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: 'Excelente! Vou realizar alguns testes aqui e retorno com o feedback.',
    timestamp: '14:31'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TK-8801',
    title: 'Dúvida no ajuste das permissões de usuário no painel',
    category: 'Suporte Técnico',
    priority: 'media',
    status: 'em_atendimento',
    clientName: 'Lucas Ferreira - FinTech Alfa',
    createdAt: '2026-07-23 11:15',
    messagesCount: 3,
    lastUpdate: 'Há 2 horas'
  },
  {
    id: 'TK-8802',
    title: 'Solicitação de inclusão de novo relatório de faturamento em Excel',
    category: 'Melhoria de Sistema',
    priority: 'baixa',
    status: 'aberto',
    clientName: 'Mariana Santos - Clínica Vivence',
    createdAt: '2026-07-24 09:40',
    messagesCount: 1,
    lastUpdate: 'Há 5 horas'
  }
];

export const INITIAL_LEADS: LeadCRM[] = [
  {
    id: 'lead-1',
    name: 'Roberto Silva',
    company: 'Nexus Logística',
    email: 'roberto@nexuslog.com.br',
    phone: '(11) 97111-2233',
    stage: 'proposta',
    value: 32000,
    nextFollowUp: '2026-07-26'
  },
  {
    id: 'lead-2',
    name: 'Carla Mendes',
    company: 'EducaTech EAD',
    email: 'carla@educatech.com.br',
    phone: '(41) 98444-5566',
    stage: 'qualificacao',
    value: 18500,
    nextFollowUp: '2026-07-28'
  },
  {
    id: 'lead-3',
    name: 'Fernanda Oliveira',
    company: 'OdontoPlus',
    email: 'fernanda@odontoplus.com',
    phone: '(31) 99888-7766',
    stage: 'fechamento',
    value: 24000,
    nextFollowUp: '2026-07-25'
  }
];

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
  },
  {
    id: 'usr-5',
    name: 'Lucas Ferreira',
    email: 'lucas@fintechalfa.com.br',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    company: 'FinTech Alfa',
    phone: '(11) 98877-6655'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Nova solicitação de orçamento!',
    description: 'Lucas Ferreira enviou uma solicitação para App Mobile + Web.',
    type: 'quote',
    timestamp: 'Há 10 minutos',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Pagamento de R$ 9.500 confirmado!',
    description: 'A parcela 2/3 do projeto PayNext foi paga via Pix.',
    type: 'payment',
    timestamp: 'Há 1 hora',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Nova mensagem do cliente no chat',
    description: 'PayNext App: Lucas postou uma pergunta sobre homologação Pix.',
    type: 'chat',
    timestamp: 'Há 2 horas',
    read: true
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Nikolas (Administrador Master)',
    username: 'admin',
    passwordHash: 'admin123',
    roleTitle: 'Administrador Master',
    createdAt: '2026-01-10T10:00:00.000Z',
    addedBy: 'Sistema NCodes'
  },
  {
    id: 'adm-2',
    name: 'Gabriel Souza',
    username: 'nikolas',
    passwordHash: 'ncodes2026',
    roleTitle: 'Tech Lead / Engenheiro',
    createdAt: '2026-02-01T14:30:00.000Z',
    addedBy: 'Nikolas'
  }
];

export const INITIAL_CLIENT_USERS: ClientUser[] = [
  {
    id: 'cli-user-1',
    name: 'Lucas Ferreira',
    email: 'lucas@fintechalfa.com.br',
    phone: '(11) 98877-6655',
    company: 'FinTech Alfa',
    passwordHash: 'cliente123',
    createdAt: '2026-07-15T10:00:00.000Z',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    id: 'cli-user-2',
    name: 'Mariana Santos',
    email: 'mariana@clinicavivence.com.br',
    phone: '(21) 97654-3210',
    company: 'Clínica Vivence',
    passwordHash: 'vivence2026',
    createdAt: '2026-07-18T14:00:00.000Z',
    city: 'Rio de Janeiro',
    state: 'RJ'
  }
];

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
  address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  announcementBanner: '',
  isAnnouncementActive: false,
  primaryColor: '#2563eb',
  maintenanceMode: false,
  lastUpdated: '25/07/2026 12:00',
  updatedBy: 'Admin Master'
};
