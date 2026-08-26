import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Trash2, Users, DollarSign } from 'lucide-react'
import { createTicketType, deleteTicketType } from './actions'

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: ticketTypes } = await supabase
    .from('ticket_types')
    .select('*')
    .eq('event_id', params.id)
    .order('created_at', { ascending: true })

  // Obter total de ingressos vendidos (tickets)
  const { count: ticketsSold } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', params.id)
    .eq('status', 'paid')

  if (!event) return <div className="p-8">Evento não encontrado.</div>

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="text-zinc-500 hover:text-orange-500 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-800">{event.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm md:col-span-2">
          <h3 className="text-sm font-medium text-zinc-500 mb-1">Link de Integração (API)</h3>
          <code className="text-xs bg-zinc-100 p-2 rounded block break-all text-orange-600">
            GET https://sphera.naryen.com/api/public/events/{event.id}/tickets
          </code>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-500" size={20} />
            <h3 className="text-sm font-medium text-zinc-700">Ingressos Vendidos</h3>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{ticketsSold || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-800">Lotes Cadastrados</h2>
          </div>

          {ticketTypes?.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-zinc-200">
              <p className="text-zinc-500">Nenhum lote criado ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ticketTypes?.map((tt) => (
                <div key={tt.id} className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-800">{tt.name}</h3>
                    <p className="text-sm text-zinc-500">
                      R$ {tt.price.toFixed(2).replace('.', ',')} • {tt.available_quantity} disponíveis
                    </p>
                  </div>
                  <form action={deleteTicketType}>
                    <input type="hidden" name="id" value={tt.id} />
                    <input type="hidden" name="event_id" value={event.id} />
                    <button className="text-zinc-400 hover:text-red-500 transition-colors p-2">
                      <Trash2 size={20} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-zinc-800 mb-4">Adicionar Lote</h2>
            <form action={createTicketType} className="space-y-4">
              <input type="hidden" name="event_id" value={event.id} />
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nome</label>
                <input name="name" required placeholder="Ex: Pista - 1º Lote" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Preço (R$)</label>
                  <input name="price" type="number" step="0.01" required placeholder="50.00" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Quantidade</label>
                  <input name="available_quantity" type="number" required placeholder="100" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Descrição Opcional</label>
                <textarea name="description" rows={2} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md transition-colors">
                Salvar Lote
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
