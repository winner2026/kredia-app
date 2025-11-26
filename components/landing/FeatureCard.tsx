import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: ReactNode;
  description: ReactNode;
  icon: LucideIcon;
};

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="glass-panel group relative flex flex-col gap-3 rounded-2xl p-6 transition transform-gpu duration-200 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-sky-400/5 to-emerald-400/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-indigo-200 shadow-inner shadow-white/10">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="relative z-10 space-y-2">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <p className="text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </div>
  );
}


