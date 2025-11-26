import { redirect } from "next/navigation";
import { assessRisk } from "@/lib/domain/risk";

async function loadOverview() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/dashboard/overview`, {
    cache: "no-store",
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) return null;
  return res.json();
}

export default async function ProgresoPage() {
  const data = await loadOverview();
  const freedomDate = data?.freedomDate ? new Date(data.freedomDate).toLocaleDateString("es-ES") : null;
  const utilization = data?.utilization ?? 0;
  const risk = assessRisk(utilization);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Progreso</h1>
      <p className="mt-2 text-gray-300">
        Aquí verás tu evolución, puntaje KredIA
        <span className="text-fuchsia-500">ia</span> y tus logros.
      </p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-2">
        <p>
          <span className="font-semibold">Utilización actual:</span> {utilization}%
        </p>
        <p>
          <span className="font-semibold">Riesgo estimado:</span> {risk}
        </p>
        <p>
          <span className="font-semibold">Fecha estimada de libertad:</span> {freedomDate ?? "—"}
        </p>
      </div>
    </div>
  );
}
