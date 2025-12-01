export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX!;
    const secret = process.env.PAYPAL_SECRET_SANDBOX!;

    if (!clientId || !secret) {
      return NextResponse.json(
        { error: "Missing PayPal credentials" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const accessTokenRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!accessTokenRes.ok) {
      console.error(await accessTokenRes.text());
      return NextResponse.json(
        { error: "Failed to generate PayPal access token" },
        { status: 500 }
      );
    }

    const { access_token } = await accessTokenRes.json();

    const orderRes = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "9.99",
              },
            },
          ],
        }),
      }
    );

    const data = await orderRes.json();

    if (!orderRes.ok || !data?.id) {
      console.error("PAYPAL ORDER ERROR:", data);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    // Frontend espera orderID
    return NextResponse.json({ orderID: data.id });
  } catch (error) {
    console.error("PAYPAL ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
