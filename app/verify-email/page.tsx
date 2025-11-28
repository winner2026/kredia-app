"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Token de verificación no encontrado");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.error || "Error al verificar email");
          setLoading(false);
          return;
        }

        setSuccess(true);
        setLoading(false);

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        setError("Error de conexión. Intenta nuevamente.");
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300 mx-auto mb-4"></div>
          <p className="text-slate-300">Verificando tu email...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-lg text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-semibold text-emerald-300 mb-2">
            ¡Email verificado!
          </h1>
          <p className="text-sm text-emerald-200 mb-4">
            Tu cuenta ha sido verificada exitosamente.
          </p>
          <p className="text-xs text-slate-400">
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-rose-300 mb-2">
          Error de verificación
        </h1>
        <p className="text-sm text-rose-200 mb-4">
          {error || "No se pudo verificar tu email"}
        </p>
        <div className="space-y-2">
          <Link
            href="/login"
            className="block text-sm text-cyan-300 hover:text-cyan-200 transition"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-200">
          Cargando...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
