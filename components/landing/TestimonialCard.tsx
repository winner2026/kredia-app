import type { ReactNode } from "react";

type TestimonialCardProps = {
  name: string;
  role: string;
  quote: ReactNode;
};

export function TestimonialCard({ name, role, quote }: TestimonialCardProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="glass-panel relative flex flex-col gap-4 rounded-2xl p-6 transition duration-200 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/50 via-slate-800 to-emerald-300/40 text-lg font-semibold text-slate-50 shadow-inner shadow-white/10">
          {initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-50">{name}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
      </div>
      <p className="relative text-sm leading-6 text-slate-300">“{quote}”</p>
    </div>
  );
}


