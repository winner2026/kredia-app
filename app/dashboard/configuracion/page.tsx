import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ConfiguracionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <p className="mt-4 text-gray-300">
        Aquí podrás modificar tus preferencias, suscripción y datos personales.
      </p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-2">
        <p>
          <span className="font-semibold">Email:</span> {user.email ?? "—"}
        </p>
        <p>
          <span className="font-semibold">Nombre:</span> {user.name ?? "—"}
        </p>
      </div>
    </div>
  );
}
