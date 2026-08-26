'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const location = formData.get('location') as string
  const checkout_primary_color = formData.get('checkout_primary_color') as string || '#F97316'

  const { data, error } = await supabase
    .from('events')
    .insert({
      producer_id: user.id,
      name,
      description,
      start_date,
      end_date,
      location,
      checkout_primary_color,
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('Erro ao criar evento')
  }

  revalidatePath('/admin/events')
  redirect(`/admin/events/${data.id}`)
}
