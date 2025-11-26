"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const navItems = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Finanzas", href: "/dashboard/finanzas" },
  { label: "Progreso", href: "/dashboard/progreso" },
  { label: "Configuración", href: "/dashboard/configuracion" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Image src="/Kredia Logo oficial.svg" alt="Logo KredIA" width={32} height={32} />
          <h2 className="text-2xl font-bold">
            <span className="text-[#F8B738]">K</span>
            <span className="text-[#27C1D0]">red</span>
            <span className="text-[#E13787]">IA</span>
          </h2>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, href }) => {
            const isRoot = href === "/dashboard";
            const isActive = isRoot ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full text-left rounded-lg px-3 py-2 border transition ${
                  isActive
                    ? "border-blue-500/60 bg-blue-500/20 text-blue-100 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

