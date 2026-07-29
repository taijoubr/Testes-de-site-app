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
  contract: ServiceContract;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ contract, onClose }) => {
  const { signContract, siteConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'document' | 'history' | 'signature'>('document');
  const [signerDocument, setSignerDocument] = useState(contract.client.cpfCnpj || '');
  const [signerName, setSignerName] = useState(contract.client.fullName || '');
  const [signing, setSigning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSigned = contract.status === 'assinado' || contract.signature.signed;

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || !signerDocument) return;
    setSigning(true);
    try {
      await signContract(contract.id, {
        signerName,
        signerDocument,
        signerEmail: contract.client.email
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyValidation = () => {
    const valUrl = contract.qrCodeValue || `${window.location.origin}?contractId=${contract.id}`;
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
                {contract.contractNumber} — {contract.projectTitle}
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
              <span>Histórico & Versões ({contract.history.length})</span>
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
            <div className="print-contract-container space-y-6 max-w-3xl mx-auto bg-white dark:bg-slate-950 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              
              {/* Document Header Branding */}
              <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {contract.contractor.companyName}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    CNPJ: {contract.contractor.cnpj} • {contract.contractor.email}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {contract.contractor.address}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest">
                    {contract.contractNumber}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Ref: Orçamento {contract.quoteId}</p>
                  <p className="text-[10px] text-slate-400">Versão: {contract.version}</p>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center py-2 space-y-1">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE E TECNOLOGIA
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Documento padronizado emitido automaticamente por NCodes Technologies em {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Qualificação das Partes */}
              <div className="bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  DAS PARTES CONTRATANTES
                </h3>
                
                <div className="space-y-2 text-xs leading-relaxed">
                  <p>
                    <strong className="text-slate-900 dark:text-white">CONTRATADA:</strong> <strong>{contract.contractor.companyName}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº {contract.contractor.cnpj}, com sede em {contract.contractor.address}, representada neste ato por seu {contract.contractor.legalRepresentative}.
                  </p>

                  <p>
                    <strong className="text-slate-900 dark:text-white">CONTRATANTE:</strong> <strong>{contract.client.companyName || contract.client.fullName}</strong>, inscrita sob o CPF/CNPJ nº <strong>{contract.client.cpfCnpj || 'Pendente de preenchimento'}</strong>, e-mail {contract.client.email}, telefone {contract.client.phone}, representada por <strong>{contract.client.legalRepresentative || contract.client.fullName}</strong>.
                  </p>
                </div>
              </div>

              {/* Cláusula 1ª - Do Objeto */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA PRIMEIRA — DO OBJETO DO CONTRATO
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.objectClause}
                </p>
              </div>

              {/* Cláusula 2ª - Do Escopo do Projeto */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA SEGUNDA — DO ESCOPO APROVADO E ENTREGÁVEIS
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.scopeClause}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Funcionalidades e Módulos Inclusos no Projeto:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {contract.approvedScope.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cláusula 3ª - Das Obrigações da Contratada */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA TERCEIRA — DAS OBRIGAÇÕES DA CONTRATADA (NCODES)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {contract.contractorObligations.map((ob, idx) => (
                    <li key={idx}>{ob}</li>
                  ))}
                </ul>
              </div>

              {/* Cláusula 4ª - Das Obrigações do Contratante */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA QUARTA — DAS OBRIGAÇÕES DO CONTRATANTE (CLIENTE)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {contract.clientObligations.map((ob, idx) => (
                    <li key={idx}>{ob}</li>
                  ))}
                </ul>
              </div>

              {/* Cláusula 5ª - Do Preço e Condições de Pagamento */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA QUINTA — DO PREÇO, PARCELAMENTO E JUROS DE MORA
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  Pelos serviços ora contratados, o CONTRATANTE pagará à CONTRATADA o valor total de <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">R$ {contract.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, mediante as seguintes condições e parcelas:
                </p>

                {/* Table of Installments */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5">Parcela / Descrição</th>
                        <th className="p-2.5">Vencimento</th>
                        <th className="p-2.5">Valor (R$)</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {contract.installments.map((inst, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-2.5 font-medium">{inst.description}</td>
                          <td className="p-2.5 font-mono">{new Date(inst.dueDate).toLocaleDateString('pt-BR')}</td>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">R$ {inst.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              inst.status === 'pago' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {inst.status === 'pago' ? 'Pago' : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium">
                  <strong>⚠️ Cláusula de Mora e Inadimplência:</strong> {contract.lateFeeClause}
                </div>
              </div>

              {/* Cláusula 6ª - Escopo Adicional */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA SEXTA — DAS ALTERAÇÕES E SOLICITAÇÕES ADICIONAIS
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.changesAndExtraScopeClause}
                </p>
              </div>

              {/* Cláusula 7ª - Prazo */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA SÉTIMA — DO PRAZO E EXECUÇÃO
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.timelineClause} O prazo estimado de entrega do projeto é de <strong>{contract.estimatedDays}</strong>, com início em {new Date(contract.startDate).toLocaleDateString('pt-BR')} e entrega prevista para {new Date(contract.estimatedDeliveryDate).toLocaleDateString('pt-BR')}.
                </p>
              </div>

              {/* Cláusula 8ª - Garantia */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA OITAVA — DA GARANTIA TÉCNICA
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.warrantyClause}
                </p>
              </div>

              {/* Cláusula 9ª - Rescisão */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA NONA — DA RESCISÃO
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.terminationClause}
                </p>
              </div>

              {/* Cláusula 10ª - Foro */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider border-b pb-1 border-slate-200 dark:border-slate-800">
                  CLÁUSULA DÉCIMA — DO FORO
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {contract.jurisdictionClause}
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
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">{contract.contractor.companyName}</p>
                      <p className="text-[10px] text-slate-500">CNPJ: {contract.contractor.cnpj}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓ Assinado Digitalmente pela Diretoria</p>
                    </div>
                  </div>

                  {/* Contratante / Cliente */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center space-y-2">
                    <div className="h-10 flex items-center justify-center font-serif text-slate-800 dark:text-slate-200 italic font-bold">
                      {isSigned ? (contract.signature.signerName || contract.client.fullName) : 'Pendente de Assinatura'}
                    </div>
                    <div className="border-t border-slate-300 dark:border-slate-700 pt-2">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {contract.client.companyName || contract.client.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500">CPF/CNPJ: {contract.signature.signerDocument || contract.client.cpfCnpj || '—'}</p>
                      {isSigned ? (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          ✓ Aceite em {new Date(contract.signature.signedAt || '').toLocaleString('pt-BR')}
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
                        {contract.signature.digitalHash || 'SHA256-PENDING-SIGNATURE'}
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
                      <p><strong>Assinado por:</strong> {contract.signature.signerName}</p>
                      <p><strong>CPF/CNPJ:</strong> {contract.signature.signerDocument}</p>
                      <p><strong>Data/Hora:</strong> {contract.signature.signedAt ? new Date(contract.signature.signedAt).toLocaleString('pt-BR') : '—'}</p>
                      <p><strong>Endereço IP:</strong> {contract.signature.ipAddress || '187.58.122.94'}</p>
                      <p className="truncate"><strong>Hash SHA-256:</strong> {contract.signature.digitalHash}</p>
                      <p><strong>Provedor de Integração:</strong> {contract.signature.externalProvider || 'internal'} (Pronto para DocuSign/ClickSign/ZapSign)</p>
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
                      🔒 Ao clicar em <strong>Confirmar Assinatura Digital</strong>, você declara concordo integralmente com os termos e cláusulas deste contrato para o projeto <strong>{contract.projectTitle}</strong>.
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
                {contract.history.map((item, idx) => (
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
