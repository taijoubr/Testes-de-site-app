import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

// Real Email Dispatcher Helper (Resend or SMTP Nodemailer)
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
  const resendKey = emailConfig?.resendApiKey?.trim() || process.env.RESEND_API_KEY?.trim();
  const smtpHost = emailConfig?.smtpHost?.trim() || process.env.SMTP_HOST?.trim();

  // Mode 1: Resend API (Free & Fast for real email delivery to Gmail/Outlook)
  if (resendKey) {
    const resend = new Resend(resendKey);
    const fromAddress = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || 'NCodes Tech <onboarding@resend.dev>';
    
    const result = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text: bodyText
    });

    if (result.error) {
      throw new Error(`Erro no Resend: ${result.error.message}`);
    }

    console.log(`\n✅ [REAL EMAIL DISPATCHED via RESEND] To: ${to} | ID: ${result.data?.id}`);
    return { provider: 'resend', id: result.data?.id, delivered: true };
  }

  // Mode 2: Standard SMTP (Hostgator, Locaweb, Gmail, SendGrid, Amazon SES)
  if (smtpHost) {
    const port = Number(emailConfig?.smtpPort || process.env.SMTP_PORT || 587);
    const user = emailConfig?.smtpUser?.trim() || process.env.SMTP_USER?.trim();
    const pass = emailConfig?.smtpPass?.trim() || process.env.SMTP_PASS?.trim();
    const from = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || user || 'contato@ncodestechnologies.com.br';

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined
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

  // Mode 3: Log only (no key provided yet)
  console.log(`\n⚠️ [EMAIL LOGGED - NO API KEY SET] To: ${to}\nSubject: ${subject}\n${bodyText}`);
  return {
    provider: 'simulation',
    delivered: false,
    message: 'E-mail registrado no log do servidor. Para entrega real na sua caixa de entrada (Gmail/Outlook), adicione a Chave API do Resend (grátis) ou dados SMTP em Configurações > Notificações por E-mail.'
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
    return res.status(500).json({ success: false, error: errMessage });
  }
});

// Email Notification API (New Client, New Quote & Client Status Updates)
app.post('/api/send-email-notification', async (req, res) => {
  try {
    const { type, recipientEmail, data, emailConfig } = req.body;
    const targetEmail = recipientEmail || 'contato@ncodestechnologies.com.br';

    let subject = '';
    let bodyText = '';

    if (type === 'new_client') {
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
    return res.status(500).json({ error: errMessage });
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
    app.get('*all', (_req, res) => {
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
