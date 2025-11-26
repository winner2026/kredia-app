const links = [
  { label: "Sobre KredIA", href: "#" },
  { label: "Privacidad", href: "#" },
  { label: "Seguridad", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contacto", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-50">
            <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span>
          </p>
          <p className="text-sm text-slate-400">Claridad financiera con tu tarjeta, sin fricción.</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
          {links.map((link) => {
            const isBrand = link.label.includes("KredIA");
            const [prefix] = link.label.split("KredIA");
            return (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-slate-50"
              >
                {isBrand ? (
                  <>
                    {prefix}
                    <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span>
                  </>
                ) : (
                  link.label
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}




