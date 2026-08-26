/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { QRCodeSVG } from 'qrcode.react'
import { Ticket, Clock, CheckCircle2 } from 'lucide-react'

export default function IngressoPage({ params }: { params: { sessionId: string } }) {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTickets = async () => {
      const { data } = await supabase
        .from('tickets')
        .select('*, ticket_types(name), events(name, start_date)')
        .eq('payment_session_id', params.sessionId)
      
      if (data) {
        setTickets(data)
      }
      setLoading(false)
    }

    fetchTickets()

    // Poll a cada 5 segundos para caso o webhook não tenha sido rápido
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [params.sessionId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">Ingressos não encontrados</h1>
          <p className="text-zinc-600">Verifique o link acessado.</p>
        </div>
      </div>
    )
  }

  const allPaid = tickets.every(t => t.status === 'paid' || t.status === 'used')
  const event = tickets[0].events

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="text-center mb-10">
          {allPaid ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 size={48} className="text-green-500" />
              <h1 className="text-3xl font-black text-zinc-800">Pagamento Confirmado!</h1>
              <p className="text-zinc-600">Seus ingressos para {event.name} estão prontos.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Clock size={48} className="text-orange-500 animate-pulse" />
              <h1 className="text-3xl font-black text-zinc-800">Processando Pagamento...</h1>
              <p className="text-zinc-600">Aguarde a confirmação do pagamento (PIX ou Cartão).</p>
            </div>
          )}
        </div>

        {allPaid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map(t => (
              <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden relative">
                <div className="h-4 w-full bg-orange-500"></div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl text-zinc-800 mb-1">{event.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{new Date(event.start_date).toLocaleString('pt-BR')}</p>
                  
                  <div className="bg-zinc-50 p-4 rounded-xl inline-block mb-4 border border-zinc-100">
                    {t.status === 'used' ? (
                      <div className="w-[200px] h-[200px] flex items-center justify-center text-red-500 font-bold border-4 border-red-500 rotate-[-10deg]">
                        JÁ UTILIZADO
                      </div>
                    ) : (
                      <QRCodeSVG value={t.id} size={200} />
                    )}
                  </div>
                  
                  <div className="bg-zinc-100 rounded-lg p-3 text-left">
                    <p className="text-xs text-zinc-500 font-medium">TITULAR</p>
                    <p className="font-bold text-zinc-800">{t.owner_name}</p>
                    <p className="text-xs text-zinc-500 mt-2 font-medium">LOTE</p>
                    <p className="font-bold text-zinc-800">{t.ticket_types.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
