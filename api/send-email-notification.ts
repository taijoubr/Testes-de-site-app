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
    const { type, recipientEmail, data, emailConfig } = req.body || {};
    const targetEmail = recipientEmail || 'contato@ncodestechnologies.com.br';
    const resendKey = (emailConfig?.resendApiKey || process.env.RESEND_API_KEY || '').trim().replace(/^["'\s]+|["'\s]+$/g, '');

    let subject = '[NCodes Tech] Notificação do Sistema';
    let bodyText = `Notificação para ${targetEmail}`;

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

Acesse o Painel Web Admin para analisar e emitir a proposta.
==================================================
`;
    } else if (type === 'quote_status_update') {
      subject = `[NCodes Tech] 📋 Atualização no seu Orçamento #${data?.quoteId || ''}`;
      bodyText = `
==================================================
NCODES TECHNOLOGIES - ATUALIZAÇÃO DO SEU ORÇAMENTO
==================================================
Olá, ${data?.clientName || 'Cliente'}!

O status da sua solicitação de orçamento (${data?.quoteId || ''}) foi atualizado pela nossa equipe de engenharia.

- Novo Status: ${data?.statusLabel || data?.status}
- Observações da Equipe: "${data?.adminNotes || 'Seu projeto está em fase de análise técnica.'}"

Acesse o seu Portal do Cliente no nosso site para acompanhar todos os detalhes e propostas.
==================================================
`;
    }

    if (resendKey) {
      let fromAddress = emailConfig?.smtpFrom?.trim() || process.env.SMTP_FROM?.trim() || 'NCodes Tech <onboarding@resend.dev>';

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

      return res.status(200).json({ success: false, error: resendData?.message || 'Erro ao enviar no Resend' });
    }

    return res.status(200).json({ success: true, result: { provider: 'simulation' } });
  } catch (error: any) {
    return res.status(200).json({ success: false, error: error?.message || 'Erro no servidor' });
  }
}
