"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalBtn({ userId }: { userId: string }) {
  const renderedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let retries = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const tryRender = () => {
      if (renderedRef.current) return;

      if (!window.paypal) {
        if (retries < 30 && isMounted) {
          retries++;
          retryTimer = setTimeout(tryRender, 150);
        }
        return;
      }

      const container = document.getElementById("paypal-button-container");
      if (!container) return;
      container.innerHTML = "";

      renderedRef.current = true;

      try {
        window.paypal
          .Buttons({
            style: { layout: "vertical" },

            createOrder: async () => {
              try {
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId }),
                });

                if (!res.ok) {
                  console.error("PayPal create-order failed:", res.status);
                  throw new Error("No se pudo crear la orden");
                }

                const data = await res.json();
                const orderId = data?.orderID ?? data?.id;
                if (!orderId) {
                  console.error("PayPal create-order missing orderID:", data);
                  throw new Error("Orden inválida");
                }

                return orderId;
              } catch (err) {
                console.error("PayPal create-order error:", err);
                throw err;
              }
            },

            onApprove: async (data: any) => {
              try {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    userId,
                  }),
                });

                if (!res.ok) {
                  console.error("PayPal capture failed:", res.status);
                  throw new Error("No se pudo capturar el pago");
                }

                await res.json();
                alert("Pago completado 🚀");
              } catch (err) {
                console.error("PayPal capture error:", err);
                alert("Ocurrió un error al procesar el pago");
                throw err;
              }
            },
            onError: (err: unknown) => {
              console.error("PayPal Buttons onError:", err);
              renderedRef.current = false;
            },
          })
          .render("#paypal-button-container");
      } catch (err) {
        console.error("PayPal Buttons render error:", err);
        renderedRef.current = false;
      }
    };

    tryRender();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
      renderedRef.current = false;
    };
  }, [userId]);

  return <div id="paypal-button-container"></div>;
}
