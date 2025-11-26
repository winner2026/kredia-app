"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { PurchasePreviewCard } from "@/components/PurchasePreviewCard";
import type { PreviewData } from "@/types/purchase-preview";

const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "914fc58b-b310-4445-8f0a-a8ab5aace8c2";

type Props = {
  params: { id: string };
};

function formatMoney(value?: number) {
  if (!Number.isFinite(value ?? 0)) return "$0";
  return `$${Math.round(value ?? 0).toLocaleString("es-AR")}`;
}

export default function NewPurchasePage({ params }: Props) {
  const router = useRouter();
  const cardId = params.id;

  const [form, setForm] = useState({
    description: "",
    amountTotal: "",
    installments: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountNum = Number(form.amountTotal);
  const installmentsNum = Number(form.installments);

  useEffect(() => {
    if (!amountNum || !installmentsNum || amountNum <= 0 || installmentsNum <= 0) {
      setPreview(null);
      return;
    }

    const controller = new AbortController();
    const simulate = async () => {
      try {
        setLoadingPreview(true);
        const res = await fetch("/api/cards/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: DEFAULT_USER_ID,
            cardId,
            amount: amountNum,
            installments: installmentsNum,
            purchaseDate: form.purchaseDate,
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("No pudimos simular la compra");
        const json = (await res.json()) as PreviewData;
        setPreview(json);
        setError(null);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setPreview(null);
        setError("No pudimos simular la compra. Revisa los datos o intenta de nuevo.");
      } finally {
        setLoadingPreview(false);
      }
    };

    simulate();

    return () => controller.abort();
  }, [amountNum, installmentsNum, cardId, form.purchaseDate]);

  const canSubmit = useMemo(() => {
    return (
      form.description.trim().length > 0 &&
      amountNum > 0 &&
      installmentsNum > 0 &&
      Boolean(form.purchaseDate) &&
      preview !== null &&
      !saving
    );
  }, [form.description, form.purchaseDate, amountNum, installmentsNum, preview, saving]);

  async function handleSave() {
    if (!canSubmit) return;
    try {
      setSaving(true);
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEFAULT_USER_ID,
          cardId,
          description: form.description,
          amountTotal: amountNum,
          installments: installmentsNum,
          purchaseDate: form.purchaseDate,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Error guardando compra");

      setError(null);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Error guardando compra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-emerald-400/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-12">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-indigo-200/80">
              <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> · Nuevo registro
            </p>
            <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">Claridad financiera</h1>
            <p className="text-sm text-slate-300">Simula antes de guardar: riesgo, pago recomendado y fecha a $0.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:-translate-y-[2px]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-slate-900/40 to-indigo-500/10" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-indigo-200/80">Registrar compra</p>
                  <h2 className="text-2xl font-semibold text-slate-50">Modo seguro</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200">
                  <Sparkles className="h-4 w-4 text-indigo-200" aria-hidden />
                  Actualiza en tiempo real
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Descripción de la compra"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Monto total"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
              value={form.amountTotal}
              onChange={(e) => setForm((prev) => ({ ...prev, amountTotal: e.target.value }))}
            />
            <input
              type="number"
              min={1}
              placeholder="Cantidad de cuotas"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
              value={form.installments}
              onChange={(e) => setForm((prev) => ({ ...prev, installments: e.target.value }))}
            />
            <input
              type="date"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
              value={form.purchaseDate}
              onChange={(e) => setForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
            />
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <p className="text-xs text-slate-400">Resumen</p>
              <p className="text-base font-semibold text-slate-50">
                {form.amountTotal && form.installments
                  ? `${formatMoney(amountNum / Math.max(1, installmentsNum))} / mes`
                      : "Completa monto y cuotas"}
                  </p>
                </div>
              </div>

              {error && <p className="text-sm text-rose-300">{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-sm text-slate-300">
                  Simula primero. Solo guardamos tu compra cuando confirmas.
                </div>
                <button
                  onClick={handleSave}
                  disabled={!canSubmit}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_rgba(45,212,191,0.28)] transition-transform duration-150 ${
                    canSubmit
                      ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 hover:-translate-y-[2px] active:translate-y-[1px]"
                      : "bg-white/10 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {saving ? "Guardando..." : "Guardar compra"}
                </button>
              </div>
            </div>
          </div>

          <PurchasePreviewCard preview={preview} loading={loadingPreview} />
        </div>
      </div>
    </div>
  );
}

