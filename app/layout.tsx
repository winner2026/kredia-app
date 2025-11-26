import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KredIA — Tu tarjeta bajo control. Tu mente en paz.",
  description:
    "KredIA te muestra cuánto debes realmente, cuántas cuotas te quedan, qué pagarás cada mes y cuándo vuelves a estar en cero.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

export { reportWebVitals } from "./web-vitals";
