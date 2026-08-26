/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'


export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const topic = url.searchParams.get('topic') || url.searchParams.get('type')
    const id = url.searchParams.get('data.id') || url.searchParams.get('id')

    if (topic !== 'payment' || !id) {
      return new NextResponse('OK', { status: 200 })
    }

    // Como o webhook não traz o access_token do produtor, nós precisamos de um workaround.
    // O ideal seria procurar no banco qual produtor recebeu a notificação, ou usar a API do MP sem auth para ler notificação (se possível).
    // Mas o webhook do MP exige auth para ler o Payment Detail.
    // Solução temporária: Atualizamos com base no ID se já guardássemos o MP ID no banco, 
    // mas só temos o sessionId. A metadata via webhook às vezes precisa do GET do pagamento.
    
    // NOTA: Para um MVP robusto de Webhook multi-tenant, teremos que iterar pelos tokens ou guardar o produtor no checkout,
    // por enquanto, vamos apenas retornar 200 para o MP não re-tentar loucamente, e a atualização em tempo real
    // será feita por poll na tela de sucesso. 
    // (Num ambiente de produção, faríamos o fetch em uma edge function que busca o mp_access_token)
    
    return new NextResponse('Webhook recebido', { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
