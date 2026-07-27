import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Send, 
  Paperclip, 
  Download, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Briefcase,
  Users,
  Building2,
  Phone,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuoteRequest, QuoteStatus, QuoteAttachment } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';

interface AdminQuoteManagementModalProps {
  quote: QuoteRequest;
  onClose: () => void;
}

export const AdminQuoteManagementModal: React.FC<AdminQuoteManagementModalProps> = ({ quote, onClose }) => {
  const { 
    updateQuoteStatus, 
    updateQuoteDetails, 
    convertQuoteToProject,
    addQuoteAttachment,
    addQuoteTimelineItem,
    setSelectedQuoteIdForProposal,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'edit_offer' | 'status' | 'request_info' | 'messages'>('edit_offer');

  // Offer Edit Form State
  const [offeredValue, setOfferedValue] = useState<string>(quote.offeredValue ? String(quote.offeredValue) : '');
  const [offeredDeadline, setOfferedDeadline] = useState<string>(quote.offeredDeadline || quote.deadline || '');
  const [paymentTerms, setPaymentTerms] = useState<string>(quote.paymentTerms || '50% entrada + 50% na entrega ou 12x no cartão');
  const [assignedTo, setAssignedTo] = useState<string>(quote.assignedTo || 'usr-1');
  const [scopeItems, setScopeItems] = useState<string[]>(
    quote.scopeItems && quote.scopeItems.length > 0 
      ? quote.scopeItems 
      : [
          'Desenvolvimento do Frontend Responsivo em React / Tailwind',
          'API RESTful / Express com Criptografia de Dados',
          'Painel de Gestão Administrativa e Dashboard',
          'Homologação Técnica e Publicação em Produção'
        ]
  );
  const [newScopeInput, setNewScopeInput] = useState('');
  const [customNote, setCustomNote] = useState('');

  // Status Change Form State
  const [newStatus, setNewStatus] = useState<QuoteStatus>(quote.status);
  const [statusNote, setStatusNote] = useState('');

  // Request Info State
  const [requestInfoText, setRequestInfoText] = useState('');

  // Message / Chat State
  const [adminMessageText, setAdminMessageText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddScopeItem = () => {
    if (newScopeInput.trim()) {
      setScopeItems(prev => [...prev, newScopeInput.trim()]);
      setNewScopeInput('');
    }
  };

  const handleRemoveScopeItem = (index: number) => {
    setScopeItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveOfferDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const assignedMember = TEAM_MEMBERS.find(m => m.id === assignedTo);

    await updateQuoteDetails(
      quote.id,
      {
        offeredValue: offeredValue ? parseFloat(offeredValue) : undefined,
        offeredDeadline,
        paymentTerms,
        assignedTo,
        assignedToName: assignedMember ? assignedMember.name : 'Engenheiro NCodes',
        assignedToRole: assignedMember ? assignedMember.role : 'admin',
        scopeItems,
        status: quote.status === 'solicitado' || quote.status === 'em_analise' ? 'orcamento_disponivel' : quote.status
      },
      customNote.trim() || 'Valores e escopo comercial atualizados pela equipe.'
    );

    setIsSubmitting(false);
    setSuccessMsg('Orçamento atualizado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateQuoteStatus(quote.id, newStatus, statusNote.trim());
    setIsSubmitting(false);
    setSuccessMsg(`Status alterado para ${newStatus}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSendInfoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestInfoText.trim()) return;
    setIsSubmitting(true);
    await updateQuoteStatus(quote.id, 'aguardando_informacoes', requestInfoText.trim());
    setRequestInfoText('');
    setIsSubmitting(false);
    setSuccessMsg('Solicitação de informações enviada ao cliente!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessageText.trim()) return;
    setIsSubmitting(true);
    await addQuoteTimelineItem(quote.id, adminMessageText.trim(), 'Engenharia NCodes', 'admin');
    setAdminMessageText('');
    setIsSubmitting(false);
  };

  const handleConvertToProject = async () => {
    if (confirm(`Deseja converter o orçamento #${quote.id} em um Projeto ativo?`)) {
      setIsSubmitting(true);
      const prjId = await convertQuoteToProject(quote.id);
      setIsSubmitting(false);
      if (prjId) {
        alert(`Projeto #${prjId} criado com sucesso!`);
        onClose();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      await addQuoteAttachment(quote.id, {
        name: file.name,
        size: sizeMB,
        type: file.type || 'application/pdf',
        uploadedBy: 'Equipe NCodes',
        uploadedRole: 'admin',
        url: '#'
      });
      setSuccessMsg(`Anexo ${file.name} vinculado!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* HEADER */}
        <div className="p-5 md:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                {quote.id}
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
                Cliente: {quote.clientName} ({quote.company || 'Pessoa Física'})
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Painel Administrativo: {quote.projectTitle || quote.projectType}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConvertToProject}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Briefcase className="w-4 h-4" />
              Converter em Projeto (1-Clique)
            </button>

            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {successMsg && (
          <div className="bg-emerald-950/60 border-b border-emerald-500/40 p-3 px-6 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}

        {/* NAV TABS */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 pt-2">
          {[
            { id: 'edit_offer', label: 'Precificação & Escopo', icon: DollarSign },
            { id: 'status', label: 'Alterar Status', icon: Clock },
            { id: 'request_info', label: 'Solicitar Informações', icon: AlertTriangle },
            { id: 'messages', label: 'Mensagens & Proposta PDF', icon: MessageSquare }
          ].map(tab => {
            const IconC = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive 
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-lg' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconC className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PRECIFICAÇÃO E ESCOPO */}
          {activeTab === 'edit_offer' && (
            <form onSubmit={handleSaveOfferDetails} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Valor do Projeto (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={offeredValue}
                      onChange={e => setOfferedValue(e.target.value)}
                      placeholder="28500.00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Prazo Estimado de Entrega
                  </label>
                  <input
                    type="text"
                    required
                    value={offeredDeadline}
                    onChange={e => setOfferedDeadline(e.target.value)}
                    placeholder="Ex: 40 dias úteis"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Responsável pelo Atendimento
                  </label>
                  <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {TEAM_MEMBERS.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Condições de Pagamento
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                  placeholder="Ex: 50% de entrada + 3 parcelas sem juros ou 10% de desconto no Pix"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Itens do Escopo do Projeto
                </label>
                <div className="space-y-2 mb-3">
                  {scopeItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScopeItem(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newScopeInput}
                    onChange={e => setNewScopeInput(e.target.value)}
                    placeholder="Adicionar novo item de escopo..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddScopeItem}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Observações Internas ou Mensagem ao Cliente
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={e => setCustomNote(e.target.value)}
                  placeholder="Instruções para o cliente ou histórico de negociação..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer border border-slate-700 transition-colors flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  Anexar PDF da Proposta
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Salvar e Liberar Orçamento
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ALTERAR STATUS */}
          {activeTab === 'status' && (
            <form onSubmit={handleUpdateStatus} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Selecione o Novo Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as QuoteStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="solicitado">🟡 Solicitação Enviada (Recebido)</option>
                  <option value="em_analise">🔵 Em Análise Técnica</option>
                  <option value="aguardando_informacoes">🟠 Aguardando Informações do Cliente</option>
                  <option value="orcamento_disponivel">🟢 Orçamento Disponível (Liberado)</option>
                  <option value="em_negociacao">🟣 Em Negociação</option>
                  <option value="aprovado">✅ Aprovado / Em Execução</option>
                  <option value="recusado">❌ Recusado</option>
                  <option value="cancelado">⚪ Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Observação do Status (Enviada no e-mail e na linha do tempo)
                </label>
                <textarea
                  rows={4}
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="Ex: Análise finalizada. Valores e escopo liberados para aprovação no portal..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Atualizar Status Agora
              </button>
            </form>
          )}

          {/* TAB 3: SOLICITAR INFORMAÇÕES */}
          {activeTab === 'request_info' && (
            <form onSubmit={handleSendInfoRequest} className="space-y-4">
              <div className="p-4 bg-orange-950/30 border border-orange-500/30 rounded-xl text-orange-200 text-xs">
                <AlertTriangle className="w-5 h-5 text-orange-400 mb-1" />
                <p>Ao enviar uma dúvida ou solicitar informações, o status do orçamento será alterado para <strong className="text-orange-300">"Aguardando Informações"</strong> e o cliente receberá um alerta no painel dele.</p>
              </div>

              <textarea
                rows={4}
                required
                value={requestInfoText}
                onChange={e => setRequestInfoText(e.target.value)}
                placeholder="Ex: Por gentileza, informe qual API de pagamentos vocês utilizam atualmente..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-400"
              />

              <button
                type="submit"
                disabled={!requestInfoText.trim() || isSubmitting}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Solicitação ao Cliente
              </button>
            </form>
          )}

          {/* TAB 4: MENSAGENS E PROPOSTA PDF */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-white">Proposta Comercial em PDF</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gerar a página da proposta para assinatura digital do cliente</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedQuoteIdForProposal(quote.id);
                    setActiveView('proposal_accept');
                    onClose();
                  }}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Abrir Gerador de Proposta
                </button>
              </div>

              <form onSubmit={handleSendAdminMessage} className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  Adicionar Nota na Linha do Tempo
                </label>
                <textarea
                  rows={3}
                  value={adminMessageText}
                  onChange={e => setAdminMessageText(e.target.value)}
                  placeholder="Registrar mensagem técnica ou instrução no histórico..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!adminMessageText.trim() || isSubmitting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
                >
                  Registrar Nota
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
