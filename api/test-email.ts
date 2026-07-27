export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipientEmail, emailConfig } = req.body || {};
    const targetEmail = recipientEmail || 'contato@ncodestechnologies.com.br';
    const resendKey = (emailConfig?.resendApiKey || process.env.RESEND_API_KEY || '').trim().replace(/^["'\s]+|["'\s]+$/g, '');

    if (resendKey) {
      let fromAddress = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || 'NCodes Tech <onboarding@resend.dev>';
      const subject = `[NCodes Tech] ⚡ Teste de Servidor Transacional de E-mail (${new Date().toLocaleTimeString('pt-BR')})`;
      const bodyText = `
==================================================
NCODES TECHNOLOGIES - TESTE DE CONEXÃO E ENVIO
==================================================
Status: Servidor de E-mail Ativo e Operacional
Data e Hora do Envio: ${new Date().toLocaleString('pt-BR')}
E-mail de Destino Configurado: ${targetEmail}

Este e-mail confirma que seu servidor de disparo transacional está 100% configurado para a NCodes Technologies.
==================================================
`;

      let response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [targetEmail],
          subject,
          text: bodyText
        })
      });

      let resendData: any = await response.json().catch(() => ({}));

      if (!response.ok && fromAddress !== 'NCodes Tech <onboarding@resend.dev>') {
        const errTxt = (resendData?.message || resendData?.error?.message || '').toLowerCase();
        if (errTxt.includes('domain') || errTxt.includes('from') || errTxt.includes('verify') || response.status === 422) {
          fromAddress = 'NCodes Tech <onboarding@resend.dev>';
          response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [targetEmail],
              subject,
              text: bodyText
            })
          });
          resendData = await response.json().catch(() => ({}));
        }
      }

      if (response.ok && (resendData.id || resendData.data?.id)) {
        return res.status(200).json({
          success: true,
          result: { provider: 'resend', id: resendData.id || resendData.data?.id, delivered: true },
          recipient: targetEmail
        });
      }

      const rawError = resendData?.message || resendData?.error?.message || JSON.stringify(resendData);
      let friendlyError = `Erro no Resend (${response.status}): ${rawError}`;

      if (response.status === 401 || rawError.toLowerCase().includes('api key') || rawError.toLowerCase().includes('unauthorized')) {
        friendlyError = 'Chave API do Resend inválida. Verifique se copiou a chave completa em resend.com/api-keys.';
      } else if (rawError.toLowerCase().includes('only send to your own email address') || rawError.toLowerCase().includes('onboarding mode')) {
        friendlyError = `No plano de testes do Resend, você só pode enviar e-mails para o mesmo endereço cadastrado no Resend.com. Altere o e-mail em "1. Seu E-mail Principal" ou valide seu domínio em resend.com/domains.`;
      }

      return res.status(200).json({ success: false, error: friendlyError });
    }

    return res.status(200).json({
      success: true,
      result: {
        provider: 'simulation',
        message: 'Chave API não fornecida. Insira a Chave API do Resend.'
      }
    });
  } catch (error: any) {
    return res.status(200).json({ success: false, error: error?.message || 'Erro no servidor' });
  }
}
