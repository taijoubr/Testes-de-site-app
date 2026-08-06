import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  DollarSign, 
  Loader2, 
  Plus,
  X,
  FileText,
  HelpCircle,
  FolderGit2,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_QUOTE_CATEGORIES, DEFAULT_QUOTE_FEATURES } from '../data/initialData';

export const QuoteWizardModal: React.FC = () => {
  const { createQuoteRequest, currentClientUser, setActiveView, siteConfig } = useApp();

  const wizardQuoteCategories = (
    siteConfig?.quoteCategories && siteConfig.quoteCategories.length > 0
      ? siteConfig.quoteCategories
      : DEFAULT_QUOTE_CATEGORIES
  ).filter(cat => !cat.hidden);

  const wizardQuoteFeatures = (
    siteConfig?.quoteFeatures && siteConfig.quoteFeatures.length > 0
      ? siteConfig.quoteFeatures
      : DEFAULT_QUOTE_FEATURES
  ).filter(feat => !feat.hidden);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 1. Informações do Projeto
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState<string>('Site Institucional');
  const [description, setDescription] = useState('');
  
  // 2. Funcionalidades Desejadas
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');

  // 3. Referências
  const [references, setReferences] = useState('');

  // 4. Prazo Desejado
  const [deadline, setDeadline] = useState('Até 30 dias');

  // 5. Faixa de Investimento
  const [budgetRange, setBudgetRange] = useState('Ainda não definida');

  // 6. Informações Adicionais
  const [additionalNotes, setAdditionalNotes] = useState('');

  // 7. Informações do Solicitante
  const [personType, setPersonType] = useState<'fisica' | 'juridica'>('fisica');
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Auto-fill logged in client user data
  useEffect(() => {
    if (currentClientUser) {
      if (!clientName) setClientName(currentClientUser.name || '');
      if (!email) setEmail(currentClientUser.email || '');
      if (!phone) setPhone(currentClientUser.phone || '');
      if (!whatsapp) setWhatsapp(currentClientUser.phone || '');
      if (!company) {
        if (currentClientUser.company && currentClientUser.company !== 'Pessoa Física') {
          setPersonType('juridica');
          setCompany(currentClientUser.company);
        } else {
          setPersonType('fisica');
          setCompany('');
        }
      }
      if (!city) setCity(currentClientUser.city || '');
      if (!state) setState(currentClientUser.state || '');
    }
  }, [currentClientUser]);

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(prev => prev.filter(f => f !== feature));
    } else {
      setSelectedFeatures(prev => [...prev, feature]);
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

  const removeFeature = (featureToRemove: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== featureToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullDescription = [
        projectTitle ? `📌 Título: ${projectTitle}` : '',
        description ? `📝 Descrição:\n${description}` : '',
        selectedFeatures.length > 0 ? `⚡ Funcionalidades Desejadas:\n- ${selectedFeatures.join('\n- ')}` : '',
        references ? `🔗 Referências:\n${references}` : '',
        additionalNotes ? `💬 Informações Adicionais:\n${additionalNotes}` : ''
      ].filter(Boolean).join('\n\n');

      const finalCompany = personType === 'juridica'
        ? (company.trim() || 'Empresa (PJ)')
        : 'Pessoa Física';

      await createQuoteRequest({
        clientName: clientName || (currentClientUser?.name) || 'Cliente Visitante',
        company: finalCompany,
        email: email || (currentClientUser?.email) || 'contato@cliente.com',
        phone: phone || whatsapp || '(11) 99999-8888',
        whatsapp: whatsapp || phone || '(11) 99999-8888',
        city: city || 'São Paulo',
        state: state || 'SP',
        projectType: category,
        projectTitle: projectTitle || 'Novo Projeto Web/Sistema',
        category,
        selectedFeatures,
        references,
        additionalNotes,
        description: fullDescription || 'Solicitação de orçamento enviada pelo portal.',
        deadline,
        budgetRange
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>NCodes Tech • Engenharia de Software</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Solicitação de Orçamento
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Preencha as informações do seu projeto para receber uma análise técnica detalhada e uma proposta comercial sob medida.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 dark:text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Solicitação Enviada com Sucesso!
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                Agradecemos pelo envio! Sua solicitação já deu entrada no nosso sistema. Nossa Inteligência Artificial gerou uma pré-análise técnica preliminar e nossa equipe entrará em contato em breve.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView('client_portal')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Acompanhar no Portal do Cliente
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setProjectTitle('');
                  setDescription('');
                  setSelectedFeatures([]);
                  setReferences('');
                  setAdditionalNotes('');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Nova Solicitação
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            
            {/* SECTION 1: Informações do Projeto */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Informações do Projeto
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Defina o título, categoria e escopo geral da sua aplicação.
                  </p>
                </div>
              </div>

              {/* Título do Projeto */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="Ex: Plataforma E-commerce de Calçados ou App de Gestão de Vendas"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Categoria *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {wizardQuoteCategories.map((cat) => {
                    const catVal = cat.label || cat.id;
                    const active = category === catVal || category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(catVal)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                          active 
                            ? 'bg-blue-600/10 border-blue-600 text-blue-700 dark:bg-blue-500/20 dark:border-blue-400 dark:text-blue-300 ring-2 ring-blue-500/20' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm">{cat.label}</span>
                          {active && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        {cat.desc && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {cat.desc}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descrição do Projeto */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Descrição do Projeto *
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Descreva detalhadamente o que deseja desenvolver, os objetivos do projeto e as principais funcionalidades esperadas.
                </p>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Queremos criar um sistema onde o cliente possa se cadastrar, agendar horários, efetuar pagamentos via Pix e acompanhar o histórico de pedidos no painel..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
                />
              </div>

              {/* Funcionalidades Desejadas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Funcionalidades Desejadas <span className="normal-case text-slate-500 font-normal">(serão adicionadas uma a uma)</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Clique nas opções pré-definidas abaixo ou digite uma funcionalidade personalizada para adicionar ao seu escopo:
                </p>

                {/* Predefined Features Grid */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {wizardQuoteFeatures.map((featObj) => {
                    const feat = featObj.label;
                    const isSelected = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={featObj.id || feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
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

                {/* Custom Feature Input */}
                <div className="flex gap-2">
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
                    placeholder="Digite outra funcionalidade (ex: Login Social com Google, Notificação Push, etc.)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomFeature}
                    className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {/* Selected Features Chips */}
                {selectedFeatures.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block mb-2">
                      Funcionalidades Selecionadas ({selectedFeatures.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map((feat) => (
                        <span
                          key={feat}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          {feat}
                          <button
                            type="button"
                            onClick={() => removeFeature(feat)}
                            className="hover:bg-blue-700 p-0.5 rounded-md transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prazo Desejado */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Prazo Desejado *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="O quanto antes">O quanto antes</option>
                    <option value="Até 30 dias">Até 30 dias</option>
                    <option value="Até 60 dias">Até 60 dias</option>
                    <option value="Sem prazo definido">Sem prazo definido</option>
                  </select>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Informações Adicionais
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Campo livre para observações, requisitos específicos ou qualquer informação importante para a elaboração do orçamento.
                </p>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Digite aqui observações adicionais ou detalhes relevantes..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

            </div>

            {/* SECTION 2: Informações do Solicitante */}
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Informações do Solicitante
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Seus dados de contato para envio da proposta e notificações.
                    </p>
                  </div>
                </div>
                {currentClientUser && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    ✓ Usuário Autenticado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tipo de Cadastro / Solicitante */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipo de Solicitante *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPersonType('fisica');
                        setCompany('');
                      }}
                      className={`py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        personType === 'fisica'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Pessoa Física</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPersonType('juridica')}
                      className={`py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        personType === 'juridica'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Empresa (PJ)</span>
                    </button>
                  </div>
                </div>

                <div className={personType === 'juridica' ? '' : 'sm:col-span-2'}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seu Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Ex: Nikolas Silva"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {personType === 'juridica' && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nome da Empresa *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Ex: NCodes Tech Ltda"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail Principal *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={e => {
                        setWhatsapp(e.target.value);
                        setPhone(e.target.value);
                      }}
                      placeholder="(11) 99999-8888"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cidade
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={e => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveView('home')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancelar e Voltar</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando e Processando Análise...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Solicitação</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
