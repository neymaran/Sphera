import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar dados da produtora
  const { data: producer } = await supabase
    .from('producers')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-2">Bem-vindo(a), {producer?.name || 'Produtor'}</h1>
      <p className="text-zinc-600 mb-8">Gerencie seus eventos, ingressos e integrações.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-700">Vendas Hoje</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">R$ 0,00</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-700">Ingressos Vendidos</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-700">Eventos Ativos</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
