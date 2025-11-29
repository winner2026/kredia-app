"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const from = params.get("from") || "/dashboard";
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: from,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    window.location.href = res?.url ?? from;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      // Mostrar mensaje de éxito con el token si está en desarrollo
      const successMessage = data.verificationToken
        ? `${data.message}\n\nEn desarrollo: Haz clic en el enlace que aparece en la consola del servidor o usa este token: ${data.verificationToken.substring(0, 10)}...`
        : data.message;

      setSuccess(successMessage);
      setLoading(false);

      // Si hay token de verificación en desarrollo, redirigir automáticamente
      if (data.verificationToken) {
        setTimeout(() => {
          window.location.href = `/verify-email?token=${data.verificationToken}`;
        }, 3000);
      } else {
        // En producción, cambiar a modo login después de 5 segundos
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(null);
          setError(null);
        }, 5000);
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <form
        onSubmit={isLogin ? handleLogin : handleRegister}
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-semibold">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="text-sm text-slate-300">
            {isLogin
              ? "Ingresa con tu email y contraseña"
              : "Registra una nueva cuenta"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-rose-500/10 border border-rose-500/20 px-4 py-3">
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
            <p className="text-sm text-emerald-300">{success}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
          {!isLogin && (
            <p className="text-xs text-slate-400">Mínimo 8 caracteres</p>
          )}
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-slate-300">Nombre (opcional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
        >
          {loading
            ? isLogin
              ? "Ingresando..."
              : "Creando cuenta..."
            : isLogin
            ? "Iniciar sesión"
            : "Crear cuenta"}
        </button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
            className="text-sm text-cyan-300 hover:text-cyan-200 transition block w-full"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>

          {isLogin && (
            <a
              href="/forgot-password"
              className="text-xs text-slate-400 hover:text-slate-300 transition block"
            >
              ¿Olvidaste tu contraseña?
            </a>
          )}
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-200">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
