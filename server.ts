import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

dotenv.config();

const _filename = typeof __filename !== 'undefined' ? __filename : path.join(process.cwd(), 'server.ts');
const _dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(_filename);

const app = express();
const PORT = 3000;

// Enable CORS for PWA Builder testing and external tools
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

// Initialize Gemini API client lazily when API calls are executed
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Real Email Dispatcher Helper (Resend REST API or SMTP Nodemailer)
async function dispatchRealEmail({
  to,
  subject,
  bodyText,
  emailConfig
}: {
  to: string;
  subject: string;
  bodyText: string;
  emailConfig?: {
    resendApiKey?: string;
    smtpHost?: string;
    smtpPort?: string;
    smtpUser?: string;
    smtpPass?: string;
    smtpFrom?: string;
  };
}) {
  const cleanResendKey = (emailConfig?.resendApiKey || process.env.RESEND_API_KEY || '').trim().replace(/^["'\s]+|["'\s]+$/g, '');
  const cleanSmtpHost = (emailConfig?.smtpHost || process.env.SMTP_HOST || '').trim();

  // Mode 1: Resend REST API (Direct HTTP fetch to https://api.resend.com/emails)
  if (cleanResendKey) {
    let fromAddress = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || 'NCodes Tech <onboarding@resend.dev>';

    // Attempt 1: Send via Resend REST API
    let response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanResendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        text: bodyText
      })
    });

    let resendData: any = await response.json().catch(() => ({}));

    // If custom domain 'from' failed (unverified in Resend), automatically retry with default 'onboarding@resend.dev'
    if (!response.ok && fromAddress !== 'NCodes Tech <onboarding@resend.dev>') {
      const errTxt = (resendData?.message || resendData?.error?.message || '').toLowerCase();
      if (errTxt.includes('domain') || errTxt.includes('from') || errTxt.includes('verify') || response.status === 422) {
        console.warn('⚠️ Custom from domain not verified in Resend. Retrying with default onboarding@resend.dev...');
        fromAddress = 'NCodes Tech <onboarding@resend.dev>';
        response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanResendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [to],
            subject,
            text: bodyText
          })
        });
        resendData = await response.json().catch(() => ({}));
      }
    }

    if (response.ok && (resendData.id || resendData.data?.id)) {
      const emailId = resendData.id || resendData.data?.id;
      console.log(`\n✅ [REAL EMAIL DISPATCHED via RESEND] To: ${to} | ID: ${emailId}`);
      return { provider: 'resend', id: emailId, delivered: true };
    }

    // Translate Resend errors into clear Portuguese guidance for the user
    const rawError = resendData?.message || resendData?.error?.message || JSON.stringify(resendData);
    let friendlyError = `Erro no Resend (${response.status}): ${rawError}`;

    if (response.status === 401 || rawError.toLowerCase().includes('api key') || rawError.toLowerCase().includes('unauthorized') || rawError.toLowerCase().includes('restricted')) {
      friendlyError = 'Chave API do Resend inválida. Verifique se copiou a chave completa (iniciando com "re_") em resend.com/api-keys.';
    } else if (rawError.toLowerCase().includes('only send to your own email address') || rawError.toLowerCase().includes('onboarding mode') || rawError.toLowerCase().includes('testing')) {
      friendlyError = `No plano de testes do Resend (gratuito), você só pode enviar e-mails para o mesmo endereço de e-mail cadastrado na sua conta do Resend.com. Por favor, coloque esse e-mail no campo "1. Seu E-mail Principal" ou cadastre seu próprio domínio em resend.com/domains. (Detalhes: ${rawError})`;
    } else if (rawError.toLowerCase().includes('validation') || rawError.toLowerCase().includes('from')) {
      friendlyError = `O remetente informado precisa ser verificado em resend.com/domains. Deixe o campo de remetente em branco para usar onboarding@resend.dev. (Erro: ${rawError})`;
    }

    throw new Error(friendlyError);
  }

  // Mode 2: Standard SMTP (Nodemailer)
  if (cleanSmtpHost) {
    const port = Number(emailConfig?.smtpPort || process.env.SMTP_PORT || 587);
    const user = emailConfig?.smtpUser?.trim() || process.env.SMTP_USER?.trim();
    const pass = emailConfig?.smtpPass?.trim() || process.env.SMTP_PASS?.trim();
    const from = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || user || 'contato@ncodestechnologies.com.br';

    const transporter = nodemailer.createTransport({
      host: cleanSmtpHost,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000
    });

    const info = await transporter.sendMail({
      from: `NCodes Technologies <${from}>`,
      to,
      subject,
      text: bodyText
    });

    console.log(`\n✅ [REAL EMAIL DISPATCHED via SMTP] To: ${to} | MessageID: ${info.messageId}`);
    return { provider: 'smtp', messageId: info.messageId, delivered: true };
  }

  // Mode 3: Simulation / Server Log
  console.log(`\n⚠️ [EMAIL LOGGED - NO API KEY SET] To: ${to}\nSubject: ${subject}\n${bodyText}`);
  return {
    provider: 'simulation',
    delivered: false,
    message: 'E-mail registrado no log do servidor. Adicione uma Chave API do Resend (grátis) para envio direto para caixas de entrada.'
  };
}

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NCodes Technologies API', timestamp: new Date().toISOString() });
});

// Test Email Dispatch Endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { recipientEmail, emailConfig } = req.body;
    const targetEmail = recipientEmail || 'p.nikolas3@gmail.com';

    const subject = '[NCodes Tech] 🧪 Teste de Conexão de E-mail do Sistema';
    const bodyText = `
==================================================
NCODES TECHNOLOGIES - TESTE DE ENVIO DE E-MAIL
==================================================
Data/Hora: ${new Date().toLocaleString('pt-BR')}
E-mail de Destino: ${targetEmail}

Este é um e-mail de teste para confirmar que as notificações automáticas do sistema estão configuradas e entregando mensagens na sua caixa de entrada com sucesso!

Notificações ativas:
1. Alertas de Novos Clientes Cadastrados
2. Alertas de Novas Solicitações de Orçamento
3. E-mails de Posicionamento e Atualização de Orçamento enviados aos Clientes
==================================================
`;

    const dispatchResult = await dispatchRealEmail({
      to: targetEmail,
      subject,
      bodyText,
      emailConfig
    });

    return res.json({
      success: true,
      result: dispatchResult,
      recipient: targetEmail
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Erro ao enviar e-mail de teste';
    console.error('Erro no envio de e-mail de teste:', errMessage);
    return res.status(200).json({ success: false, error: errMessage });
  }
});

// Email Notification API (New Client, New Quote & Client Status Updates)
app.post('/api/send-email-notification', async (req, res) => {
  try {
    const { type, recipientEmail, data, emailConfig } = req.body;
    const targetEmail = recipientEmail || 'contato@ncodestechnologies.com.br';

    let subject = '';
    let bodyText = '';

    if (type === 'client_registration_confirmation') {
      subject = `[NCodes Tech] 🎉 Confirmação de Cadastro - Portal do Cliente`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - CONFIRMAÇÃO DE CADASTRO
==================================================
Olá, ${data?.name || 'Cliente'}!

Seja muito bem-vindo(a) à NCodes Technologies!
Seu cadastro no nosso Portal do Cliente foi concluído com sucesso.

SEUS DADOS REGISTRADOS:
- Nome: ${data?.name || 'Não informado'}
- E-mail de Acesso: ${targetEmail}
- Empresa: ${data?.company || 'Pessoa Física'}
- Telefone/WhatsApp: ${data?.phone || 'Não informado'}

NO PORTAL DO CLIENTE VOCÊ PODE:
1. Solicitar novos orçamentos com formulário detalhado e análise de IA.
2. Acompanhar em tempo real o status de aprovação de seus projetos.
3. Visualizar e aceitar propostas comerciais com assinatura digital.
4. Interagir diretamente com nossa equipe via chat e suporte.

Acesse o portal a qualquer momento:
https://ncodestechnologies.com.br

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else if (type === 'quote_confirmation_client') {
      subject = `[NCodes Tech] 📋 Solicitação de Orçamento Recebida - #${data?.quoteId || ''}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - CONFIRMAÇÃO DE SOLICITAÇÃO DE ORÇAMENTO
==================================================
Olá, ${data?.clientName || 'Cliente'}!

Confirmamos o recebimento da sua solicitação de orçamento com sucesso!
Sua proposta já deu entrada no nosso sistema e recebeu o código #${data?.quoteId || 'NOVO'}.

RESUMO DA SUA SOLICITAÇÃO:
- Código do Orçamento: ${data?.quoteId || 'N/A'}
- Título do Projeto: ${data?.projectTitle || 'Não informado'}
- Categoria: ${data?.category || 'Sistema Web'}
- Funcionalidades Selecionadas: ${Array.isArray(data?.selectedFeatures) && data.selectedFeatures.length > 0 ? data.selectedFeatures.join(', ') : 'Conforme descrição'}
- Prazo Desejado: ${data?.deadline || 'A combinar'}
- Faixa de Investimento: ${data?.budgetRange || 'A combinar'}

PRÓXIMOS PASSOS:
1. Nossa Inteligência Artificial e equipe de Engenharia de Software estão realizando a pré-análise técnica do escopo.
2. Você receberá atualizações sobre o status do orçamento no seu e-mail e na aba 'Meus Orçamentos' do Portal do Cliente.
3. Assim que a análise for concluída, emitiremos sua Proposta Comercial Digital para visualização.

Acompanhe sua solicitação no Portal do Cliente:
https://ncodestechnologies.com.br

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else if (type === 'new_client') {
      subject = `[NCodes Tech] 👤 Novo Cliente Cadastrado: ${data?.name || 'Cliente'}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ALERTA DE NOVO CLIENTE CADASTRADO
==================================================
Data/Hora: ${new Date().toLocaleString('pt-BR')}
E-mail do Destinatário: ${targetEmail}

DETALHES DO CLIENTE:
- Nome: ${data?.name || 'Não informado'}
- E-mail: ${data?.email || 'Não informado'}
- Empresa: ${data?.company || 'Pessoa Física'}
- Telefone / WhatsApp: ${data?.phone || 'Não informado'}
- Localização: ${data?.city || 'São Paulo'} / ${data?.state || 'SP'}

Acesse o Painel Web Admin para iniciar o atendimento.
==================================================
`;
    } else if (type === 'new_quote') {
      subject = `[NCodes Tech] 🚀 Nova Solicitação de Orçamento: ${data?.quoteId || ''}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ALERTA DE NOVO ORÇAMENTO
==================================================
Data/Hora: ${new Date().toLocaleString('pt-BR')}
E-mail do Destinatário: ${targetEmail}

DETALHES DA SOLICITAÇÃO:
- ID do Orçamento: ${data?.quoteId || 'NOVO'}
- Solicitante: ${data?.clientName || 'Não informado'}
- Empresa: ${data?.company || 'Pessoa Física'}
- E-mail de Contato: ${data?.email || 'Não informado'}
- WhatsApp: ${data?.whatsapp || 'Não informado'}
- Prazo Desejado: ${data?.deadline || 'A combinar'}
- Faixa Estimada: ${data?.budgetRange || 'A combinar'}

REQUISITOS DO PROJETO:
"${data?.description || 'Sem descrição'}"

Acesse o Painel Web Admin para analisar o orçamento e emitir a proposta.
==================================================
`;
    } else if (type === 'quote_status_update') {
      subject = `[NCodes Tech] 📋 Posicionamento do seu Orçamento #${data?.quoteId || ''}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ATUALIZAÇÃO DE ORÇAMENTO
==================================================
Prezado(a) ${data?.clientName || 'Cliente'},

Informamos que o status do seu orçamento #${data?.quoteId || ''} foi atualizado para:
>>> STATUS: ${data?.statusLabel || data?.status || 'Em Análise'} <<<

${data?.message ? `MENSAGEM / POSICIONAMENTO DA NOSSA EQUIPE:\n"${data.message}"\n` : ''}

Acesse o Portal do Cliente para acompanhar os detalhes e visualizar propostas emitidas.
Website: https://ncodestechnologies.com.br

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else if (type === 'proposal_issued') {
      subject = `[NCodes Tech] 📄 Proposta Comercial #${data?.proposalId || ''} Disponível para Aceite Digital`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - PROPOSTA COMERCIAL EMITIDA
==================================================
Prezado(a) ${data?.clientName || 'Cliente'},

Sua Proposta Comercial #${data?.proposalId || ''} referente ao orçamento #${data?.quoteId || ''} foi gerada e está pronta para sua validação!

DETALHES DA PROPOSTA:
- Título: ${data?.title || 'Proposta Técnica'}
- Valor Total: R$ ${data?.totalValue ? Number(data.totalValue).toLocaleString('pt-BR') : '0,00'}
- Condições: ${data?.paymentTerms || 'A combinar'}

Acesse o Portal do Cliente para visualizar os itens do escopo e assinar digitalmente o contrato.

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else {
      return res.status(400).json({ error: 'Tipo de notificação inválido.' });
    }

    const dispatchResult = await dispatchRealEmail({
      to: targetEmail,
      subject,
      bodyText,
      emailConfig
    });

    return res.json({
      success: true,
      message: dispatchResult.delivered ? 'E-mail entregue com sucesso.' : 'E-mail processado no sistema.',
      dispatchResult,
      recipient: targetEmail,
      subject,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Erro ao enviar notificação por e-mail';
    console.error('Erro no envio de e-mail:', errMessage);
    return res.status(200).json({ success: false, error: errMessage });
  }
});

// AI Quote Analysis Route using Gemini API
app.post('/api/ai-analyze-quote', async (req, res) => {
  try {
    const { projectType, description, deadline, budgetRange } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Descrição do projeto é obrigatória.' });
    }

    const prompt = `Você é o Arquiteto de Software Chefe da empresa NCodes Technologies.
Analise a seguinte solicitação de orçamento de um cliente e forneça uma estimativa técnica detalhada em formato JSON estrito:

Tipo de Projeto: ${projectType || 'Não especificado'}
Descrição: ${description}
Prazo Desejado: ${deadline || 'A combinar'}
Faixa de Investimento Estimada pelo Cliente: ${budgetRange || 'A combinar'}

Forneça um objeto JSON válido com a seguinte estrutura exatamente:
{
  "recommendedTech": ["tecnologia1", "tecnologia2", "tecnologia3", "tecnologia4"],
  "estimatedHours": 120,
  "suggestedBudget": 18500,
  "complexity": "Baixa" | "Média" | "Alta",
  "summary": "Breve análise do projeto, destacando pontos críticos, valor agregado e recomendação técnica."
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch {
      parsedResult = {
        recommendedTech: ['React', 'Flutter', 'Firebase', 'Node.js'],
        estimatedHours: 120,
        suggestedBudget: 15000,
        complexity: 'Média',
        summary: 'Projeto analisado com sucesso pela NCodes Technologies.'
      };
    }

    return res.json({ success: true, analysis: parsedResult });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Erro ao processar análise por IA';
    console.error('Erro na rota /api/ai-analyze-quote:', errMessage);
    
    // Fallback response if API key is not present or API call fails
    return res.json({
      success: true,
      fallback: true,
      analysis: {
        recommendedTech: ['Flutter', 'React', 'Firebase', 'TypeScript', 'Node.js'],
        estimatedHours: 140,
        suggestedBudget: 18000,
        complexity: 'Média',
        summary: 'Projeto analisado pela equipe de engenharia da NCodes Technologies. Escopo compatível com tecnologia móvel e web em tempo real.'
      }
    });
  }
});

// Vite middleware in dev mode / static files in production
async function startServer() {
  // Always serve public static assets (manifest.json, sw.js, icons, etc.)
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NCodes Technologies server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
