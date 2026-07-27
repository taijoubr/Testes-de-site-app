import React, { useState } from 'react';
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
  Code,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuoteWizardModal: React.FC = () => {
  const { createQuoteRequest, setActiveView } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('45 dias');
  const [budgetRange, setBudgetRange] = useState('R$ 15.000 a R$ 30.000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createQuoteRequest({
        clientName: clientName || 'Cliente Visitante',
        company: company || 'Empresa',
        email: email || 'contato@cliente.com',
        phone: phone || '(11) 99999-8888',
        whatsapp: whatsapp || phone || '(11) 99999-8888',
        city: city || 'São Paulo',
        state: state || 'SP',
        projectType: 'Projeto Sob Medida',
        description: description || 'Solicitação de orçamento com análise técnica.',
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fluxo Inteligente de Orçamento</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Solicitar Orçamento de Projeto
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Preencha os detalhes para receber uma análise técnica preliminar por Inteligência Artificial da NCodes.
          </p>
        </div>

        {/* Wizard Stepper Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
              step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              1
            </div>

            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
              step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              2
            </div>

            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
              step >= 3 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              3
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-500 dark:text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Orçamento Solicitado com Sucesso!</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                  Sua solicitação foi registrada no Firestore e nossa Inteligência Artificial já gerou a pré-análise técnica. Em breve nossa equipe enviará a proposta no seu WhatsApp e e-mail.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setActiveView('admin_panel')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md"
                >
                  Ver no Painel Administrativo
                </button>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Voltar ao Site
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* Step 1: Identification */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
                    Etapa 1: Dados de Contato e Empresa
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Seu Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          placeholder="Ex: Carlos Silva"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Empresa / Organização
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={company}
                          onChange={e => setCompany(e.target.value)}
                          placeholder="Ex: Tech Corp"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        E-mail *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        WhatsApp / Telefone *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={whatsapp}
                          onChange={e => {
                            setWhatsapp(e.target.value);
                            setPhone(e.target.value);
                          }}
                          placeholder="(11) 99999-8888"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cidade
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="Ex: São Paulo"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Estado (UF)
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        value={state}
                        onChange={e => setState(e.target.value.toUpperCase())}
                        placeholder="SP"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md"
                    >
                      <span>Avançar para Detalhes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Project Specifications */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
                    Etapa 2: Especificações do Projeto
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Descrição Detalhada dos Requisitos *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Descreva as funcionalidades principais, fluxo de uso, integrações necessárias (Pix, WhatsApp, etc.)..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Prazo Desejado
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <select
                          value={deadline}
                          onChange={e => setDeadline(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                        >
                          <option value="15 dias">15 dias (Urgente)</option>
                          <option value="30 dias">30 dias</option>
                          <option value="45 dias">45 dias</option>
                          <option value="60 dias">60 dias</option>
                          <option value="A combinar">A combinar</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Faixa de Investimento Prevista
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <select
                          value={budgetRange}
                          onChange={e => setBudgetRange(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                        >
                          <option value="R$ 3.000 a R$ 8.000">R$ 3.000 a R$ 8.000</option>
                          <option value="R$ 8.000 a R$ 15.000">R$ 8.000 a R$ 15.000</option>
                          <option value="R$ 15.000 a R$ 30.000">R$ 15.000 a R$ 30.000</option>
                          <option value="Acima de R$ 30.000">Acima de R$ 30.000</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md"
                    >
                      <span>Revisar e Analisar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: AI Analysis Preview & Confirm */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 border-b pb-2 border-slate-100 dark:border-slate-800">
                    Etapa 3: Resumo e Pré-Análise do Projeto
                  </h3>

                  <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-4 text-xs space-y-2 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cliente:</span>
                      <strong className="text-slate-900 dark:text-white">{clientName} ({company || 'Pessoa Física'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contato:</span>
                      <strong className="text-slate-900 dark:text-white">{whatsapp} | {email}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prazo / Faixa:</span>
                      <strong className="text-slate-900 dark:text-white">{deadline} | {budgetRange}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Análise de Engenharia por Gemini AI
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Ao enviar este formulário, nosso motor de Inteligência Artificial processará a descrição técnica, mapeará as dependências da arquitetura e sugerirá a melhor stack de desenvolvimento.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processando Análise...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Solicitação de Orçamento</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
