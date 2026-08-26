import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Ticket, Settings } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <h1 className="text-xl font-bold text-orange-500">Sphera</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-zinc-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2 text-zinc-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors">
            <Ticket size={20} />
            <span>Meus Eventos</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-zinc-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors">
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <form action={handleSignOut}>
            <button className="flex w-full items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
