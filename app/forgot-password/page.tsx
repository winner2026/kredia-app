"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDevToken(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Error al procesar solicitud");
        setLoading(false);
        return;
      }

      setSuccess(data.message);

      // En desarrollo, mostrar el token
      if (data.token) {
        setDevToken(data.token);
      }

      setLoading(false);
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md space-y-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg space-y-4"
        >
          <div>
            <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
            <p className="text-sm text-slate-300">
              Ingresa tu email para recibir un enlace de recuperación
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-rose-500/10 border border-rose-500/20 px-4 py-3">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
              <p className="text-sm text-emerald-300">{success}</p>

              {devToken && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded">
                  <p className="text-xs text-amber-300 font-mono mb-1">
                    🔧 Modo desarrollo - Token:
                  </p>
                  <Link
                    href={`/reset-password?token=${devToken}`}
                    className="text-xs text-cyan-300 hover:text-cyan-200 underline break-all"
                  >
                    /reset-password?token={devToken}
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-cyan-300 hover:text-cyan-200 transition"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
