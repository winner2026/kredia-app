async function loadOverview() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/dashboard/overview`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function FinanzasPage() {
  const data = await loadOverview();
  const card = data?.card;
  const monthlyTotal = data?.monthlyTotal ?? 0;
  const utilization = data?.utilization ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Finanzas</h1>
      {card ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-2">
          <p>
            <span className="font-semibold">Banco / tarjeta:</span> {card.bank}
          </p>
          <p>
            <span className="font-semibold">Límite:</span> ${card.limit}
          </p>
          <p>
            <span className="font-semibold">Cierre / Vencimiento:</span> {card.closingDay} / {card.dueDay}
          </p>
          <p>
            <span className="font-semibold">Compromiso mensual estimado:</span> ${monthlyTotal}
          </p>
          <p>
            <span className="font-semibold">Utilización:</span> {utilization}%
          </p>
        </div>
      ) : (
        <p className="text-gray-300">Aún no tienes tarjeta registrada. Crea una desde el dashboard.</p>
      )}
    </div>
  );
}
