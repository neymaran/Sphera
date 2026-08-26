'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProducerSettings(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const mp_access_token = formData.get('mp_access_token') as string
  const mp_public_key = formData.get('mp_public_key') as string
  const name = formData.get('name') as string

  const { error } = await supabase
    .from('producers')
    .update({ 
      name,
      mp_access_token, 
      mp_public_key 
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'Erro ao salvar configurações.' }
  }

  revalidatePath('/admin/settings')
  return { success: true }
}
