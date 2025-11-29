"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ConfiguracionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  if (!session?.user) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <p className="mt-4 text-gray-300">
        Aquí podrás modificar tus preferencias, suscripción y datos personales.
      </p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-2">
        <p>
          <span className="font-semibold">Email:</span> {session.user.email ?? "—"}
        </p>
        <p>
          <span className="font-semibold">Nombre:</span> {session.user.name ?? "—"}
        </p>
      </div>
    </div>
  );
}
