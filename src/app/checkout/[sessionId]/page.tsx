import { createClient } from '@/utils/supabase/server'
import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage({ params }: { params: { sessionId: string } }) {
  const supabase = createClient()
  
  // Buscar os ingressos pendentes desta sessão
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*, ticket_types(price, name)')
    .eq('payment_session_id', params.sessionId)
    .eq('status', 'pending')

  if (ticketsError || !tickets || tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">Sessão Inválida</h1>
          <p className="text-zinc-600">Esta sessão de pagamento expirou ou já foi paga.</p>
        </div>
      </div>
    )
  }

  const eventId = tickets[0].event_id
  const buyerEmail = tickets[0].buyer_email

  // Buscar evento e chaves da produtora
  const { data: event } = await supabase
    .from('events')
    .select('*, producers(mp_public_key)')
    .eq('id', eventId)
    .single()

  if (!event || !event.producers?.mp_public_key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">Configuração Incompleta</h1>
          <p className="text-zinc-600">O produtor não configurou o sistema de pagamentos corretamente.</p>
        </div>
      </div>
    )
  }

  const totalAmount = tickets.reduce((acc, t) => acc + Number(t.ticket_types?.price || 0), 0)

  return (
    <div style={{ backgroundColor: event.checkout_primary_color + '10' }} className="min-h-screen py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ color: event.checkout_primary_color }} className="text-3xl font-black">{event.name}</h1>
          <p className="text-zinc-600 mt-2">Finalize o pagamento dos seus ingressos.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50">
            <h2 className="font-semibold text-zinc-800 mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 mb-4">
              {tickets.map(t => (
                <div key={t.id} className="flex justify-between text-sm text-zinc-600">
                  <span>{t.ticket_types?.name} - {t.owner_name}</span>
                  <span className="font-medium">R$ {Number(t.ticket_types?.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
              <span className="text-zinc-600 font-medium">Total a pagar:</span>
              <span style={{ color: event.checkout_primary_color }} className="text-2xl font-bold">R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-6">
            <CheckoutClient 
              sessionId={params.sessionId} 
              mpPublicKey={event.producers.mp_public_key}
              totalAmount={totalAmount}
              buyerEmail={buyerEmail}
              primaryColor={event.checkout_primary_color}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
