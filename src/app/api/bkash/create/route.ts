import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/services/order";
import { createPayment } from "@/services/bkash";
import { db } from "../../../../../db";
import { orders } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.redirect(new URL("/checkout?error=Missing order ID", req.url));
    }

    // Fetch the order to ensure it exists and get the total amount
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.redirect(new URL("/checkout?error=Order not found", req.url));
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.redirect(new URL(`/orders/${orderId}/confirmation`, req.url));
    }

    // Generate absolute callback URL matching the host (supports localhost & production dynamically)
    const requestUrl = new URL(req.url);
    const protocol = requestUrl.protocol;
    const host = requestUrl.host;
    const callbackURL = `${protocol}//${host}/api/bkash/callback`;

    // Initiate payment on bKash PGW
    console.log(`[bKash] Creating payment for Order #${orderId}, Amount: ${order.totalAmount / 100} BDT...`);
    const paymentResponse = await createPayment(orderId, order.totalAmount, callbackURL);

    if (paymentResponse.bkashURL && paymentResponse.paymentID) {
      // Store the bKash paymentID in the order record so we can lookup the order later by paymentID
      await db
        .update(orders)
        .set({ paymentIntentId: paymentResponse.paymentID })
        .where(eq(orders.id, orderId));

      return NextResponse.redirect(paymentResponse.bkashURL);
    } else {
      console.error("[bKash] Payment creation did not return a checkout URL:", paymentResponse);
      const message = paymentResponse.statusMessage || "Failed to initialize bKash checkout";
      return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(message)}`, req.url));
    }
  } catch (error: any) {
    console.error("[bKash] Error creating payment:", error);
    return NextResponse.redirect(
      new URL(`/checkout?error=${encodeURIComponent(error.message || "Failed to connect to bKash")}`, req.url)
    );
  }
}
