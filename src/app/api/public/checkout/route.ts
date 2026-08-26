import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Precisamos do admin para criar os tickets provisórios e ignorar RLS
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, buyer, tickets } = body

    if (!event_id || !buyer || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    const sessionId = crypto.randomUUID()
    let totalPrice = 0

    // Criar ingressos em status "pending" associados ao sessionId
    for (const t of tickets) {
      // Validar preço no banco (Segurança)
      const { data: ticketType } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('id', t.ticket_type_id)
        .eq('event_id', event_id)
        .single()

      if (!ticketType) {
        return NextResponse.json({ error: `Lote ${t.ticket_type_id} inválido` }, { status: 400 })
      }

      if (ticketType.available_quantity < t.quantity) {
        return NextResponse.json({ error: `Quantidade indisponível para o lote ${ticketType.name}` }, { status: 400 })
      }

      totalPrice += Number(ticketType.price) * t.quantity

      // Inserir os donos dos ingressos
      for (const owner of t.owners) {
        const { error: insertError } = await supabase.from('tickets').insert({
          ticket_type_id: ticketType.id,
          event_id: event_id,
          owner_name: owner.name,
          owner_cpf: owner.cpf,
          buyer_email: buyer.email,
          status: 'pending',
          payment_session_id: sessionId
        })

        if (insertError) {
          console.error(insertError)
          return NextResponse.json({ error: 'Erro ao reservar ingressos' }, { status: 500 })
        }
      }
    }

    // A URL de checkout para a qual a Landing Page deve redirecionar
    const checkoutUrl = `https://sphera.naryen.com/checkout/${sessionId}`

    return NextResponse.json(
      {
        status: 'success',
        session_id: sessionId,
        checkoutUrl,
        amount_to_pay: totalPrice
      },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
