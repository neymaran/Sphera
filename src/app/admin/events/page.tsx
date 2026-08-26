import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Calendar, MapPin } from 'lucide-react'

export default async function EventsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('producer_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-800">Meus Eventos</h1>
        <Link 
          href="/admin/events/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Criar Evento</span>
        </Link>
      </div>

      {(!events || events.length === 0) ? (
        <div className="bg-white p-12 text-center rounded-xl border border-zinc-200">
          <p className="text-zinc-500 mb-4">Você ainda não possui eventos cadastrados.</p>
          <Link 
            href="/admin/events/new"
            className="text-orange-500 font-medium hover:underline"
          >
            Criar meu primeiro evento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/admin/events/${event.id}`}>
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <h3 className="text-xl font-bold text-zinc-800 mb-2">{event.name}</h3>
                
                <div className="space-y-2 mt-auto pt-4 text-sm text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(event.start_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
