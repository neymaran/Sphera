import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || '';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'info@naryen.com';

export const resend = new Resend(apiKey);

interface TicketEmailProps {
  to: string;
  eventName: string;
  buyerEmail: string;
  sessionId: string;
  tickets: Array<{
    owner_name: string;
    ticket_type_name?: string;
  }>;
}

export async function sendTicketEmail({
  to,
  eventName,
  buyerEmail,
  sessionId,
  tickets,
}: TicketEmailProps) {
  const ticketUrl = `https://sphera.naryen.com/ingresso/${sessionId}`;

  const ticketsHtml = tickets
    .map(
      (t) => `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${t.owner_name}</p>
        ${t.ticket_type_name ? `<p style="margin: 0; font-size: 13px; color: #2563eb; font-weight: 500;">${t.ticket_type_name}</p>` : ''}
      </div>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px; color: #0f172a; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(30, 58, 138, 0.06); }
          .header { text-align: center; margin-bottom: 32px; }
          .badge { display: inline-block; background-color: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 99px; text-transform: uppercase; tracking: 0.05em; margin-bottom: 16px; }
          h1 { margin: 0 0 8px 0; font-size: 26px; font-weight: 800; color: #0f172a; text-align: center; }
          p.subtitle { margin: 0 0 24px 0; font-size: 15px; color: #64748b; text-align: center; line-height: 1.5; }
          .button-container { text-align: center; margin: 32px 0; }
          .btn { display: inline-block; background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 16px; box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3); }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Sphera Tickets</span>
            <h1>Seus Ingressos Estão Prontos! 🎉</h1>
            <p class="subtitle">Seu pagamento para <strong>${eventName}</strong> foi confirmado com sucesso.</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Ingressos Confirmados:</h3>
            ${ticketsHtml}
          </div>

          <div class="button-container">
            <a href="${ticketUrl}" class="btn" target="_blank">Acessar Meus Ingressos & QR Codes</a>
          </div>

          <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 20px;">
            Você também pode acessar seus ingressos diretamente pelo link:<br>
            <a href="${ticketUrl}" style="color: #2563eb; text-decoration: underline;">${ticketUrl}</a>
          </p>

          <div class="footer">
            <p style="margin: 0 0 4px 0;">Sphera — Plataforma de Venda de Ingressos por Naryen Tecnologia</p>
            <p style="margin: 0;">Enviado para ${buyerEmail}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: `Sphera Ingressos <${fromEmail}>`,
      to: [to],
      subject: `Seus Ingressos: ${eventName} 🎉`,
      html: htmlContent,
    });

    console.log('E-mail enviado com sucesso via Resend:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar e-mail via Resend:', error);
    return { success: false, error };
  }
}
