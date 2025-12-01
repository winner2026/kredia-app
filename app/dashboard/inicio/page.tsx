"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { v4 as uuid } from "uuid";

type Compra = {
  id: string;
  tarjeta: string;
  limite: number;
  fechaCorte: string;
  fechaCierre: string;
  nombreCompra: string;
  montoCuota: number;
  cantidadCuotas: number;
};

type FormState = {
  tarjeta: string;
  limite: string;
  fechaCorte: string;
  fechaCierre: string;
  nombreCompra: string;
  montoCuota: string;
  cantidadCuotas: string;
};

export default function DashboardInicio() {
  const [form, setForm] = useState<FormState>({
    tarjeta: "",
    limite: "",
    fechaCorte: "",
    fechaCierre: "",
    nombreCompra: "",
    montoCuota: "",
    cantidadCuotas: "",
  });

  const [compras, setCompras] = useState<Compra[]>([]);

  const totalMensual = useMemo(
    () => compras.reduce((acc, c) => acc + Number(c.montoCuota || 0), 0),
    [compras]
  );

  const consolidadosPorTarjeta = useMemo(
    () =>
      compras.reduce<Record<string, number>>((acc, c) => {
        const key = c.tarjeta || "Sin tarjeta";
        const monto = Number(c.montoCuota) || 0;
        acc[key] = (acc[key] || 0) + monto;
        return acc;
      }, {}),
    [compras]
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: Compra = {
      id: uuid(),
      tarjeta: form.tarjeta,
      limite: Number(form.limite) || 0,
      fechaCorte: form.fechaCorte,
      fechaCierre: form.fechaCierre,
      nombreCompra: form.nombreCompra,
      montoCuota: Number(form.montoCuota) || 0,
      cantidadCuotas: Number(form.cantidadCuotas) || 0,
    };

    const res = await fetch("/api/compras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.ok) {
      setCompras((prev) => [...prev, payload]);
      setForm({
        tarjeta: "",
        limite: "",
        fechaCorte: "",
        fechaCierre: "",
        nombreCompra: "",
        montoCuota: "",
        cantidadCuotas: "",
      });
    } else {
      alert("Error al guardar la compra");
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      {/* ======== FORMULARIO ======== */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-6"
      >
        <div className="md:col-span-2">
          <label
            htmlFor="tarjeta"
            className="text-slate-200 block text-sm mb-1"
          >
            Tarjeta
          </label>
          <input
            id="tarjeta"
            name="tarjeta"
            value={form.tarjeta}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Ej. Visa Clasica"
            title="Tarjeta"
          />
        </div>

        <div>
          <label htmlFor="limite" className="text-slate-200 block text-sm mb-1">
            Limite
          </label>
          <input
            id="limite"
            name="limite"
            type="number"
            value={form.limite}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Ej. 10000"
            title="Limite"
          />
        </div>

        <div>
          <label
            htmlFor="fechaCorte"
            className="text-slate-200 block text-sm mb-1"
          >
            Fecha Corte
          </label>
          <input
            id="fechaCorte"
            name="fechaCorte"
            type="date"
            value={form.fechaCorte}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Selecciona fecha de corte"
            title="Fecha Corte"
          />
        </div>

        <div>
          <label
            htmlFor="fechaCierre"
            className="text-slate-200 block text-sm mb-1"
          >
            Fecha Cierre
          </label>
          <input
            id="fechaCierre"
            name="fechaCierre"
            type="date"
            value={form.fechaCierre}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Selecciona fecha de cierre"
            title="Fecha Cierre"
          />
        </div>

        <div>
          <label
            htmlFor="nombreCompra"
            className="text-slate-200 block text-sm mb-1"
          >
            Compra
          </label>
          <input
            id="nombreCompra"
            name="nombreCompra"
            value={form.nombreCompra}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Ej. Notebook"
            title="Nombre de la compra"
          />
        </div>

        <div>
          <label
            htmlFor="montoCuota"
            className="text-slate-200 block text-sm mb-1"
          >
            Monto Cuota
          </label>
          <input
            id="montoCuota"
            name="montoCuota"
            type="number"
            value={form.montoCuota}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Ej. 1200"
            title="Monto por cuota"
          />
        </div>

        <div>
          <label
            htmlFor="cantidadCuotas"
            className="text-slate-200 block text-sm mb-1"
          >
            Cuotas
          </label>
          <input
            id="cantidadCuotas"
            name="cantidadCuotas"
            type="number"
            value={form.cantidadCuotas}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/40 border border-white/10 p-3 rounded text-white"
            placeholder="Ej. 12"
            title="Cantidad de cuotas"
          />
        </div>

        <div className="md:col-span-2">
          <button className="w-full bg-blue-600 p-3 rounded text-white">
            Guardar Compra
          </button>
        </div>
      </form>

      {/* ======== ANALISIS INTELIGENTE ======== */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white space-y-4">
        <h2 className="text-xl font-bold">Analisis Inteligente</h2>

        <p className="text-lg">
          <strong>Carga mensual total:</strong> ${totalMensual.toFixed(2)}
        </p>

        <div>
          <h3 className="font-semibold text-blue-300">
            Consolidado por Tarjeta
          </h3>
          {Object.entries(consolidadosPorTarjeta).map(([t, total]) => (
            <p key={t}>
              <strong>{t}:</strong> ${total.toFixed(2)}
            </p>
          ))}
        </div>

        {compras.map((c) => {
          const total = Number(c.montoCuota || 0) * Number(c.cantidadCuotas);
          const uso =
            c.limite > 0 ? (total / Number(c.limite)) * 100 : Number.NaN;
          const corte = new Date(c.fechaCorte);
          const fin = new Date(corte);
          fin.setMonth(fin.getMonth() + Number(c.cantidadCuotas));

          return (
            <div key={c.id} className="border-b border-white/10 py-2">
              <p className="text-blue-400 font-semibold">{c.nombreCompra}</p>
              {Number.isFinite(uso) && <p>Uso limite: {uso.toFixed(1)}%</p>}
              <p>Finaliza: {fin.toLocaleDateString()}</p>
              {Number.isFinite(uso) && uso > 100 && (
                <p className="text-red-400">⚠ Excede limite</p>
              )}
              {Number.isFinite(uso) && uso > 80 && uso <= 100 && (
                <p className="text-yellow-300">⚠ Uso alto</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ======== HISTORIAL DE COMPRAS ======== */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white space-y-4">
        <h2 className="text-xl font-bold">Historial de Compras</h2>

        {compras.length === 0 && (
          <p className="text-slate-300 text-sm">Todavía no cargaste compras.</p>
        )}

        {compras.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="text-slate-300 border-b border-white/10">
              <tr>
                <th className="py-2">Tarjeta</th>
                <th>Compra</th>
                <th>Cuota</th>
                <th>Cuotas</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {compras.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="py-2">{c.tarjeta}</td>
                  <td>{c.nombreCompra}</td>
                  <td>${c.montoCuota}</td>
                  <td>{c.cantidadCuotas}</td>
                  <td>${(c.montoCuota * c.cantidadCuotas).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ========== ANALISIS INTELIGENTE ========== */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white space-y-4 mt-10">
        <h2 className="text-xl font-bold">Análisis Inteligente</h2>

        {/* SCORE */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Score de uso</p>

          <div className="text-2xl font-bold">
            {(() => {
              const carga = totalMensual;
              let score = 100;

              if (carga > 3000) score -= 40;
              if (carga > 4000) score -= 20;
              if (carga > 5000) score -= 20;

              return Math.max(0, Math.min(100, score));
            })()}
            /100
          </div>
        </div>

        {/* PROGRESO */}
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{
              width: `${(() => {
                const carga = totalMensual;
                const max = 6000;
                return Math.min((carga / max) * 100, 100);
              })()}%`,
            }}
          ></div>
        </div>

        {/* ALERTAS */}
        <div className="space-y-2 mt-4">
          <h3 className="font-semibold text-lg">Alertas</h3>

          {totalMensual > 3500 && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded">
              ⚠️ Tu carga mensual supera los $3500. Podés entrar en zona roja si
              sumas otra compra.
            </div>
          )}

          {compras.some((c) => c.cantidadCuotas >= 12) && (
            <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
              ⚠️ Hay compras con muchas cuotas (12+). Esto aumenta tu riesgo
              futuro.
            </div>
          )}

          {compras.filter((c) => c.montoCuota > 3000).length > 0 && (
            <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded">
              ⚠️ Tenés compras de alto impacto (más de $3000/mes).
            </div>
          )}
        </div>

        {/* RECOMENDACIONES */}
        <div className="space-y-2 mt-4">
          <h3 className="font-semibold text-lg">Recomendaciones</h3>

          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Evitá compras grandes hasta reducir el peso de la notebook.</li>
            <li>• Si debés comprar, usá la tarjeta con menos carga mensual.</li>
            <li>• Considerá adelantar cuotas pequeñas si es posible.</li>
            <li>• Intentá no superar los $4500 mensuales en cuotas.</li>
          </ul>
        </div>

        {/* CONSOLIDACIÓN */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Carga por Tarjeta</h3>

          {(() => {
            const porTarjeta: Record<string, number> = {};

            compras.forEach((c) => {
              porTarjeta[c.tarjeta] = (porTarjeta[c.tarjeta] || 0) + c.montoCuota;
            });

            return (
              <div className="space-y-2 mt-3">
                {Object.keys(porTarjeta).map((tarjeta) => (
                  <div
                    key={tarjeta}
                    className="flex justify-between border-b border-white/10 pb-1"
                  >
                    <span>{tarjeta}</span>
                    <span>${porTarjeta[tarjeta]}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
