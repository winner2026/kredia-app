"use client";

import { useEffect } from "react";

export default function PayPalScript() {
  useEffect(() => {
    const existing = document.getElementById("paypal-sdk");
    if (existing) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX;

    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX");
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.async = true;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;

    document.body.appendChild(script);
  }, []);

  return null;
}
