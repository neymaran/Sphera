import { createClient } from '@/utils/supabase/server'
import { saveProducerSettings } from './actions'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: producer } = await supabase
    .from('producers')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Configurações da Produtora</h1>

      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <form action={saveProducerSettings} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Nome da Produtora</label>
            <input 
              name="name" 
              defaultValue={producer?.name || ''} 
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <hr className="my-6 border-zinc-200" />
          <h2 className="text-lg font-semibold text-zinc-800">Integração Mercado Pago</h2>
          <p className="text-sm text-zinc-500 mb-4">Insira suas credenciais de produção do Mercado Pago para receber os pagamentos diretamente na sua conta (Taxa 0% Sphera).</p>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Public Key</label>
            <input 
              name="mp_public_key" 
              defaultValue={producer?.mp_public_key || ''} 
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="APP_USR-..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Access Token</label>
            <input 
              name="mp_access_token" 
              type="password"
              defaultValue={producer?.mp_access_token || ''} 
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="APP_USR-..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
