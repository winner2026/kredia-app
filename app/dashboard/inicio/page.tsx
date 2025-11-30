"use client";

import { useState } from "react";

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
  const [compras, setCompras] = useState<
    Array<{
      tarjeta: string;
      limite: string;
      fechaCorte: string;
      fechaCierre: string;
      nombreCompra: string;
      montoCuota: string;
      cantidadCuotas: string;
      total: number;
    }>
  >([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const monto = parseFloat(form.montoCuota) || 0;
    const cuotas = parseInt(form.cantidadCuotas || "0", 10) || 0;
    const total = monto * cuotas || 0;

    const compra = { ...form, total };
    setCompras((prev) => [...prev, compra]);
    setForm({
      tarjeta: "",
      limite: "",
      fechaCorte: "",
      fechaCierre: "",
      nombreCompra: "",
      montoCuota: "",
      cantidadCuotas: "",
    });
    console.log("DATA SUBMIT:", compra);
  }

  const monto = parseFloat(form.montoCuota) || 0;
  const cuotas = parseInt(form.cantidadCuotas || "0", 10) || 0;
  const totalCompra = monto * cuotas || 0;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Ingreso de Compras</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre de la Tarjeta</label>
          <input
            type="text"
            name="tarjeta"
            value={form.tarjeta}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Límite de Crédito</label>
          <input
            type="number"
            name="limite"
            value={form.limite}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Fecha de Corte</label>
          <input
            type="date"
            name="fechaCorte"
            value={form.fechaCorte}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Fecha de Cierre</label>
          <input
            type="date"
            name="fechaCierre"
            value={form.fechaCierre}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Nombre de la Compra</label>
          <input
            type="text"
            name="nombreCompra"
            value={form.nombreCompra}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Monto de la Cuota</label>
          <input
            type="number"
            name="montoCuota"
            value={form.montoCuota}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Cantidad de Cuotas</label>
          <input
            type="number"
            name="cantidadCuotas"
            value={form.cantidadCuotas}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Guardar Compra
        </button>
      </form>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-2">
        <h2 className="text-lg font-semibold text-slate-50">Resumen</h2>
        <p><span className="font-semibold">Tarjeta:</span> {form.tarjeta || "—"}</p>
        <p><span className="font-semibold">Límite:</span> {form.limite || "—"}</p>
        <p><span className="font-semibold">Fecha de corte:</span> {form.fechaCorte || "—"}</p>
        <p><span className="font-semibold">Fecha de cierre:</span> {form.fechaCierre || "—"}</p>
        <p><span className="font-semibold">Compra:</span> {form.nombreCompra || "—"}</p>
        <p><span className="font-semibold">Monto por cuota:</span> {form.montoCuota || "—"}</p>
        <p><span className="font-semibold">Cantidad de cuotas:</span> {form.cantidadCuotas || "—"}</p>
        <p><span className="font-semibold">Total estimado:</span> ${totalCompra.toFixed(2)}</p>
      </div>

      {compras.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-3">
          <h2 className="text-lg font-semibold text-slate-50">Compras guardadas</h2>
          <ul className="space-y-2">
            {compras.map((c, idx) => (
              <li key={idx} className="rounded border border-white/10 p-3">
                <p><span className="font-semibold">Tarjeta:</span> {c.tarjeta}</p>
                <p><span className="font-semibold">Compra:</span> {c.nombreCompra}</p>
                <p><span className="font-semibold">Cuota:</span> {c.montoCuota} x {c.cantidadCuotas}</p>
                <p><span className="font-semibold">Total:</span> ${c.total.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
