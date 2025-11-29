"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormData) => {
    setApiError(null);

    const signInResult = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/dashboard",
    });

    if (signInResult?.error) {
      setApiError("Email o contraseña incorrectos");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-slate-300">
            Ingresa con tu email y contraseña
          </p>
        </div>

        {apiError && (
          <div className="rounded-md bg-rose-500/10 border border-rose-500/20 px-4 py-3">
            <p className="text-sm text-rose-300">{apiError}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            {...register("email")}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
          />
          {errors.email && (
            <p className="text-xs text-rose-300">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="login-password">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register("password")}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
          />
          {errors.password && (
            <p className="text-xs text-rose-300">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Entrar"
          className="w-full rounded-md bg-linear-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <div className="text-center space-y-2">
          <a
            href="/forgot-password"
            className="text-xs text-slate-400 hover:text-slate-300 transition block"
          >
            ¿Olvidaste tu contraseña?
          </a>
          <a
            href="/register"
            className="text-sm text-cyan-300 hover:text-cyan-200 transition block"
          >
            ¿No tienes cuenta? Regístrate
          </a>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-200">
          Cargando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
