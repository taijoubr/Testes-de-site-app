import React, { useState } from 'react';
import { 
  FileSignature, 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Building2, 
  User, 
  Calendar, 
  DollarSign, 
  Clock, 
  QrCode, 
  History, 
  Sparkles,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { ServiceContract } from '../types';
import { useApp } from '../context/AppContext';

interface ContractModalProps {
  contract?: ServiceContract;
  contractId?: string;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ contract, contractId, onClose }) => {
  const { contracts, quotes, proposals, signContract, siteConfig } = useApp();

  let activeContract = contract || contracts.find(c => c.id === contractId || c.contractNumber === contractId || c.quoteId === contractId || c.proposalId === contractId);

  if (!activeContract && contractId) {
    const matchingQuote = quotes.find(q => q.id === contractId || q.contractId === contractId || q.proposalId === contractId);
    const matchingProp = proposals.find(p => p.id === contractId || p.quoteId === contractId || p.contractId === contractId);

    if (matchingQuote || matchingProp) {
      const q = matchingQuote;
      const p = matchingProp;
      const totalVal = p?.totalValue || q?.offeredValue || 15000;
      const title = p?.title || q?.projectTitle || q?.projectType || 'Projeto de Desenvolvimento de Software';
      const clientName = p?.clientName || q?.clientName || 'Cliente NCodes';
      const companyName = p?.company || q?.company || clientName;
      const email = q?.email || 'cliente@email.com';
      const phone = q?.phone || '(11) 99999-9999';
      const deadline = q?.offeredDeadline || q?.deadline || '45 dias úteis';
      const isSigned = p?.status === 'aceito' || q?.status === 'aprovado';

      activeContract = {
        id: contractId,
        contractNumber: contractId.startsWith('CTR-') ? contractId : `CTR-${contractId.replace(/^QUOTE-|^PROP-/, '')}`,
        quoteId: q?.id || contractId,
        proposalId: p?.id,
        projectTitle: title,
        category: q?.category || 'Desenvolvimento Web & Mobile',
        version: 'v1.0',
        status: isSigned ? 'assinado' : 'aguardando_assinatura',
        createdAt: q?.createdAt || new Date().toISOString(),
        contractor: {
          companyName: siteConfig?.companyName || 'NCodes Technologies Ltda.',
          cnpj: siteConfig?.cnpj || '48.921.304/0001-92',
          address: siteConfig?.address || 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
          email: siteConfig?.contactEmail || 'contato@ncodes.com.br',
          phone: siteConfig?.contactPhone || '(11) 98765-4321',
          legalRepresentative: 'Nicolas P. - Diretor Executivo'
        },
        client: {
          fullName: clientName,
          companyName: companyName,
          cpfCnpj: 'Pendente de preenchimento',
          email: email,
          phone: phone,
          address: 'São Paulo - SP',
          legalRepresentative: clientName
        },
        description: p?.description || q?.description || 'Desenvolvimento de software proprietário sob medida com painel administrativo e APIs.',
        approvedScope: p?.scope || q?.scopeItems || q?.selectedFeatures || [
          'Desenvolvimento Web / Mobile Responsivo',
          'Painel Administrativo de Gestão',
          'Arquitetura em Nuvem com Banco de Dados SSL',
          'Garantia Técnica de 90 Dias e Suporte Dedicado'
        ],
        contractedFeatures: q?.selectedFeatures || [
          'Design UI/UX Customizado',
          'Autenticação Segura',
          'Relatórios e Indicadores',
          'Integrações via API REST'
        ],
        totalValue: totalVal,
        entryValue: Math.round(totalVal * 0.3),
        paymentMethod: 'PIX / Boleto Bancário / Cartão',
        paymentTerms: p?.paymentTerms || q?.paymentTerms || '30% de entrada no aceite + parcelamento por entregas',
        installments: [
          {
            number: 1,
            description: 'Sinal de Entrada no Aceite do Contrato (30%)',
            amount: Math.round(totalVal * 0.3),
            dueDate: new Date().toISOString().split('T')[0],
            status: isSigned ? 'pago' : 'pendente'
          },
          {
            number: 2,
            description: 'Entrega da 1ª Fase do Protótipo (35%)',
            amount: Math.round(totalVal * 0.35),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pendente'
          },
          {
            number: 3,
            description: 'Entrega Final e Publicação em Produção (35%)',
            amount: Math.round(totalVal * 0.35),
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pendente'
          }
        ],
        lateFeeClause: 'Em caso de atraso injustificado no pagamento de qualquer parcela por período superior a 5 dias, incidirá multa moratória de 10% sobre o valor devido.',
        estimatedDays: deadline,
        startDate: new Date().toISOString().split('T')[0],
        estimatedDeliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        objectClause: `O presente instrumento tem por objeto a prestação de serviços de engenharia e desenvolvimento de software pela CONTRATADA para concepção do projeto "${title}".`,
        scopeClause: 'O escopo contempla rigorosamente os módulos, telas e integrações acordadas na proposta comercial.',
        contractorObligations: [
          'Executar os serviços dentro dos mais elevados padrões de qualidade técnica e segurança.',
          'Informar o andamento das etapas através do Portal do Cliente.',
          'Manter total sigilo e confidencialidade das informações operacionais do CONTRATANTE.',
          'Prestar suporte técnico para correção de eventuais inconsistências durante a garantia de 90 dias.'
        ],
        clientObligations: [
          'Fornecer tempestivamente os conteúdos, credenciais e acessos necessários para o projeto.',
          'Aprovar ou solicitar ajustes nas entregas dentro do prazo estipulado.',
          'Efetuar o pagamento dos honorários ajustados nas respectivas datas de vencimento.'
        ],
        paymentClause: `Pela prestação dos serviços objeto deste contrato, o CONTRATANTE pagará o montante total de R$ ${totalVal.toLocaleString('pt-BR')}, nas condições e prazos acordados.`,
        changesAndExtraScopeClause: 'Quaisquer funcionalidades não descritas no escopo aprovado serão tratadas como aditivo contratual mediante novo orçamento.',
        timelineClause: `O prazo estimado de desenvolvimento e entrega final é de ${deadline}, contados a partir da entrega de insumos e confirmação da entrada.`,
        warrantyClause: 'A CONTRATADA concede garantia de 90 dias após a entrega final para correção gratuita de bugs decorrentes do desenvolvimento.',
        warrantyDays: 90,
        terminationClause: 'A rescisão imotivada sujeitará a parte desistente ao pagamento dos custos de trabalhos já executados até a data da notificação.',
        jurisdictionClause: 'Fica eleito o Foro da Comarca de São Paulo / SP para dirimir quaisquer questões decorrentes deste contrato.',
        signature: {
          signed: isSigned,
          signerName: p?.signatureName || clientName,
          signerDocument: 'CPF/CNPJ Registrado',
          signerEmail: email,
          signedAt: p?.acceptedAt || new Date().toISOString(),
          ipAddress: '187.58.122.94',
          digitalHash: `SHA256-${contractId}-${Date.now().toString(36)}`,
          contractorName: 'NCodes Technologies Ltda.'
        },
        history: [
          {
            id: 'hst-1',
            timestamp: new Date().toISOString(),
            user: 'Sistema NCodes',
            action: 'Documento de Contrato Disponibilizado',
            details: 'Minuta emitida para leitura e validação prévia.',
            version: 'v1.0'
          }
        ],
        qrCodeValue: `${window.location.origin}?contractId=${contractId}`
      };
    }
  }

  if (!activeContract) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <FileSignature className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contrato Não Encontrado</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            O documento de contrato solicitado ({contractId}) ainda não foi gerado ou está em processamento pela equipe técnica.
          </p>
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'document' | 'history' | 'signature'>('document');
  const [signerDocument, setSignerDocument] = useState(activeContract.client?.cpfCnpj || '');
  const [signerName, setSignerName] = useState(activeContract.client?.fullName || '');
  const [signing, setSigning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSigned = activeContract.status === 'assinado' || activeContract.signature?.signed;

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || !signerDocument) return;
    setSigning(true);
    try {
      await signContract(activeContract.id, {
        signerName,
        signerDocument,
        signerEmail: activeContract.client?.email
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSigning(false);
    }
  };

  const handlePrint = () => {
    const printElement = document.getElementById('contract-printable-area');
    if (!printElement) {
      window.print();
      return;
    }

    try {
      const printWindow = window.open('', '_blank', 'width=900,height=1000');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <title>${activeContract.contractNumber} - ${activeContract.projectTitle}</title>
              <meta charset="utf-8" />
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff !important; color: #000000 !important; padding: 15px; }
                  p, span, td, th, li, div, h1, h2, h3, h4, strong { color: #000000 !important; font-weight: 500 !important; }
                  .no-print { display: none !important; }
                }
                body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; background: #ffffff; color: #0f172a; font-weight: 500; }
              </style>
            </head>
            <body>
              <div style="max-width: 800px; margin: 0 auto;">
                ${printElement.innerHTML}
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                }, 600);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  const handleCopyValidation = () => {
    const valUrl = activeContract.qrCodeValue || `${window.location.origin}?contractId=${activeContract.id}`;
    navigator.clipboard.writeText(valUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                  Contrato de Prestação de Serviços
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isSigned ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {isSigned ? '🟢 Assinado Eletronicamente' : '🟡 Aguardando Assinatura'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {activeContract.contractNumber} — {activeContract.projectTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs (no print) */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 pt-3 pb-0 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'document'
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>Documento do Contrato</span>
            </button>

            <button
              onClick={() => setActiveTab('signature')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'signature'
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Assinatura Digital & Token</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico & Versões ({activeContract.history?.length || 0})</span>
            </button>
          </div>

          <button
            onClick={handleCopyValidation}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mb-2 cursor-pointer shrink-0"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Copiar Hash de Validação'}</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-8 text-slate-800 dark:text-slate-200 text-xs sm:text-sm bg-white dark:bg-slate-900">
          
          {activeTab === 'document' && (
            <div id="contract-printable-area" className="print-contract-container space-y-6 max-w-3xl mx-auto bg-white dark:bg-slate-950 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              
              {/* Document Header Branding */}
              <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {activeContract.contractor.companyName}
                  </h1>
                  <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 font-semibold">
                    CNPJ: {activeContract.contractor.cnpj} • {activeContract.contractor.email}
                  </p>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {activeContract.contractor.address}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest">
                    {activeContract.contractNumber}
                  </div>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium mt-1">Ref: Orçamento {activeContract.quoteId}</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Versão: {activeContract.version}</p>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center py-2 space-y-1">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE E TECNOLOGIA
                </h2>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold italic">
                  Documento padronizado emitido automaticamente por NCodes Technologies em {new Date(activeContract.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Qualificação das Partes */}
              <div className="bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider">
                  DAS PARTES CONTRATANTES
                </h3>
                
                <div className="space-y-2 text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  <p>
                    <strong className="text-slate-900 dark:text-white font-extrabold">CONTRATADA:</strong> <strong>{activeContract.contractor.companyName}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº {activeContract.contractor.cnpj}, com sede em {activeContract.contractor.address}, representada neste ato por seu {activeContract.contractor.legalRepresentative}.
                  </p>

                  <p>
                    <strong className="text-slate-900 dark:text-white font-extrabold">CONTRATANTE:</strong> <strong>{activeContract.client?.companyName || activeContract.client?.fullName}</strong>, inscrita sob o CPF/CNPJ nº <strong>{activeContract.client?.cpfCnpj || 'Pendente de preenchimento'}</strong>, e-mail {activeContract.client?.email}, telefone {activeContract.client?.phone}, representada por <strong>{activeContract.client?.legalRepresentative || activeContract.client?.fullName}</strong>.
                  </p>
                </div>
              </div>

              {/* Cláusula 1ª - Do Objeto */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA PRIMEIRA — DO OBJETO DO CONTRATO
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.objectClause}
                </p>
              </div>

              {/* Cláusula 2ª - Do Escopo do Projeto */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA SEGUNDA — DO ESCOPO APROVADO E ENTREGÁVEIS
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.scopeClause}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-300 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    Funcionalidades e Módulos Inclusos no Projeto:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeContract.approvedScope?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-900 dark:text-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cláusula 3ª - Das Obrigações da Contratada */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA TERCEIRA — DAS OBRIGAÇÕES DA CONTRATADA (NCODES)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                  {activeContract.contractorObligations?.map((ob, idx) => (
                    <li key={idx}>{ob}</li>
                  ))}
                </ul>
              </div>

              {/* Cláusula 4ª - Das Obrigações do Contratante */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA QUARTA — DAS OBRIGAÇÕES DO CONTRATANTE (CLIENTE)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                  {activeContract.clientObligations?.map((ob, idx) => (
                    <li key={idx}>{ob}</li>
                  ))}
                </ul>
              </div>

              {/* Cláusula 5ª - Do Preço e Condições de Pagamento */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA QUINTA — DO PREÇO, PARCELAMENTO E CONDIÇÕES DE PAGAMENTO
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  Pelos serviços ora contratados, o CONTRATANTE pagará à CONTRATADA o valor total fixo de <strong className="text-emerald-700 dark:text-emerald-400 font-black">R$ {activeContract.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, mediante as seguintes condições e datas de vencimento:
                </p>

                {/* Table of Main Installments - NO STATUS COLUMN */}
                <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Parcela / Descrição</th>
                        <th className="p-3">Data de Vencimento</th>
                        <th className="p-3">Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100">
                      {activeContract.installments?.map((inst, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{inst.description}</td>
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {inst.dueDate.includes('-') 
                              ? new Date(inst.dueDate + 'T12:00:00').toLocaleDateString('pt-BR') 
                              : inst.dueDate}
                          </td>
                          <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">
                            R$ {inst.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Monthly Fee Section - Initial agreed values and due date only */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-300 dark:border-slate-700 space-y-2 mt-3">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider block">
                    📌 Mensalidade de Suporte & Infraestrutura (Valores Iniciais Acordados):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-900 dark:text-slate-100 font-medium">
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400 font-bold block text-[11px] mb-0.5">Valor Mensal Inicial Acordado:</span>
                      <strong className="text-blue-700 dark:text-blue-400 font-extrabold text-sm">
                        {activeContract.recurringMonthlyValue && activeContract.recurringMonthlyValue > 0
                          ? `R$ ${activeContract.recurringMonthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês`
                          : 'Isento (Sem Mensalidade Recorrente)'}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400 font-bold block text-[11px] mb-0.5">Data de Vencimento da Mensalidade:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold font-mono text-sm">
                        {activeContract.monthlyDueDate 
                          ? (activeContract.monthlyDueDate.includes('-') 
                              ? new Date(activeContract.monthlyDueDate + 'T12:00:00').toLocaleDateString('pt-BR') 
                              : activeContract.monthlyDueDate) 
                          : 'Dia 10 de cada mês'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-slate-900 dark:text-amber-300 font-medium">
                  <strong className="text-amber-800 dark:text-amber-400 font-bold">⚠️ Cláusula de Mora e Inadimplência:</strong> {activeContract.lateFeeClause}
                </div>
              </div>

              {/* Cláusula 6ª - Escopo Adicional */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA SEXTA — DAS ALTERAÇÕES E SOLICITAÇÕES ADICIONAIS
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.changesAndExtraScopeClause}
                </p>
              </div>

              {/* Cláusula 7ª - Prazo */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA SÉTIMA — DO PRAZO E EXECUÇÃO
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.timelineClause} O prazo estimado de entrega do projeto é de <strong>{activeContract.estimatedDays}</strong>, com início em {new Date(activeContract.startDate).toLocaleDateString('pt-BR')} e entrega prevista para {new Date(activeContract.estimatedDeliveryDate).toLocaleDateString('pt-BR')}.
                </p>
              </div>

              {/* Cláusula 8ª - Garantia */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA OITAVA — DA GARANTIA TÉCNICA
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.warrantyClause}
                </p>
              </div>

              {/* Cláusula 9ª - Rescisão */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA NONA — DA RESCISÃO
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.terminationClause}
                </p>
              </div>

              {/* Cláusula 10ª - Foro */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-300 dark:border-slate-800">
                  CLÁUSULA DÉCIMA — DO FORO
                </h3>
                <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {activeContract.jurisdictionClause}
                </p>
              </div>

              {/* Assinaturas */}
              <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800 space-y-6">
                <h3 className="text-xs font-black uppercase text-center text-slate-900 dark:text-white tracking-widest">
                  ASSINATURAS E ACEITE DIGITAL
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Contratada */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center space-y-2">
                    <div className="h-10 flex items-center justify-center font-serif text-blue-600 dark:text-blue-400 italic font-bold">
                      NCodes Technologies Ltda.
                    </div>
                    <div className="border-t border-slate-300 dark:border-slate-700 pt-2">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">{activeContract.contractor.companyName}</p>
                      <p className="text-[10px] text-slate-500">CNPJ: {activeContract.contractor.cnpj}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓ Assinado Digitalmente pela Diretoria</p>
                    </div>
                  </div>

                  {/* Contratante / Cliente */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center space-y-2">
                    <div className="h-10 flex items-center justify-center font-serif text-slate-800 dark:text-slate-200 italic font-bold">
                      {isSigned ? (activeContract.signature?.signerName || activeContract.client?.fullName) : 'Pendente de Assinatura'}
                    </div>
                    <div className="border-t border-slate-300 dark:border-slate-700 pt-2">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {activeContract.client?.companyName || activeContract.client?.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500">CPF/CNPJ: {activeContract.signature?.signerDocument || activeContract.client?.cpfCnpj || '—'}</p>
                      {isSigned ? (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          ✓ Aceite em {new Date(activeContract.signature?.signedAt || '').toLocaleString('pt-BR')}
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                          ⏳ Aguardando aceite digital no painel
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Validation Footer Stamp */}
                <div className="p-3 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-blue-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Chave de Autenticação Digital SHA-256</p>
                      <p className="font-mono text-[10px] text-slate-400 truncate max-w-xs sm:max-w-md">
                        {activeContract.signature?.digitalHash || 'SHA256-PENDING-SIGNATURE'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-400 font-bold block">Documento Íntegro</span>
                    <span className="text-[10px] text-slate-400">Padrão NCodes Technologies</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Signature Tab */}
          {activeTab === 'signature' && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Assinatura Eletrônica do Contrato
                    </h3>
                    <p className="text-xs text-slate-500">Validade jurídica com registro de IP e hash criptográfico</p>
                  </div>
                </div>

                {isSigned ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Contrato Assinado com Sucesso!</span>
                    </div>
                    <div className="space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px] pt-1 border-t border-emerald-500/20">
                      <p><strong>Assinado por:</strong> {activeContract.signature?.signerName}</p>
                      <p><strong>CPF/CNPJ:</strong> {activeContract.signature?.signerDocument}</p>
                      <p><strong>Data/Hora:</strong> {activeContract.signature?.signedAt ? new Date(activeContract.signature.signedAt).toLocaleString('pt-BR') : '—'}</p>
                      <p><strong>Endereço IP:</strong> {activeContract.signature?.ipAddress || '187.58.122.94'}</p>
                      <p className="truncate"><strong>Hash SHA-256:</strong> {activeContract.signature?.digitalHash}</p>
                      <p><strong>Provedor de Integração:</strong> {activeContract.signature?.externalProvider || 'internal'}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSign} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nome Completo do Signatário / Representante *
                      </label>
                      <input
                        type="text"
                        required
                        value={signerName}
                        onChange={e => setSignerName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo Santos"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        CPF ou CNPJ do Signatário *
                      </label>
                      <input
                        type="text"
                        required
                        value={signerDocument}
                        onChange={e => setSignerDocument(e.target.value)}
                        placeholder="Ex: 34.567.890/0001-12 ou 123.456.789-00"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-800 dark:text-blue-300">
                      🔒 Ao clicar em <strong>Confirmar Assinatura Digital</strong>, você declara concordo integralmente com os termos e cláusulas deste contrato para o projeto <strong>{activeContract.projectTitle}</strong>.
                    </div>

                    <button
                      type="submit"
                      disabled={signing}
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileSignature className="w-4 h-4" />
                      <span>{signing ? 'Processando Assinatura...' : 'Confirmar e Assinar Eletronicamente'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Audit History Tab */}
          {activeTab === 'history' && (
            <div className="max-w-2xl mx-auto space-y-4 py-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                <span>Histórico do Contrato e Rastreabilidade</span>
              </h3>

              <div className="space-y-3">
                {activeContract.history?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{item.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(item.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.details}</p>
                    <p className="text-[10px] text-slate-400">Responsável: <strong>{item.user}</strong> • Versão: <strong>{item.version}</strong></p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
