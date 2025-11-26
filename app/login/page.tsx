"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const from = params.get("from") || "/dashboard";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      name,
      callbackUrl: from,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    window.location.href = res?.url ?? from;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-slate-300">Usa tu email para crear o acceder a tu cuenta.</p>
        </div>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Nombre (opcional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
