import { createEvent } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewEventPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/events" className="text-zinc-500 hover:text-orange-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-zinc-800">Novo Evento</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <form action={createEvent} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Nome do Evento</label>
            <input 
              name="name" 
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              placeholder="Ex: Baile do Havaí 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Descrição</label>
            <textarea 
              name="description" 
              rows={3}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Descrição do evento..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Início</label>
              <input 
                name="start_date" 
                type="datetime-local"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Fim</label>
              <input 
                name="end_date" 
                type="datetime-local"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Localização</label>
            <input 
              name="location" 
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ex: Clube de Campo"
            />
          </div>

          <hr className="my-6 border-zinc-200" />
          <h2 className="text-lg font-semibold text-zinc-800">Aparência do Checkout</h2>
          <p className="text-sm text-zinc-500 mb-4">Escolha a cor predominante para a tela de pagamento (Checkout).</p>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Cor Principal</label>
            <div className="flex items-center gap-2">
              <input 
                name="checkout_primary_color" 
                type="color"
                defaultValue="#F97316"
                className="w-10 h-10 rounded-md border-0 p-0 cursor-pointer"
              />
              <span className="text-sm text-zinc-500">Selecione uma cor</span>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors w-full sm:w-auto"
            >
              Criar Evento e Configurar Lotes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
