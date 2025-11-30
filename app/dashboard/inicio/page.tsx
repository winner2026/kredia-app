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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("DATA SUBMIT:", form);
    // aquí luego conectas con tu API real
  }

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
    </div>
  );
}
