export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderID, userId } = await req.json();

    if (!orderID || !userId) {
      return NextResponse.json(
        { error: "Missing orderID or userId" },
        { status: 400 }
      );
    }

    // Crear token OAuth
    const basicAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID_SANDBOX}:${process.env.PAYPAL_SECRET_SANDBOX}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const { access_token } = await tokenRes.json();

    // Capturar la orden
    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const capture = await captureRes.json();

    // Si PayPal confirma que el pago se completó
    if (capture.status === "COMPLETED") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          premium: true,
          premiumSince: new Date(),
        },
      });
    }

    return NextResponse.json(capture);
  } catch (err) {
    console.error("CAPTURE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}
