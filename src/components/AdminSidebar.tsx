"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Ticket, Settings, LogOut,
  ScanQrCode, ChevronRight, Menu, X
} from "lucide-react";
import { useState } from "react";
import { PageTransition } from "@/components/ui";

const navItems = [
  { href: "/admin",          icon: LayoutDashboard, label: "Dashboard",       exact: true  },
  { href: "/admin/events",   icon: Ticket,          label: "Meus Eventos"                  },
  { href: "/admin/portaria", icon: ScanQrCode,      label: "Portaria & PDV"               },
  { href: "/admin/settings", icon: Settings,        label: "Configurações"                 },
];

function SidebarContent({
  pathname,
  onSignOut,
}: {
  pathname: string;
  onSignOut: () => void;
}) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-surface-100">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <img src="/naryen-logo.png" alt="Naryen Logo" className="w-7 h-7 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-black text-xl text-surface-900">Sphera</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all group ${
                  active
                    ? "text-primary-700"
                    : "text-surface-400 hover:text-surface-700 hover:bg-surface-50"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-50 rounded-2xl border border-primary-100"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon
                  size={19}
                  className={`relative z-10 shrink-0 transition-colors ${active ? "text-primary-600" : ""}`}
                />
                <span className="relative z-10">{item.label}</span>
                {active && (
                  <ChevronRight size={14} className="relative z-10 ml-auto text-primary-400" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-surface-100">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-semibold text-sm transition-all"
        >
          <LogOut size={19} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export function AdminSidebarClient({
  children,
  onSignOut,
}: {
  children: React.ReactNode;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPortaria = pathname === "/admin/portaria";

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-surface-100 flex-col shrink-0 shadow-soft-sm">
        <SidebarContent pathname={pathname} onSignOut={onSignOut} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mob-overlay"
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="mob-sidebar"
              className="fixed left-0 top-0 h-full z-50 w-72 bg-white shadow-soft-xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-surface-400 hover:bg-surface-100"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent pathname={pathname} onSignOut={onSignOut} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden h-14 bg-white border-b border-surface-100 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-surface-400 hover:bg-surface-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <img src="/naryen-logo.png" alt="Naryen Logo" className="w-6 h-6 object-contain" />
            <span className="font-black text-lg text-surface-900">Sphera</span>
          </div>
        </div>

        <main className={`flex-1 overflow-y-auto ${isPortaria ? "" : "p-6 md:p-8"}`}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
