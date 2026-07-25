import React, { useState } from 'react';
import { 
  FolderGit2, 
  DollarSign, 
  MessageSquare, 
  LifeBuoy, 
  Download, 
  CheckCircle2, 
  Send, 
  Clock, 
  FileText, 
  Paperclip, 
  Mic, 
  ShieldCheck, 
  QrCode, 
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ClientPortal: React.FC = () => {
  const { 
    projects, 
    financials, 
    chatMessages, 
    tickets, 
    sendChatMessage, 
    createSupportTicket, 
    currentUser,
    setSelectedProposalIdForAcceptance,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'projects' | 'financials' | 'chat' | 'tickets'>('projects');
  
  // Chat input
  const [chatInput, setChatInput] = useState('');
  
  // Support ticket input
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Suporte Técnico');
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Pix modal
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const activeProject = projects[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketTitle.trim()) {
      createSupportTicket(ticketTitle.trim(), ticketCategory, 'media');
      setTicketTitle('');
      setShowTicketModal(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136ncodes-tech-chave-pix-copia-e-cola-998852040001995204000053039865405285005802BR5925NCODES TECHNOLOGIES LTDA6009SAO PAULO62070503***6304E2D1');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Portal */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Área do Cliente • Sincronizada em Tempo Real</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bem-vindo, {currentUser.name}!
          </h1>
          <p className="text-xs text-slate-300">
            Acompanhe o cronograma do projeto, acesse arquivos, baixe notas e converse com nossa engenharia.
          </p>
        </div>

        {/* Portal Tabs Nav */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projetos</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'financials' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financeiro & Pix</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Direto</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Chamados ({tickets.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE PROJECTS & TIMELINE */}
      {activeTab === 'projects' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {activeProject && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{activeProject.id} • {activeProject.category}</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeProject.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {activeProject.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Progresso Geral de Desenvolvimento:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{activeProject.progressPercentage}% concluído</span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500" 
                    style={{ width: `${activeProject.progressPercentage}%` }} 
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Etapas & Atividades:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProject.tasks.map(t => (
                    <div key={t.id} className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
                      t.completed 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={t.completed ? 'line-through' : ''}>{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Repository */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Documentos & Arquivos para Download:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProject.files.map(f => (
                    <div key={f.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white truncate">{f.name}</span>
                      </div>
                      <button className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: FINANCIAL STATEMENT & PIX */}
      {activeTab === 'financials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Extrato Financeiro & Cobranças Pix</h2>
                <p className="text-xs text-slate-500">Consulte suas parcelas ativas, status de pagamento e efetue acertos instantâneos via Pix.</p>
              </div>

              <button
                onClick={() => setPixModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <QrCode className="w-4 h-4" />
                <span>Pagar Parcela via Pix</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Descrição da Cobrança</th>
                    <th className="pb-3">Vencimento</th>
                    <th className="pb-3">Valor</th>
                    <th className="pb-3">Forma</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {financials.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{f.title}</td>
                      <td className="py-3 text-slate-500">{f.dueDate}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">R$ {f.amount.toLocaleString('pt-BR')}</td>
                      <td className="py-3 uppercase font-semibold text-slate-500">{f.paymentMethod}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          f.status === 'pago' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {f.status !== 'pago' ? (
                          <button
                            onClick={() => setPixModalOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500"
                          >
                            Pagar Agora Pix
                          </button>
                        ) : (
                          <span className="text-emerald-500 font-bold text-[10px]">✓ Pago</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERNAL REAL-TIME CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px] animate-in fade-in duration-200">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                NC
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Suporte & Engenharia NCodes</h3>
                <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sincronizado em tempo real
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
            {chatMessages.map(msg => {
              const isMe = msg.senderRole === 'client';
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover border" />
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-80">
                      <span className="font-bold">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Digite sua mensagem para a equipe..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Central de Chamados Técnico</h2>
              <p className="text-xs text-slate-500">Abra solicitações de ajuste, novas demandas e dúvidas com SLA priorizado.</p>
            </div>

            <button
              onClick={() => setShowTicketModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Abrir Novo Chamado</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map(tk => (
              <div key={tk.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{tk.id} • {tk.category}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">{tk.status}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{tk.title}</h3>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>Criado em: {tk.createdAt}</span>
                  <span>Última atualização: {tk.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pix Modal */}
      {pixModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pagamento via Pix Copia e Cola</h2>
            <p className="text-xs text-slate-500">Escaneie o QR Code no seu aplicativo bancário ou copie a chave Pix abaixo.</p>

            {/* Simulated QR Code Graphic */}
            <div className="w-48 h-48 bg-slate-950 p-4 rounded-2xl mx-auto flex items-center justify-center border border-emerald-500/40 shadow-inner">
              <QrCode className="w-36 h-36 text-emerald-400" />
            </div>

            <button
              onClick={handleCopyPix}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span>{pixCopied ? 'Chave Pix Copiada!' : 'Copiar Chave Pix'}</span>
            </button>

            <button
              onClick={() => setPixModalOpen(false)}
              className="text-xs text-slate-400 hover:underline pt-2 block mx-auto"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Abrir Novo Chamado de Suporte</h2>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Título da Solicitação</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  placeholder="Ex: Dúvida na integração com gateway"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Categoria</label>
                <select
                  value={ticketCategory}
                  onChange={e => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="Suporte Técnico">Suporte Técnico</option>
                  <option value="Melhoria de Sistema">Melhoria de Sistema</option>
                  <option value="Dúvida Comercial">Dúvida Comercial</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Abrir Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
