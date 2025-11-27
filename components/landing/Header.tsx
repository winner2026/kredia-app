import Image from "next/image";

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-6">
      <Image
        src="/kredia-logo-oficial.svg"
        alt="KredIA Logo"
        width={36}
        height={36}
        priority
      />
      <span className="text-xl font-semibold">
        <span className="text-[#F8B738]">K</span>
        <span className="text-[#27C1D0]">red</span>
        <span className="text-[#E13787]">IA</span>
      </span>
    </header>
  );
}
