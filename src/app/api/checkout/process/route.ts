/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'



export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { formData, sessionId } = await request.json()

    if (!formData || !sessionId) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios' }, { status: 400 })
    }

    // Buscar a sessão (ingressos pendentes)
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*, ticket_types(price, name, event_id)')
      .eq('payment_session_id', sessionId)
      .eq('status', 'pending')

    if (ticketsError || !tickets || tickets.length === 0) {
      return NextResponse.json({ error: 'Sessão inválida ou já paga' }, { status: 400 })
    }

    const eventId = tickets[0].event_id

    // Buscar produtor para pegar o access token
    const { data: event } = await supabase
      .from('events')
      .select('*, producers(mp_access_token)')
      .eq('id', eventId)
      .single()

    const mpToken = event?.producers?.mp_access_token

    if (!mpToken) {
      return NextResponse.json({ error: 'Produtor não configurou Mercado Pago' }, { status: 400 })
    }

    // Configurar MP Client
    const mpClient = new MercadoPagoConfig({ accessToken: mpToken })
    const payment = new Payment(mpClient)

    const paymentData = {
      ...formData,
      description: `Ingressos Sphera - ${event.name}`,
      metadata: {
        session_id: sessionId,
        event_id: eventId
      },
      notification_url: 'https://sphera.naryen.com/api/webhooks/mercadopago'
    }

    const mpResponse = await payment.create({ body: paymentData })

    // Se o pagamento for aprovado instantaneamente (Cartão/Pix recebido na hora) ou pendente (Pix aguardando)
    if (mpResponse.status === 'approved') {
      // Atualizar tickets para paid
      await supabase
        .from('tickets')
        .update({ status: 'paid' })
        .eq('payment_session_id', sessionId)
    }

    return NextResponse.json({
      status: 'success',
      pagamentoId: mpResponse.id,
      mpStatus: mpResponse.status
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro MP:', error)
    return NextResponse.json({ error: error.message || 'Erro ao processar pagamento' }, { status: 500 })
  }
}
