export interface EmailConfig {
  resendApiKey?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
}

export async function sendEmailWithFallback({
  endpoint,
  recipientEmail,
  type,
  data,
  emailConfig,
  subject,
  bodyText
}: {
  endpoint: '/api/test-email' | '/api/send-email-notification';
  recipientEmail: string;
  type?: 'new_client' | 'new_quote' | 'quote_status_update' | 'proposal_issued' | string;
  data?: any;
  emailConfig?: EmailConfig;
  subject?: string;
  bodyText?: string;
}) {
  // 1. Attempt call to server API endpoint first
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail,
        type,
        data,
        emailConfig
      })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (json && (json.success !== undefined || json.result || json.error)) {
        return json;
      }
    }
  } catch (err: any) {
    console.warn('Endpoint API fetch error, trying direct fallback if configured:', err);
  }

  // 2. Direct Resend REST API Client Fallback (Works on Vercel / Static Hosting)
  const resendKey = (emailConfig?.resendApiKey || '').trim().replace(/^["'\s]+|["'\s]+$/g, '');

  if (resendKey) {
    let fromAddress = emailConfig?.smtpFrom?.trim() || 'NCodes Tech <onboarding@resend.dev>';
    let emailSubject = subject || '[NCodes Tech] Notificação do Sistema';
    let emailText = bodyText || `Notificação enviada para ${recipientEmail}`;

    if (!subject || !bodyText) {
      if (type === 'client_registration_confirmation') {
        emailSubject = `[NCodes Tech] 🎉 Confirmação de Cadastro - Portal do Cliente`;
        emailText = `Olá, ${data?.name || 'Cliente'}!\n\nSeja muito bem-vindo(a) à NCodes Technologies!\nSeu cadastro no Portal do Cliente foi concluído com sucesso.\n\nE-mail de Acesso: ${recipientEmail}\nEmpresa: ${data?.company || 'Pessoa Física'}\n\nAcesse o portal: https://ncodestechnologies.com.br`;
      } else if (type === 'quote_confirmation_client') {
        emailSubject = `[NCodes Tech] 📋 Solicitação de Orçamento Recebida - #${data?.quoteId || ''}`;
        emailText = `Olá, ${data?.clientName || 'Cliente'}!\n\nConfirmamos o recebimento da sua solicitação de orçamento #${data?.quoteId || ''}!\nProjeto: ${data?.projectTitle || 'Não informado'}\nCategoria: ${data?.category || 'Sistema Web'}\n\nNossa equipe técnica e Inteligência Artificial estão analisando seu projeto. Acompanhe em https://ncodestechnologies.com.br`;
      } else if (type === 'new_client') {
        emailSubject = `[NCodes Tech] 👤 Novo Cliente Cadastrado: ${data?.name || 'Cliente'}`;
        emailText = `Novo cliente cadastrado no sistema:\nNome: ${data?.name}\nE-mail: ${data?.email}\nEmpresa: ${data?.company}\nTelefone: ${data?.phone}`;
      } else if (type === 'new_quote') {
        emailSubject = `[NCodes Tech] 🚀 Nova Solicitação de Orçamento: ${data?.quoteId || ''}`;
        emailText = `Nova solicitação de orçamento recebida:\nID: ${data?.quoteId}\nCliente: ${data?.clientName}\nE-mail: ${data?.email}\nRequisitos: ${data?.description}`;
      } else if (type === 'quote_status_update') {
        emailSubject = `[NCodes Tech] 📋 Atualização no seu Orçamento ${data?.quoteId ? '#' + data?.quoteId : ''}`;
        emailText = `Prezado(a) ${data?.clientName || 'Cliente'},\n\nO status do seu orçamento foi atualizado para: ${data?.statusLabel || data?.newStatus}.\n\nMensagem da Equipe: "${data?.adminNotes || 'Seu projeto está em processamento.'}"`;
      }
    }

    try {
      let directRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipientEmail],
          subject: emailSubject,
          text: emailText
        })
      });

      let directData: any = await directRes.json().catch(() => ({}));

      // Retry with default onboarding@resend.dev if custom from domain is unverified
      if (!directRes.ok && fromAddress !== 'NCodes Tech <onboarding@resend.dev>') {
        const errTxt = (directData?.message || directData?.error?.message || '').toLowerCase();
        if (errTxt.includes('domain') || errTxt.includes('from') || errTxt.includes('verify') || directRes.status === 422) {
          directRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'NCodes Tech <onboarding@resend.dev>',
              to: [recipientEmail],
              subject: emailSubject,
              text: emailText
            })
          });
          directData = await directRes.json().catch(() => ({}));
        }
      }

      if (directRes.ok && (directData.id || directData.data?.id)) {
        return {
          success: true,
          result: { provider: 'resend', id: directData.id || directData.data?.id, delivered: true },
          recipient: recipientEmail
        };
      }

      const rawError = directData?.message || directData?.error?.message || JSON.stringify(directData);
      let friendlyError = `Erro no Resend: ${rawError}`;

      if (directRes.status === 401 || rawError.toLowerCase().includes('api key') || rawError.toLowerCase().includes('unauthorized')) {
        friendlyError = 'Chave API do Resend inválida. Verifique se copiou a chave completa (começando com "re_") em resend.com/api-keys.';
      } else if (rawError.toLowerCase().includes('only send to your own email address') || rawError.toLowerCase().includes('onboarding mode') || rawError.toLowerCase().includes('testing')) {
        friendlyError = `No plano gratuito de testes do Resend, você deve enviar e-mails para o mesmo endereço de e-mail cadastrado na sua conta do Resend.com. Altere o "1. Seu E-mail Principal" para o e-mail da sua conta no Resend ou valide seu próprio domínio em resend.com/domains.`;
      }

      return { success: false, error: friendlyError };
    } catch (err: any) {
      return { success: false, error: `Falha na conexão com o Resend: ${err.message || err}` };
    }
  }

  return {
    success: false,
    error: 'A rota backend não respondeu com JSON. Insira uma Chave API do Resend (grátis) em "Opção A: Resend API" e clique em "Salvar Configurações" para habilitar o envio automático!'
  };
}
