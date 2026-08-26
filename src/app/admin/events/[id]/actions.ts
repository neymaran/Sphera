'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTicketType(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const event_id = formData.get('event_id') as string
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const available_quantity = parseInt(formData.get('available_quantity') as string, 10)
  const description = formData.get('description') as string

  // Verifica se o evento pertence ao usuário
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('id', event_id)
    .eq('producer_id', user.id)
    .single()

  if (eventError || !event) {
    throw new Error('Evento não encontrado ou acesso negado')
  }

  const { error } = await supabase
    .from('ticket_types')
    .insert({
      event_id,
      name,
      price,
      available_quantity,
      description
    })

  if (error) {
    console.error(error)
    throw new Error('Erro ao criar lote de ingressos')
  }

  revalidatePath(`/admin/events/${event_id}`)
}

export async function deleteTicketType(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const event_id = formData.get('event_id') as string
  
  const { error } = await supabase
    .from('ticket_types')
    .delete()
    .eq('id', id)
    
  if (error) {
    throw new Error('Não é possível excluir um lote que já possui ingressos vendidos')
  }
  
  revalidatePath(`/admin/events/${event_id}`)
}
