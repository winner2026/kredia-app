"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    name: z.string().trim().max(80, "Nombre demasiado largo").optional(),
    email: z.string().email("Ingresa un email valido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    setApiError(null);
    setApiSuccess(null);
    setDevToken(null);

    const payload = {
      email: values.email,
      password: values.password,
      ...(values.name?.trim() ? { name: values.name.trim() } : {}),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setApiError(data?.error || "No se pudo completar el registro");
        return;
      }

      setApiSuccess(
        data.message ||
          "Usuario registrado. Revisa tu email para verificar la cuenta."
      );
      if (data.verificationToken) {
        setDevToken(data.verificationToken as string);
      }
      reset();

      // NO redirigir automáticamente - dejar que el usuario vea el mensaje
      // El usuario puede hacer clic en "Ya tienes cuenta? Inicia sesión"
    } catch (err) {
      setApiError("Error de conexion. Intenta nuevamente.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-semibold">Crear cuenta</h1>
          <p className="text-sm text-slate-300">
            Registra tu email y contraseña para continuar
          </p>
        </div>

        {apiError && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/10 px-4 py-3">
            <p className="text-sm text-rose-300">{apiError}</p>
          </div>
        )}

        {apiSuccess && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <p className="text-sm text-emerald-300">{apiSuccess}</p>
            {devToken && (
              <p className="mt-2 text-xs text-amber-300">
                Token dev: {devToken}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="register-name">
            Nombre (opcional)
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            disabled={isSubmitting}
            {...register("name")}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
          />
          {errors.name && (
            <p className="text-xs text-rose-300">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
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
          <label className="text-sm text-slate-300" htmlFor="register-password">
            Contraseña
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            {...register("password")}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
          />
          {errors.password && (
            <p className="text-xs text-rose-300">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm text-slate-300"
            htmlFor="register-confirm-password"
          >
            Confirmar contraseña
          </label>
          <input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            {...register("confirmPassword")}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-300">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Registrarse"
          className="w-full rounded-md bg-linear-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
        >
          {isSubmitting ? "Registrando..." : "Crear cuenta"}
        </button>

        <div className="space-y-2 text-center">
          <Link
            href="/login"
            className="block text-sm text-cyan-300 transition hover:text-cyan-200"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
