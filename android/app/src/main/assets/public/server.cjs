var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
import_dotenv.default.config();
var _filename = typeof __filename !== "undefined" ? __filename : import_path.default.join(process.cwd(), "server.ts");
var _dirname = typeof __dirname !== "undefined" ? __dirname : import_path.default.dirname(_filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
async function dispatchRealEmail({
  to,
  subject,
  bodyText,
  emailConfig
}) {
  const cleanResendKey = (emailConfig?.resendApiKey || process.env.RESEND_API_KEY || "").trim().replace(/^["'\s]+|["'\s]+$/g, "");
  const cleanSmtpHost = (emailConfig?.smtpHost || process.env.SMTP_HOST || "").trim();
  if (cleanResendKey) {
    let fromAddress = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || "NCodes Tech <onboarding@resend.dev>";
    let response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cleanResendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        text: bodyText
      })
    });
    let resendData = await response.json().catch(() => ({}));
    if (!response.ok && fromAddress !== "NCodes Tech <onboarding@resend.dev>") {
      const errTxt = (resendData?.message || resendData?.error?.message || "").toLowerCase();
      if (errTxt.includes("domain") || errTxt.includes("from") || errTxt.includes("verify") || response.status === 422) {
        console.warn("\u26A0\uFE0F Custom from domain not verified in Resend. Retrying with default onboarding@resend.dev...");
        fromAddress = "NCodes Tech <onboarding@resend.dev>";
        response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${cleanResendKey}`,
            "Content-Type": "application/json"
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
      console.log(`
\u2705 [REAL EMAIL DISPATCHED via RESEND] To: ${to} | ID: ${emailId}`);
      return { provider: "resend", id: emailId, delivered: true };
    }
    const rawError = resendData?.message || resendData?.error?.message || JSON.stringify(resendData);
    let friendlyError = `Erro no Resend (${response.status}): ${rawError}`;
    if (response.status === 401 || rawError.toLowerCase().includes("api key") || rawError.toLowerCase().includes("unauthorized") || rawError.toLowerCase().includes("restricted")) {
      friendlyError = 'Chave API do Resend inv\xE1lida. Verifique se copiou a chave completa (iniciando com "re_") em resend.com/api-keys.';
    } else if (rawError.toLowerCase().includes("only send to your own email address") || rawError.toLowerCase().includes("onboarding mode") || rawError.toLowerCase().includes("testing")) {
      friendlyError = `No plano de testes do Resend (gratuito), voc\xEA s\xF3 pode enviar e-mails para o mesmo endere\xE7o de e-mail cadastrado na sua conta do Resend.com. Por favor, coloque esse e-mail no campo "1. Seu E-mail Principal" ou cadastre seu pr\xF3prio dom\xEDnio em resend.com/domains. (Detalhes: ${rawError})`;
    } else if (rawError.toLowerCase().includes("validation") || rawError.toLowerCase().includes("from")) {
      friendlyError = `O remetente informado precisa ser verificado em resend.com/domains. Deixe o campo de remetente em branco para usar onboarding@resend.dev. (Erro: ${rawError})`;
    }
    throw new Error(friendlyError);
  }
  if (cleanSmtpHost) {
    const port = Number(emailConfig?.smtpPort || process.env.SMTP_PORT || 587);
    const user = emailConfig?.smtpUser?.trim() || process.env.SMTP_USER?.trim();
    const pass = emailConfig?.smtpPass?.trim() || process.env.SMTP_PASS?.trim();
    const from = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || user || "contato@ncodestechnologies.com.br";
    const transporter = import_nodemailer.default.createTransport({
      host: cleanSmtpHost,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : void 0,
      connectionTimeout: 8e3,
      greetingTimeout: 8e3,
      socketTimeout: 8e3
    });
    const info = await transporter.sendMail({
      from: `NCodes Technologies <${from}>`,
      to,
      subject,
      text: bodyText
    });
    console.log(`
\u2705 [REAL EMAIL DISPATCHED via SMTP] To: ${to} | MessageID: ${info.messageId}`);
    return { provider: "smtp", messageId: info.messageId, delivered: true };
  }
  console.log(`
\u26A0\uFE0F [EMAIL LOGGED - NO API KEY SET] To: ${to}
Subject: ${subject}
${bodyText}`);
  return {
    provider: "simulation",
    delivered: false,
    message: "E-mail registrado no log do servidor. Adicione uma Chave API do Resend (gr\xE1tis) para envio direto para caixas de entrada."
  };
}
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "NCodes Technologies API", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/test-email", async (req, res) => {
  try {
    const { recipientEmail, emailConfig } = req.body;
    const targetEmail = recipientEmail || "p.nikolas3@gmail.com";
    const subject = "[NCodes Tech] \u{1F9EA} Teste de Conex\xE3o de E-mail do Sistema";
    const bodyText = `
==================================================
NCODES TECHNOLOGIES - TESTE DE ENVIO DE E-MAIL
==================================================
Data/Hora: ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}
E-mail de Destino: ${targetEmail}

Este \xE9 um e-mail de teste para confirmar que as notifica\xE7\xF5es autom\xE1ticas do sistema est\xE3o configuradas e entregando mensagens na sua caixa de entrada com sucesso!

Notifica\xE7\xF5es ativas:
1. Alertas de Novos Clientes Cadastrados
2. Alertas de Novas Solicita\xE7\xF5es de Or\xE7amento
3. E-mails de Posicionamento e Atualiza\xE7\xE3o de Or\xE7amento enviados aos Clientes
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
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Erro ao enviar e-mail de teste";
    console.error("Erro no envio de e-mail de teste:", errMessage);
    return res.status(200).json({ success: false, error: errMessage });
  }
});
app.post("/api/send-email-notification", async (req, res) => {
  try {
    const { type, recipientEmail, data, emailConfig } = req.body;
    const targetEmail = recipientEmail || "contato@ncodestechnologies.com.br";
    let subject = "";
    let bodyText = "";
    if (type === "client_registration_confirmation") {
      subject = `[NCodes Tech] \u{1F389} Confirma\xE7\xE3o de Cadastro - Portal do Cliente`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - CONFIRMA\xC7\xC3O DE CADASTRO
==================================================
Ol\xE1, ${data?.name || "Cliente"}!

Seja muito bem-vindo(a) \xE0 NCodes Technologies!
Seu cadastro no nosso Portal do Cliente foi conclu\xEDdo com sucesso.

SEUS DADOS REGISTRADOS:
- Nome: ${data?.name || "N\xE3o informado"}
- E-mail de Acesso: ${targetEmail}
- Empresa: ${data?.company || "Pessoa F\xEDsica"}
- Telefone/WhatsApp: ${data?.phone || "N\xE3o informado"}

NO PORTAL DO CLIENTE VOC\xCA PODE:
1. Solicitar novos or\xE7amentos com formul\xE1rio detalhado e an\xE1lise de IA.
2. Acompanhar em tempo real o status de aprova\xE7\xE3o de seus projetos.
3. Visualizar e aceitar propostas comerciais com assinatura digital.
4. Interagir diretamente com nossa equipe via chat e suporte.

Acesse o portal a qualquer momento:
https://ncodestechnologies.com.br

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else if (type === "quote_confirmation_client") {
      subject = `[NCodes Tech] \u{1F4CB} Solicita\xE7\xE3o de Or\xE7amento Recebida - #${data?.quoteId || ""}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - CONFIRMA\xC7\xC3O DE SOLICITA\xC7\xC3O DE OR\xC7AMENTO
==================================================
Ol\xE1, ${data?.clientName || "Cliente"}!

Confirmamos o recebimento da sua solicita\xE7\xE3o de or\xE7amento com sucesso!
Sua proposta j\xE1 deu entrada no nosso sistema e recebeu o c\xF3digo #${data?.quoteId || "NOVO"}.

RESUMO DA SUA SOLICITA\xC7\xC3O:
- C\xF3digo do Or\xE7amento: ${data?.quoteId || "N/A"}
- T\xEDtulo do Projeto: ${data?.projectTitle || "N\xE3o informado"}
- Categoria: ${data?.category || "Sistema Web"}
- Funcionalidades Selecionadas: ${Array.isArray(data?.selectedFeatures) && data.selectedFeatures.length > 0 ? data.selectedFeatures.join(", ") : "Conforme descri\xE7\xE3o"}
- Prazo Desejado: ${data?.deadline || "A combinar"}
- Faixa de Investimento: ${data?.budgetRange || "A combinar"}

PR\xD3XIMOS PASSOS:
1. Nossa Intelig\xEAncia Artificial e equipe de Engenharia de Software est\xE3o realizando a pr\xE9-an\xE1lise t\xE9cnica do escopo.
2. Voc\xEA receber\xE1 atualiza\xE7\xF5es sobre o status do or\xE7amento no seu e-mail e na aba 'Meus Or\xE7amentos' do Portal do Cliente.
3. Assim que a an\xE1lise for conclu\xEDda, emitiremos sua Proposta Comercial Digital para visualiza\xE7\xE3o.

Acompanhe sua solicita\xE7\xE3o no Portal do Cliente:
https://ncodestechnologies.com.br

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else if (type === "new_client") {
      subject = `[NCodes Tech] \u{1F464} Novo Cliente Cadastrado: ${data?.name || "Cliente"}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ALERTA DE NOVO CLIENTE CADASTRADO
==================================================
Data/Hora: ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}
E-mail do Destinat\xE1rio: ${targetEmail}

DETALHES DO CLIENTE:
- Nome: ${data?.name || "N\xE3o informado"}
- E-mail: ${data?.email || "N\xE3o informado"}
- Empresa: ${data?.company || "Pessoa F\xEDsica"}
- Telefone / WhatsApp: ${data?.phone || "N\xE3o informado"}
- Localiza\xE7\xE3o: ${data?.city || "S\xE3o Paulo"} / ${data?.state || "SP"}

Acesse o Painel Web Admin para iniciar o atendimento.
==================================================
`;
    } else if (type === "new_quote") {
      subject = `[NCodes Tech] \u{1F680} Nova Solicita\xE7\xE3o de Or\xE7amento: ${data?.quoteId || ""}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ALERTA DE NOVO OR\xC7AMENTO
==================================================
Data/Hora: ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}
E-mail do Destinat\xE1rio: ${targetEmail}

DETALHES DA SOLICITA\xC7\xC3O:
- ID do Or\xE7amento: ${data?.quoteId || "NOVO"}
- Solicitante: ${data?.clientName || "N\xE3o informado"}
- Empresa: ${data?.company || "Pessoa F\xEDsica"}
- E-mail de Contato: ${data?.email || "N\xE3o informado"}
- WhatsApp: ${data?.whatsapp || "N\xE3o informado"}
- Prazo Desejado: ${data?.deadline || "A combinar"}
- Faixa Estimada: ${data?.budgetRange || "A combinar"}

REQUISITOS DO PROJETO:
"${data?.description || "Sem descri\xE7\xE3o"}"

Acesse o Painel Web Admin para analisar o or\xE7amento e emitir a proposta.
==================================================
`;
    } else if (type === "quote_status_update") {
      subject = `[NCodes Tech] \u{1F4CB} Posicionamento do seu Or\xE7amento #${data?.quoteId || ""}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ATUALIZA\xC7\xC3O DE OR\xC7AMENTO
==================================================
Prezado(a) ${data?.clientName || "Cliente"},

Informamos que o status do seu or\xE7amento #${data?.quoteId || ""} foi atualizado para:
>>> STATUS: ${data?.statusLabel || data?.status || "Em An\xE1lise"} <<<

${data?.message ? `MENSAGEM / POSICIONAMENTO DA NOSSA EQUIPE:
"${data.message}"
` : ""}

Acesse o Portal do Cliente para acompanhar os detalhes e visualizar propostas emitidas.
Website: https://ncodestechnologies.com.br

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else if (type === "proposal_issued") {
      subject = `[NCodes Tech] \u{1F4C4} Proposta Comercial #${data?.proposalId || ""} Dispon\xEDvel para Aceite Digital`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - PROPOSTA COMERCIAL EMITIDA
==================================================
Prezado(a) ${data?.clientName || "Cliente"},

Sua Proposta Comercial #${data?.proposalId || ""} referente ao or\xE7amento #${data?.quoteId || ""} foi gerada e est\xE1 pronta para sua valida\xE7\xE3o!

DETALHES DA PROPOSTA:
- T\xEDtulo: ${data?.title || "Proposta T\xE9cnica"}
- Valor Total: R$ ${data?.totalValue ? Number(data.totalValue).toLocaleString("pt-BR") : "0,00"}
- Condi\xE7\xF5es: ${data?.paymentTerms || "A combinar"}

Acesse o Portal do Cliente para visualizar os itens do escopo e assinar digitalmente o contrato.

Atenciosamente,
Equipe NCodes Technologies
==================================================
`;
    } else {
      return res.status(400).json({ error: "Tipo de notifica\xE7\xE3o inv\xE1lido." });
    }
    const dispatchResult = await dispatchRealEmail({
      to: targetEmail,
      subject,
      bodyText,
      emailConfig
    });
    return res.json({
      success: true,
      message: dispatchResult.delivered ? "E-mail entregue com sucesso." : "E-mail processado no sistema.",
      dispatchResult,
      recipient: targetEmail,
      subject,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Erro ao enviar notifica\xE7\xE3o por e-mail";
    console.error("Erro no envio de e-mail:", errMessage);
    return res.status(200).json({ success: false, error: errMessage });
  }
});
app.post("/api/ai-analyze-quote", async (req, res) => {
  try {
    const { projectType, description, deadline, budgetRange } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Descri\xE7\xE3o do projeto \xE9 obrigat\xF3ria." });
    }
    const prompt = `Voc\xEA \xE9 o Arquiteto de Software Chefe da empresa NCodes Technologies.
Analise a seguinte solicita\xE7\xE3o de or\xE7amento de um cliente e forne\xE7a uma estimativa t\xE9cnica detalhada em formato JSON estrito:

Tipo de Projeto: ${projectType || "N\xE3o especificado"}
Descri\xE7\xE3o: ${description}
Prazo Desejado: ${deadline || "A combinar"}
Faixa de Investimento Estimada pelo Cliente: ${budgetRange || "A combinar"}

Forne\xE7a um objeto JSON v\xE1lido com a seguinte estrutura exatamente:
{
  "recommendedTech": ["tecnologia1", "tecnologia2", "tecnologia3", "tecnologia4"],
  "estimatedHours": 120,
  "suggestedBudget": 18500,
  "complexity": "Baixa" | "M\xE9dia" | "Alta",
  "summary": "Breve an\xE1lise do projeto, destacando pontos cr\xEDticos, valor agregado e recomenda\xE7\xE3o t\xE9cnica."
}`;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const jsonText = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch {
      parsedResult = {
        recommendedTech: ["React", "Flutter", "Firebase", "Node.js"],
        estimatedHours: 120,
        suggestedBudget: 15e3,
        complexity: "M\xE9dia",
        summary: "Projeto analisado com sucesso pela NCodes Technologies."
      };
    }
    return res.json({ success: true, analysis: parsedResult });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Erro ao processar an\xE1lise por IA";
    console.error("Erro na rota /api/ai-analyze-quote:", errMessage);
    return res.json({
      success: true,
      fallback: true,
      analysis: {
        recommendedTech: ["Flutter", "React", "Firebase", "TypeScript", "Node.js"],
        estimatedHours: 140,
        suggestedBudget: 18e3,
        complexity: "M\xE9dia",
        summary: "Projeto analisado pela equipe de engenharia da NCodes Technologies. Escopo compat\xEDvel com tecnologia m\xF3vel e web em tempo real."
      }
    });
  }
});
async function startServer() {
  const publicPath = import_path.default.join(process.cwd(), "public");
  app.use(import_express.default.static(publicPath));
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NCodes Technologies server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
