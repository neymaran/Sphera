import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Calendar, MapPin, ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui";

export default async function EventsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("producer_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-surface-900">Meus Eventos</h1>
          <p className="text-surface-400 mt-0.5">Gerencie seus eventos e lotes de ingressos.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 h-10 px-5 text-sm font-bold text-white bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl shadow-soft hover:shadow-glow hover:-translate-y-px transition-all"
        >
          <Plus size={17} />
          Novo Evento
        </Link>
      </div>

      {/* Empty state */}
      {(!events || events.length === 0) ? (
        <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-16 text-center">
          <div className="w-20 h-20 rounded-4xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
            <Calendar size={32} className="text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-surface-700 mb-2">Nenhum evento criado</h3>
          <p className="text-sm text-surface-400 mb-6 max-w-xs mx-auto">
            Crie seu primeiro evento, configure os lotes e comece a vender.
          </p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 h-11 px-6 text-sm font-bold text-white bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl shadow-soft hover:shadow-glow transition-all"
          >
            <Plus size={16} />
            Criar meu primeiro evento
          </Link>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event) => (
            <StaggerItem key={event.id}>
              <Link href={`/admin/events/${event.id}`}>
                <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-all duration-300 p-6 cursor-pointer h-full flex flex-col group">
                  {/* Color accent bar */}
                  <div
                    className="w-8 h-1.5 rounded-full mb-4 transition-all group-hover:w-12"
                    style={{ backgroundColor: event.checkout_primary_color || "#2563eb" }}
                  />

                  <h3 className="text-lg font-bold text-surface-900 mb-1 line-clamp-2">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-surface-400 line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                  )}

                  <div className="mt-auto pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-surface-400">
                      <Calendar size={14} />
                      <span>{new Date(event.start_date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-surface-400">
                        <MapPin size={14} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                    Ver detalhes
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
