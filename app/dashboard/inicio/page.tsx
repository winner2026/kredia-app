"use client";

import { useMemo, useState } from "react";

export default function DashboardInicio() {
  const [form, setForm] = useState({
    tarjeta: "",
    limite: "",
    fechaCorte: "",
    fechaCierre: "",
    nombreCompra: "",
    montoCuota: "",
    cantidadCuotas: "",
  });

  const monto = parseFloat(form.montoCuota) || 0;
  const cuotas = parseInt(form.cantidadCuotas || "0", 10) || 0;
  const limite = parseFloat(form.limite) || 0;

  const totalCompra = useMemo(() => (cuotas > 0 ? monto * cuotas : 0), [monto, cuotas]);
  const uso = useMemo(() => (limite > 0 ? Math.min((totalCompra / limite) * 100, 999) : 0), [limite, totalCompra]);
  const dentroLimite = limite === 0 ? true : totalCompra <= limite;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("DATA SUBMIT:", form, { totalCompra });
    // aquí luego conectas con tu API real
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-50">Ingreso de Compras</h1>
        <p className="text-slate-300 text-sm">Carga una compra y ve el impacto inmediato sobre tu límite.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1 text-slate-200">Nombre de la Tarjeta</label>
          <input
            type="text"
            name="tarjeta"
            value={form.tarjeta}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Límite de Crédito</label>
          <input
            type="number"
            name="limite"
            value={form.limite}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Fecha de Corte</label>
          <input
            type="date"
            name="fechaCorte"
            value={form.fechaCorte}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Fecha de Cierre</label>
          <input
            type="date"
            name="fechaCierre"
            value={form.fechaCierre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Nombre de la Compra</label>
          <input
            type="text"
            name="nombreCompra"
            value={form.nombreCompra}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Monto de la Cuota</label>
          <input
            type="number"
            name="montoCuota"
            value={form.montoCuota}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Cantidad de Cuotas</label>
          <input
            type="number"
            name="cantidadCuotas"
            value={form.cantidadCuotas}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-50"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Guardar Compra
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-3 text-slate-200">
        <h2 className="text-lg font-semibold text-slate-50">Resumen</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <p><span className="font-semibold">Tarjeta:</span> {form.tarjeta || "—"}</p>
          <p><span className="font-semibold">Límite:</span> {form.limite || "—"}</p>
          <p><span className="font-semibold">Compra:</span> {form.nombreCompra || "—"}</p>
          <p><span className="font-semibold">Monto por cuota:</span> {form.montoCuota || "—"}</p>
          <p><span className="font-semibold">Cantidad de cuotas:</span> {form.cantidadCuotas || "—"}</p>
          <p><span className="font-semibold">Total estimado:</span> ${totalCompra.toFixed(2)}</p>
        </div>

        <div className={`rounded-md px-3 py-2 text-sm ${dentroLimite ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
          {dentroLimite ? "Dentro del límite" : "Supera el límite"}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Uso del límite</span>
            <span>{uso.toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${dentroLimite ? "bg-emerald-400" : "bg-rose-500"}`}
              style={{ width: `${Math.min(uso, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
