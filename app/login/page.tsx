"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) return;

    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setIsSubmitting(false);

    console.log("LOGIN RESULT:", result);

    if (result?.error) {
      setError("Credenciales incorrectas o email no verificado.");
      return;
    }

    if (result?.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-white">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {error && (
            <div className="rounded-md border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="username"
              disabled={isSubmitting}
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-slate-300">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              disabled={isSubmitting}
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-cyan-500 py-3 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="space-y-2 text-center" />
      </div>
    </div>
  );
}
