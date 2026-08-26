import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, ArrowRight, Ticket, Users } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui";

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: events }, { data: producer }] = await Promise.all([
    supabase.from("events").select("*").eq("producer_id", user!.id).order("created_at", { ascending: false }).limit(4),
    supabase.from("producers").select("name").eq("id", user!.id).single(),
  ]);

  const eventIds = events?.map((e) => e.id) ?? [];

  const { count: ticketsSold } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .in("event_id", eventIds)
    .eq("status", "paid");

  const producerName = producer?.name || user?.email?.split("@")[0] || "Produtora";

  const stats = [
    { label: "Eventos criados", value: events?.length ?? 0, icon: Ticket, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "Ingressos vendidos", value: ticketsSold ?? 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-surface-900">
            Olá, {producerName} 👋
          </h1>
          <p className="text-surface-400 mt-0.5">Aqui está um resumo da sua conta.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="hidden md:flex items-center gap-2 h-10 px-5 text-sm font-bold text-white bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl shadow-soft hover:shadow-glow hover:-translate-y-px transition-all"
        >
          <Plus size={17} />
          Novo Evento
        </Link>
      </div>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s, i) => (
          <StaggerItem key={i}>
            <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-semibold text-surface-400">{s.label}</p>
                <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon size={19} className={s.color} />
                </div>
              </div>
              <p className="text-4xl font-black text-surface-900">{s.value}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Events */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-surface-900">Eventos Recentes</h2>
        <Link href="/admin/events" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
          Ver todos <ArrowRight size={14} />
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Ticket size={28} className="text-primary-400" />
          </div>
          <h3 className="font-bold text-surface-700 mb-2">Nenhum evento ainda</h3>
          <p className="text-sm text-surface-400 mb-5">Crie seu primeiro evento e comece a vender ingressos.</p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 h-10 px-5 text-sm font-bold text-white bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl shadow-soft hover:shadow-glow transition-all"
          >
            <Plus size={16} /> Criar Evento
          </Link>
        </div>
      ) : (
        <StaggerContainer className="space-y-3">
          {events.map((event) => (
            <StaggerItem key={event.id}>
              <Link href={`/admin/events/${event.id}`}>
                <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5 transition-all p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shrink-0">
                      <Ticket size={19} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-surface-900">{event.name}</h3>
                      <p className="text-sm text-surface-400">
                        {new Date(event.start_date).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-surface-300 shrink-0" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
