import React, { useState } from 'react';
import { FileSignature, Plus, Trash2, Send, X, DollarSign, Calendar, ShieldCheck } from 'lucide-react';
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
  const [paymentTerms, setPaymentTerms] = useState('30% de entrada no aceite digital + parcelas mensais via Pix.');
  const [description, setDescription] = useState(`Desenvolvimento de software sob medida para a empresa ${quote.company || quote.clientName}. ${quote.description}`);

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

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condições de Pagamento
              </label>
              <input
                type="text"
                required
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
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
