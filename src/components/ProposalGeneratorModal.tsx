import React, { useState } from 'react';
import { FileSignature, Plus, Trash2, Send, X, DollarSign, Calendar, ShieldCheck, Calculator, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuoteRequest } from '../types';

interface ProposalGeneratorModalProps {
  quote: QuoteRequest;
  onClose: () => void;
}

export const ProposalGeneratorModal: React.FC<ProposalGeneratorModalProps> = ({ quote, onClose }) => {
  const { createProposal } = useApp();

  const [title, setTitle] = useState(`Proposta Técnica e Comercial - ${quote.company || quote.clientName}`);
  const [totalValue, setTotalValue] = useState(quote.aiAnalysis?.suggestedBudget || 18500);
  const [recurringMonthlyValue, setRecurringMonthlyValue] = useState(1200);
  const [paymentTerms, setPaymentTerms] = useState('30% de entrada no aceite digital + 3 parcelas mensais via Pix/Boleto');
  const [description, setDescription] = useState(`Desenvolvimento de software sob medida para a empresa ${quote.company || quote.clientName}. ${quote.description}`);

  // Payment Conditions Builder State
  const [paymentType, setPaymentType] = useState<'entrada_parcelamento' | 'vista' | 'parcelado_sem_entrada'>(
    quote.paymentConditions?.paymentType || 'entrada_parcelamento'
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(
    quote.paymentConditions?.downPaymentPercent || 30
  );
  const [installmentsCount, setInstallmentsCount] = useState<number>(
    quote.paymentConditions?.installmentsCount || 3
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    quote.paymentConditions?.paymentMethod || 'Pix / Boleto ou Cartão de Crédito'
  );

  const calculateAndApplyPaymentTerms = (
    pType = paymentType, 
    pPercent = downPaymentPercent, 
    pInst = installmentsCount, 
    pMethod = paymentMethod, 
    val = totalValue
  ) => {
    const totalVal = Number(val) || 0;
    if (pType === 'vista') {
      setPaymentTerms(`Pagamento Integral à Vista (100% no aceite digital: R$ ${totalVal.toLocaleString('pt-BR')}) via ${pMethod}`);
    } else if (pType === 'parcelado_sem_entrada') {
      const perInst = pInst > 0 ? (totalVal / pInst) : totalVal;
      setPaymentTerms(`Parcelado sem entrada em ${pInst}x de R$ ${perInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${pMethod}`);
    } else {
      const entryVal = (totalVal * pPercent) / 100;
      const remaining = totalVal - entryVal;
      const perInst = pInst > 0 ? (remaining / pInst) : remaining;
      setPaymentTerms(`${pPercent}% de entrada no aceite (R$ ${entryVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) + ${pInst} parcelas mensais de R$ ${perInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${pMethod}`);
    }
  };

  const [scopeItems, setScopeItems] = useState<string[]>([
    'Desenvolvimento do aplicativo em Flutter (iOS)',
    'Painel Web de Gestão Administrativa em React com gráficos',
    'Autenticação de Usuários com controle por nível de permissão',
    'Integração com Gateway de Pagamento Pix Copia e Cola',
    'Notificações Push com Firebase Cloud Messaging (FCM)',
    'Sincronização de Banco de Dados Firestore em Tempo Real'
  ]);
  const [newScopeText, setNewScopeText] = useState('');

  const handleAddScope = () => {
    if (newScopeText.trim()) {
      setScopeItems([...scopeItems, newScopeText.trim()]);
      setNewScopeText('');
    }
  };

  const handleRemoveScope = (index: number) => {
    setScopeItems(scopeItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProposal({
      quoteId: quote.id,
      title,
      clientName: quote.clientName,
      company: quote.company,
      description,
      scope: scopeItems,
      schedule: [
        { phase: 'Fase 1 - Arquitetura, UX/UI Design & Protótipo', duration: '10 dias', deliverable: 'Protótipo navegável Figma + contrato técnico' },
        { phase: 'Fase 2 - Desenvolvimento Core & APIs', duration: '20 dias', deliverable: 'Primeiro build de teste com autenticação e banco de dados' },
        { phase: 'Fase 3 - Painel Web Admin & Módulo Financeiro Pix', duration: '15 dias', deliverable: 'Sincronização em tempo real e testes de carga' },
        { phase: 'Fase 4 - Homologação, Treinamento & Publicação Lojas', duration: '15 dias', deliverable: 'Lançamento oficial nas stores + documentação' }
      ],
      totalValue: Number(totalValue),
      recurringMonthlyValue: Number(recurringMonthlyValue),
      paymentTerms,
      paymentConditions: {
        paymentType,
        downPaymentPercent: paymentType === 'entrada_parcelamento' ? downPaymentPercent : (paymentType === 'vista' ? 100 : 0),
        installmentsCount: paymentType !== 'vista' ? installmentsCount : 1,
        paymentMethod
      },
      contractText: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA

CONTRATADA: NCODES TECHNOLOGIES LTDA, inscrita no CNPJ/MF sob o nº 00.000.000/0001-00.
CONTRATANTE: ${quote.company || quote.clientName}, representado por ${quote.clientName}.

1. OBJETO: A CONTRATADA compromete-se a desenvolver o projeto ${title} com suporte em tempo real.
2. VALOR E CONDIÇÕES DE PAGAMENTO: O valor total do projeto é de R$ ${Number(totalValue).toLocaleString('pt-BR')}, conforme condições: ${paymentTerms}.
3. DIREITOS AUTORAIS: Após quitação, o código-fonte proprietário será totalmente cedido ao CONTRATANTE.
4. ACEITE DIGITAL: A assinatura deste instrumento ocorre eletronicamente por validação de IP, timestamp e hash de dispositivo.`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Elaborar Proposta Digital</h2>
            <p className="text-xs text-slate-500">Para o orçamento {quote.id} ({quote.clientName})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título da Proposta
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor Total (R$)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  value={totalValue}
                  onChange={e => setTotalValue(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mensalidade (R$/mês)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={recurringMonthlyValue}
                  onChange={e => setRecurringMonthlyValue(Number(e.target.value))}
                  placeholder="Ex: 1200"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-bold text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>

          {/* Payment Conditions Configurator */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Forma de Pagamento e Parcelas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Modelo
                </label>
                <select
                  value={paymentType}
                  onChange={e => {
                    const newType = e.target.value as any;
                    setPaymentType(newType);
                    calculateAndApplyPaymentTerms(newType, downPaymentPercent, installmentsCount, paymentMethod, totalValue);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white font-semibold"
                >
                  <option value="entrada_parcelamento">Entrada + Parcelamento</option>
                  <option value="vista">100% à Vista</option>
                  <option value="parcelado_sem_entrada">Parcelado Sem Entrada</option>
                </select>
              </div>

              {paymentType === 'entrada_parcelamento' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Entrada (%)
                  </label>
                  <select
                    value={downPaymentPercent}
                    onChange={e => {
                      const newPercent = Number(e.target.value);
                      setDownPaymentPercent(newPercent);
                      calculateAndApplyPaymentTerms(paymentType, newPercent, installmentsCount, paymentMethod, totalValue);
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    <option value={10}>10% de Entrada</option>
                    <option value={20}>20% de Entrada</option>
                    <option value={30}>30% de Entrada</option>
                    <option value={40}>40% de Entrada</option>
                    <option value={50}>50% de Entrada</option>
                  </select>
                </div>
              )}

              {paymentType !== 'vista' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nº de Parcelas
                  </label>
                  <select
                    value={installmentsCount}
                    onChange={e => {
                      const newInst = Number(e.target.value);
                      setInstallmentsCount(newInst);
                      calculateAndApplyPaymentTerms(paymentType, downPaymentPercent, newInst, paymentMethod, totalValue);
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs text-cyan-600 dark:text-cyan-400 font-bold"
                  >
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={3}>3x</option>
                    <option value={4}>4x</option>
                    <option value={6}>6x</option>
                    <option value={10}>10x</option>
                    <option value={12}>12x</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descrição Formatada
                </label>
                <button
                  type="button"
                  onClick={() => calculateAndApplyPaymentTerms()}
                  className="text-[10px] text-cyan-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Recalcular</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição do Escopo
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* Scope Checklist Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Itens do Escopo de Entregas
            </label>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newScopeText}
                onChange={e => setNewScopeText(e.target.value)}
                placeholder="Adicionar item de entrega..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddScope}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              {scopeItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200">
                  <span className="truncate">• {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveScope(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gerar e Enviar Link de Aceite</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
