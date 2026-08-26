import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendTicketEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId é obrigatório' }, { status: 400 })
    }

    // Buscar os ingressos pagos da sessão
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, ticket_types(name), events(name)')
      .eq('payment_session_id', sessionId)
      .eq('status', 'paid')

    if (error || !tickets || tickets.length === 0) {
      return NextResponse.json({ error: 'Nenhum ingresso pago encontrado para esta sessão' }, { status: 404 })
    }

    const buyerEmail = tickets[0].buyer_email
    const eventName = tickets[0].events?.name || 'Evento'

    if (!buyerEmail) {
      return NextResponse.json({ error: 'E-mail do comprador não encontrado' }, { status: 400 })
    }

    const emailResult = await sendTicketEmail({
      to: buyerEmail,
      eventName,
      buyerEmail,
      sessionId,
      tickets: tickets.map((t: any) => ({
        owner_name: t.owner_name,
        ticket_type_name: t.ticket_types?.name,
      })),
    })

    return NextResponse.json({ status: 'success', emailResult })
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error)
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}
