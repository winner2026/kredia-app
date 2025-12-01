"use client";

import PayPalScript from "@/app/components/PayPalScript";

export default function PaypalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PayPalScript />
      {children}
    </>
  );
}
