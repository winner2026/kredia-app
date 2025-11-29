"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h1 className="text-2xl font-semibold mb-2">Token inválido</h1>
          <p className="text-sm text-slate-300 mb-4">
            El enlace de recuperación no es válido o ha expirado.
          </p>
          <Link
            href="/forgot-password"
            className="text-sm text-cyan-300 hover:text-cyan-200 transition"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("🔐 Reset password submitted");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Token no encontrado");
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Calling /api/auth/reset-password");

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      console.log("📥 Response:", response.status);

      const data = await response.json();
      console.log("📦 Data:", data);

      if (!response.ok || !data.success) {
        setError(data.error || "Error al actualizar contraseña");
        setLoading(false);
        return;
      }

      console.log("✅ Password reset successful!");
      setSuccess(true);
      setLoading(false);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        console.log("🔄 Redirecting to login...");
        router.push("/login");
      }, 3000);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error de conexión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-emerald-300 mb-2">
            ¡Contraseña actualizada!
          </h1>
          <p className="text-sm text-emerald-200 mb-4">
            Tu contraseña ha sido cambiada exitosamente. Redirigiendo al inicio
            de sesión en 3 segundos...
          </p>
          <Link
            href="/login"
            className="inline-block text-sm text-emerald-300 hover:text-emerald-200 underline"
          >
            O haz clic aquí para ir ahora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-semibold">Nueva contraseña</h1>
          <p className="text-sm text-slate-300">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-rose-500/10 border border-rose-500/20 px-4 py-3">
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm text-slate-300">Nueva contraseña</label>
          <input
            id="new-password"
            name="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-50"
          />
          <p className="text-xs text-slate-400">Mínimo 8 caracteres</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm text-slate-300">
            Confirmar contraseña
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-200">
          Cargando...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
