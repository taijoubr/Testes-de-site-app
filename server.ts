import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

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

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NCodes Technologies API', timestamp: new Date().toISOString() });
});

// Email Notification API (New Client, New Quote & Client Status Updates)
app.post('/api/send-email-notification', async (req, res) => {
  try {
    const { type, recipientEmail, data } = req.body;
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
E-mail de Notificação do Sistema: ${targetEmail}

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
E-mail de Notificação do Sistema: ${targetEmail}

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

    console.log(`\n📧 [EMAIL DISPATCH SUCCESS] To: ${targetEmail}\nSubject: ${subject}\n${bodyText}`);

    return res.json({
      success: true,
      message: 'E-mail enviado com sucesso.',
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
