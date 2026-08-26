import { createClient } from "@/utils/supabase/server";
import { saveProducerSettings } from "./actions";
import { Key, User, Info } from "lucide-react";
import { SubmitButton } from "@/components/ui";


export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: producer } = await supabase
    .from("producers")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-surface-900">Configurações</h1>
        <p className="text-surface-400 mt-0.5">Gerencie o perfil da sua produtora e integrações.</p>
      </div>

      <form action={saveProducerSettings} className="space-y-5">

        {/* Profile Section */}
        <div className="bg-white rounded-4xl border border-surface-100 shadow-soft-sm p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-2xl bg-primary-50 flex items-center justify-center">
              <User size={16} className="text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-surface-900">Perfil da Produtora</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">
                Nome da Produtora
              </label>
              <input
                name="name"
                defaultValue={producer?.name ?? ""}
                placeholder="Ex: Produções Ltda."
                className="w-full h-11 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">
                E-mail (conta)
              </label>
              <input
                disabled
                value={user?.email ?? ""}
                className="w-full h-11 px-4 bg-surface-100 border-2 border-surface-100 rounded-2xl text-sm font-medium text-surface-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Mercado Pago Section */}
        <div className="bg-white rounded-4xl border border-surface-100 shadow-soft-sm p-7">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Key size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-surface-900">Mercado Pago</h2>
          </div>
          <p className="text-sm text-surface-400 mb-6 pl-10">
            Suas credenciais são criptografadas e nunca expostas ao público.
          </p>

          {/* Info box */}
          <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-6">
            <Info size={16} className="text-primary-500 shrink-0 mt-0.5" />
            <div className="text-xs text-primary-700 leading-relaxed">
              <strong>Onde encontrar?</strong> Acesse sua conta Mercado Pago →{" "}
              <em>Seu Negócio</em> → <em>Configurações</em> → <em>Credenciais</em>.
              Use o ambiente de{" "}
              <strong>Produção</strong> para cobrar de verdade.
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">
                Access Token (Produção)
              </label>
              <input
                name="mp_access_token"
                type="password"
                defaultValue={producer?.mp_access_token ?? ""}
                placeholder="APP_USR-..."
                autoComplete="off"
                className="w-full h-11 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-400 uppercase tracking-wide">
                Public Key (Produção)
              </label>
              <input
                name="mp_public_key"
                defaultValue={producer?.mp_public_key ?? ""}
                placeholder="APP_USR-..."
                autoComplete="off"
                className="w-full h-11 px-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <SubmitButton size="lg" loadingText="Salvando...">
          Salvar Configurações
        </SubmitButton>
      </form>
    </div>
  );
}
