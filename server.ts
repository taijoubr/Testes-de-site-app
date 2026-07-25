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
