"use client";

import PayPalScript from "@/app/components/PayPalScript";
import PayPalBtn from "@/app/components/PayPalBtn";
import { SessionProvider, useSession } from "next-auth/react";

export default function ConfiguracionPage() {
  return (
    <SessionProvider>
      <Content />
    </SessionProvider>
  );
}

function Content() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (!session?.user?.id) return <p>No autenticado</p>;

  // 🔥 El SDK solo se carga AQUÍ, en árbol estable y con sesión lista
  return (
    <>
      <PayPalScript />

      <div>
        <h1>Configuración</h1>
        <p>Usuario: {session.user.email}</p>

        <PayPalBtn userId={session.user.id} />
      </div>
    </>
  );
}
