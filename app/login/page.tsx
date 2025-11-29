"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) return;

    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Credenciales incorrectas o email no verificado.");
      return;
    }

    if (result?.url) {
      router.push(result.url);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" required />
      <input type="password" name="password" required />

      {error && <div className="text-red-500">{error}</div>}

      <button disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
