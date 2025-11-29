"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) return;

    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Credenciales incorrectas o email no verificado.");
      return;
    }

    if (result?.redirect) {
      router.push(result.redirect);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      <div>
        <label htmlFor="email" className="text-sm text-slate-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          disabled={isSubmitting}
          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50"
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
          disabled={isSubmitting}
          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50"
        />
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-cyan-500 py-3 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
