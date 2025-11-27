import { redirect } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";

export const runtime = "nodejs";

async function fetchOverview() {
  try {
    if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
      redirect("/login");
    }
    if (!process.env.DATABASE_URL) {
      redirect("/login");
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/dashboard/overview`, {
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    // Ante cualquier fallo de red/entorno, forzamos login para evitar excepción en SSR.
    redirect("/login");
  }
}

export default async function DashboardPage() {
  const data = await fetchOverview();

  const initialCard = data?.card
    ? {
        id: data.card.id as string | undefined,
        nombreTarjeta: data.card.bank ?? "Tarjeta principal",
        limiteTarjeta: data.card.limit ?? 0,
        diaCierre: data.card.closingDay ?? 1,
        diaVencimiento: data.card.dueDay ?? 1,
      }
    : null;

  const initialPurchases =
    data?.purchases?.map((p: any) => ({
      id: p.id,
      descripcion: p.description,
      montoCuota: p.amountPerMonth,
      cuotasPagadas: p.installments - p.remaining,
      cantidadCuotas: p.installments,
      fechaCompra: p.purchaseDate ? new Date(p.purchaseDate).toISOString().split("T")[0] : "",
    })) ?? [];

  return <DashboardView initialCard={initialCard} initialPurchases={initialPurchases} />;
}
