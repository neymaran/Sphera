/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Usamos uma client instance anon para as rotas públicas (que lê apenas dados liberados via RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Busca o evento
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, name')
      .eq('id', id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
    }

    // Busca os lotes
    const { data: tickets, error: ticketsError } = await supabase
      .from('ticket_types')
      .select('id, name, price, description, available_quantity')
      .eq('event_id', id)
      .gt('available_quantity', 0)
      .order('price', { ascending: true })

    if (ticketsError) {
      return NextResponse.json({ error: 'Erro ao buscar lotes' }, { status: 500 })
    }

    return NextResponse.json(
      {
        event_id: event.id,
        name: event.name,
        tickets: tickets.map((t) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          available: true,
          description: t.description,
        })),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
