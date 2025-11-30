export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
        <p className="text-slate-300">Elige una sección para comenzar.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href="/dashboard/finanzas"
          className="rounded-lg bg-[#1567A6] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#115782]"
        >
          Finanzas
        </a>
        <a
          href="/dashboard/progreso"
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          Progreso
        </a>
        <a
          href="/dashboard/configuracion"
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          Configuración
        </a>
      </div>
    </div>
  );
}
