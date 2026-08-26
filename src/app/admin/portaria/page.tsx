/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Search, CheckCircle, XCircle, QrCode, Banknote, CreditCard, Ticket, Users } from 'lucide-react'
import dynamic from 'next/dynamic'

const QrScanner = dynamic(() => import('@/components/QrScanner'), { ssr: false })

export default function PortariaPage() {
  const supabase = createClient()
  const [aba, setAba] = useState<'validar' | 'vender' | 'lista'>('validar')
  const [qrScannerOpen, setQrScannerOpen] = useState(false)
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<any[]>([])
  
  // Vender
  const [lotes, setLotes] = useState<any[]>([])
  const [qtds, setQtds] = useState<Record<string, number>>({})

  // Lista
  const [todosIngressos, setTodosIngressos] = useState<any[]>([])

  useEffect(() => {
    // Carregar lotes e ingressos do supabase dependendo da aba
    if (aba === 'vender') {
      supabase.from('ticket_types').select('*').then(({ data }) => setLotes(data || []))
    }
    if (aba === 'lista') {
      supabase.from('tickets').select('*').then(({ data }) => setTodosIngressos(data || []))
    }
  }, [aba, supabase])

  const buscarIngresso = async () => {
    if (!busca) return
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .or(`owner_cpf.ilike.%${busca}%,owner_name.ilike.%${busca}%`)
    
    setResultados(data || [])
  }

  const validarIngresso = async (id: string) => {
    await supabase.from('tickets').update({ status: 'used' }).eq('id', id)
    setResultados(resultados.map(r => r.id === id ? { ...r, status: 'used' } : r))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-zinc-50">
      <div className="flex bg-[#0b1525] p-2 gap-2 text-white overflow-x-auto shrink-0">
        <button onClick={() => setAba('validar')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${aba === 'validar' ? 'bg-[#ff6a00] text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <QrCode size={20} /> Validar
        </button>
        <button onClick={() => setAba('vender')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${aba === 'vender' ? 'bg-[#ff6a00] text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Banknote size={20} /> Vender (PDV)
        </button>
        <button onClick={() => setAba('lista')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${aba === 'lista' ? 'bg-[#ff6a00] text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Users size={20} /> Lista
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {aba === 'validar' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <QrCode size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Leitura de QR Code</h2>
              <button onClick={() => setQrScannerOpen(true)} className="w-full bg-[#ff6a00] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                <QrCode size={24} /> Abrir Câmera
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Search className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por Nome ou CPF..."
                className="flex-1 outline-none font-medium"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarIngresso()}
              />
              <button onClick={buscarIngresso} className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-600">Buscar</button>
            </div>

            <div className="space-y-4">
              {resultados.map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{r.owner_name}</h3>
                    <p className="text-sm text-gray-500">CPF: {r.owner_cpf}</p>
                    <p className={`text-xs font-bold mt-1 ${r.status === 'used' ? 'text-red-500' : 'text-green-500'}`}>
                      {r.status === 'used' ? 'JÁ UTILIZADO' : 'VÁLIDO'}
                    </p>
                  </div>
                  {r.status !== 'used' && (
                    <button onClick={() => validarIngresso(r.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold">
                      Check-in
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {aba === 'vender' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Lotes Disponíveis</h2>
              {lotes.map(l => (
                <div key={l.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{l.name}</h3>
                    <p className="text-gray-500">R$ {l.price}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setQtds({...qtds, [l.id]: Math.max(0, (qtds[l.id] || 0) - 1)})} className="w-8 h-8 flex items-center justify-center font-bold text-xl">-</button>
                    <span className="font-bold w-4 text-center">{qtds[l.id] || 0}</span>
                    <button onClick={() => setQtds({...qtds, [l.id]: (qtds[l.id] || 0) + 1})} className="w-8 h-8 flex items-center justify-center font-bold text-xl">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-[#0b1525] p-6 rounded-2xl text-white sticky top-4 space-y-6">
                <h3 className="text-lg font-bold border-b border-white/10 pb-4">Resumo da Venda</h3>
                <div className="space-y-2">
                  {lotes.filter(l => qtds[l.id] > 0).map(l => (
                    <div key={l.id} className="flex justify-between text-sm">
                      <span>{qtds[l.id]}x {l.name}</span>
                      <span>R$ {(qtds[l.id] * l.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-3xl font-bold text-[#ff6a00]">
                    R$ {lotes.reduce((acc, l) => acc + (qtds[l.id] || 0) * l.price, 0).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="bg-gray-800 py-3 rounded-xl flex flex-col items-center gap-1 hover:bg-[#00c9a7] hover:text-black transition-colors"><QrCode size={20} /> PIX</button>
                  <button className="bg-gray-800 py-3 rounded-xl flex flex-col items-center gap-1 hover:bg-green-400 hover:text-black transition-colors"><Banknote size={20} /> Dinheiro</button>
                  <button className="bg-gray-800 py-3 rounded-xl flex flex-col items-center gap-1 hover:bg-blue-400 hover:text-black transition-colors"><CreditCard size={20} /> Crédito</button>
                  <button className="bg-gray-800 py-3 rounded-xl flex flex-col items-center gap-1 hover:bg-purple-400 hover:text-black transition-colors"><CreditCard size={20} /> Débito</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {aba === 'lista' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Todos os Ingressos</h2>
            {todosIngressos.map(i => (
              <div key={i.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{i.owner_name}</h3>
                  <p className="text-sm text-gray-500">Lote ID: {i.ticket_type_id} - CPF: {i.owner_cpf}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${i.status === 'used' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {i.status === 'used' ? 'CHECK-IN FEITO' : 'PENDENTE'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {qrScannerOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="p-4 flex justify-end">
            <button onClick={() => setQrScannerOpen(false)} className="bg-white/10 p-2 rounded-full text-white"><XCircle size={32} /></button>
          </div>
          <div className="flex-1 relative">
             <QrScanner onScan={(result) => { 
                setQrScannerOpen(false); 
                setBusca(result);
                buscarIngresso();
             }} />
          </div>
        </div>
      )}
    </div>
  )
}
