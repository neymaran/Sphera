import Link from "next/link";

import { ArrowRight, Zap, Shield, BarChart2, Users } from "lucide-react";

export const metadata = {
  title: "Sphera — Plataforma de Ingressos",
  description: "A plataforma SaaS de venda de ingressos da Naryen Tecnologia",
};

const features = [
  {
    icon: <Zap size={24} />,
    title: "Venda em segundos",
    description: "Integração via API com qualquer landing page. Seu ingresso em 3 cliques.",
  },
  {
    icon: <Shield size={24} />,
    title: "Segurança total",
    description: "QR Code único por ingresso. Validação em tempo real na portaria.",
  },
  {
    icon: <BarChart2 size={24} />,
    title: "Relatórios ao vivo",
    description: "Acompanhe vendas, check-ins e receita em tempo real no painel.",
  },
  {
    icon: <Users size={24} />,
    title: "Portaria & PDV",
    description: "Valide ingressos e venda na portaria com um dispositivo qualquer.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-surface-50 flex flex-col">
      {/* ─── Navbar ─────────────────────────────────── */}
      <nav className="sticky top-0 z-30 glass border-b border-white/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-500 shadow-glow flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-white/90" />
            </div>
            <span className="font-black text-xl text-surface-900">Sphera</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-surface-500 hover:text-primary-600 transition-colors px-4 py-2 rounded-2xl hover:bg-primary-50"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-gradient-to-r from-primary-700 to-primary-500 px-5 py-2.5 rounded-2xl shadow-soft hover:shadow-glow transition-all hover:-translate-y-px"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
        {/* Background spheres decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-100/50 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-primary-200/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary-50/60 blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 text-sm font-semibold text-primary-700">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            by Naryen Tecnologia
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-surface-900 leading-[1.05] tracking-tight">
            Venda ingressos com{" "}
            <span className="text-gradient">elegância.</span>
          </h1>

          <p className="text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed">
            A plataforma SaaS que conecta produtoras de eventos a uma infraestrutura profissional de venda de ingressos. Checkout, portaria e PDV em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 font-bold text-white bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl shadow-soft-md hover:shadow-glow hover:-translate-y-1 transition-all text-base"
            >
              Começar gratuitamente
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 font-bold text-primary-700 bg-white border-2 border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 transition-all text-base"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-surface-900 mb-4">
              Tudo que você precisa, em um lugar só.
            </h2>
            <p className="text-surface-400 text-lg max-w-xl mx-auto">
              Do link de venda ao QR Code na porta, o Sphera cuida de toda a infraestrutura.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-surface-100 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">{f.title}</h3>
                <p className="text-surface-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="border-t border-surface-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
            </div>
            <span className="font-black text-sm text-surface-400">Sphera</span>
          </div>
          <p className="text-sm text-surface-400">
            © 2024 Naryen Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
