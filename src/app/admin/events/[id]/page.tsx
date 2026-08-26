import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Trash2, Users, Copy } from "lucide-react";
import { createTicketType, deleteTicketType } from "./actions";
import { StaggerContainer, StaggerItem } from "@/components/ui";

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", params.id)
    .order("price", { ascending: true });

  const { count: ticketsSold } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("event_id", params.id)
    .eq("status", "paid");

  if (!event) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-surface-400">Evento não encontrado.</p>
    </div>
  );

  const apiUrl = `https://sphera.naryen.com/api/public/events/${event.id}/tickets`;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/events"
          className="w-10 h-10 rounded-2xl bg-white border border-surface-200 shadow-soft-sm flex items-center justify-center text-surface-400 hover:text-primary-600 hover:border-primary-300 transition-all shrink-0"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-surface-900 truncate">{event.name}</h1>
          <p className="text-surface-400 text-sm">
            {new Date(event.start_date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stats + API Key row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Sold stat */}
        <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Users size={17} className="text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-surface-400">Vendidos</span>
          </div>
          <p className="text-3xl font-black text-surface-900">{ticketsSold ?? 0}</p>
        </div>

        {/* API URL — colspan 2 */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-5">
          <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
            Endpoint da API (Landing Page)
          </p>
          <div className="flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3 group">
            <code className="text-xs text-primary-600 font-mono flex-1 truncate">{apiUrl}</code>
            <button className="shrink-0 text-surface-300 hover:text-primary-500 transition-colors">
              <Copy size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Ticket Types list — 3/5 */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold text-surface-900">Lotes Configurados</h2>

          {!ticketTypes || ticketTypes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-surface-200 p-10 text-center">
              <p className="text-surface-400 text-sm">Nenhum lote criado. Adicione o primeiro lote ao lado →</p>
            </div>
          ) : (
            <StaggerContainer className="space-y-3">
              {ticketTypes.map((tt, i) => (
                <StaggerItem key={tt.id}>
                  <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center font-black text-primary-600 text-sm shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="font-bold text-surface-900">{tt.name}</h3>
                        <p className="text-sm text-surface-400">
                          <span className="font-semibold text-primary-600">
                            R$ {Number(tt.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          {" "}· {tt.available_quantity} disponíveis
                        </p>
                      </div>
                    </div>
                    <form action={deleteTicketType}>
                      <input type="hidden" name="id" value={tt.id} />
                      <input type="hidden" name="event_id" value={event.id} />
                      <button className="w-9 h-9 rounded-xl text-surface-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all">
                        <Trash2 size={17} />
                      </button>
                    </form>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        {/* Add Ticket Type form — 2/5 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-surface-100 shadow-soft-sm p-6 sticky top-6">
            <h2 className="text-base font-bold text-surface-900 mb-4">Adicionar Lote</h2>
            <form action={createTicketType} className="space-y-4">
              <input type="hidden" name="event_id" value={event.id} />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">Nome do Lote</label>
                <input
                  name="name"
                  required
                  placeholder="Ex: Pista · 1º Lote"
                  className="w-full h-10 px-3.5 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">Preço (R$)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="50,00"
                    className="w-full h-10 px-3.5 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">Qtd.</label>
                  <input
                    name="available_quantity"
                    type="number"
                    required
                    placeholder="100"
                    className="w-full h-10 px-3.5 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">Descrição</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Descrição opcional..."
                  className="w-full px-3.5 py-2.5 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-primary-700 to-primary-500 text-white font-bold rounded-2xl shadow-soft hover:shadow-glow transition-all hover:-translate-y-px active:scale-[0.98] text-sm"
              >
                Salvar Lote
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
