import { createEvent } from "../actions";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, FileText, Palette, Type } from "lucide-react";

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/events"
          className="w-10 h-10 rounded-2xl bg-white border border-surface-200 shadow-soft-sm flex items-center justify-center text-surface-400 hover:text-primary-600 hover:border-primary-300 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-surface-900">Novo Evento</h1>
          <p className="text-surface-400 text-sm">Preencha as informações do seu evento.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-4xl border border-surface-100 shadow-soft-md p-8">
        <form action={createEvent} className="space-y-6">

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-surface-500">
              <Type size={15} />
              Nome do Evento
            </label>
            <input
              name="name"
              required
              placeholder="Ex: Festival de Verão 2025"
              className="w-full h-12 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-surface-500">
              <FileText size={15} />
              Descrição
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Descreva seu evento..."
              className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-surface-500">
                <Calendar size={15} />
                Início
              </label>
              <input
                name="start_date"
                type="datetime-local"
                required
                className="w-full h-12 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-surface-500">
                <Calendar size={15} />
                Fim
              </label>
              <input
                name="end_date"
                type="datetime-local"
                required
                className="w-full h-12 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          {/* Local */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-surface-500">
              <MapPin size={15} />
              Local
            </label>
            <input
              name="location"
              placeholder="Ex: Clube de Campo da Cidade"
              className="w-full h-12 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-surface-100 pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Palette size={16} className="text-surface-400" />
              <h3 className="text-sm font-bold text-surface-700">Aparência do Checkout</h3>
            </div>
            <p className="text-xs text-surface-400 mb-4">
              Cor predominante exibida na tela de pagamento dos seus ingressos.
            </p>
            <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl border border-surface-200">
              <input
                name="checkout_primary_color"
                type="color"
                defaultValue="#2563eb"
                className="w-12 h-12 rounded-xl border-2 border-surface-200 cursor-pointer p-0.5 bg-transparent"
              />
              <div>
                <p className="text-sm font-semibold text-surface-700">Cor do botão de compra</p>
                <p className="text-xs text-surface-400">Aparece no Checkout e no ticket digital.</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary-700 to-primary-500 text-white font-bold rounded-2xl shadow-soft hover:shadow-glow transition-all hover:-translate-y-px active:scale-[0.98] text-sm"
            >
              Criar Evento e Gerenciar Lotes →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
