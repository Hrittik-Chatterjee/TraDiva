import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { orders, orderItems, inventory } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { executePayment } from "@/services/bkash";
import { trackServerEvent } from "@/services/posthog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const paymentId = searchParams.get("paymentID");

    if (!paymentId) {
      return NextResponse.redirect(new URL("/checkout?error=Missing payment ID", req.url));
    }

    // 1. Find the order associated with this paymentID
    const orderRecords = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentIntentId, paymentId))
      .limit(1);

    if (orderRecords.length === 0) {
      return NextResponse.redirect(new URL("/checkout?error=Order record not found", req.url));
    }

    const order = orderRecords[0];

    // 2. Handle cancellation or failure status
    if (status !== "success") {
      console.log(`[bKash] Payment status is ${status} for paymentID ${paymentId}. Restocking inventory...`);

      // Update order to cancelled state in DB
      await db
        .update(orders)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Retrieve items in this order to return them to inventory
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

      for (const item of items) {
        const invRecord = await db
          .select()
          .from(inventory)
          .where(eq(inventory.productId, item.productId))
          .limit(1);

        if (invRecord.length > 0) {
          const currentStock = invRecord[0].stock;
          await db
            .update(inventory)
            .set({
              stock: currentStock + item.quantity,
              updatedAt: new Date(),
            })
            .where(eq(inventory.productId, item.productId));
        }
      }

      trackServerEvent(order.userId || "anonymous_customer", "payment_failed", {
        orderId: order.id,
        paymentId,
        reason: status || "unknown_status",
      });

      return NextResponse.redirect(
        new URL(`/checkout?error=Payment was ${status || "unsuccessful"}. Please try again.`, req.url)
      );
    }

    // 3. Process successful payments - execute transaction on bKash PGW
    console.log(`[bKash] Payment success callback for paymentID ${paymentId}. Executing transaction...`);
    const executeResponse = await executePayment(paymentId);

    if (
      executeResponse.statusCode === "0000" &&
      executeResponse.transactionStatus === "Completed"
    ) {
      const trxId = executeResponse.trxID;

      // Update order status to paid in DB
      await db
        .update(orders)
        .set({
          status: "paid",
          paymentStatus: "paid",
          paymentIntentId: trxId, // Store the final transaction ID in paymentIntentId
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Retrieve order items count for PostHog event properties
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

      // Track PostHog analytics events
      trackServerEvent(order.userId || "anonymous_customer", "payment_processed", {
        orderId: order.id,
        amount: order.totalAmount,
        paymentGateway: "bkash",
        trxId: trxId,
      });

      trackServerEvent(order.userId || "anonymous_customer", "order_placed", {
        orderId: order.id,
        totalAmount: order.totalAmount,
        itemsCount: items.length,
        isGuest: !order.userId,
        paymentGateway: "bkash",
      });

      return NextResponse.redirect(new URL(`/orders/${order.id}/confirmation`, req.url));
    } else {
      console.error("[bKash] Payment execution failed response:", executeResponse);
      const message = executeResponse.statusMessage || "Payment execution failed";
      
      // Auto-restock if execution fails
      await db
        .update(orders)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      for (const item of items) {
        const invRecord = await db
          .select()
          .from(inventory)
          .where(eq(inventory.productId, item.productId))
          .limit(1);

        if (invRecord.length > 0) {
          const currentStock = invRecord[0].stock;
          await db
            .update(inventory)
            .set({
              stock: currentStock + item.quantity,
              updatedAt: new Date(),
            })
            .where(eq(inventory.productId, item.productId));
        }
      }

      return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(message)}`, req.url));
    }
  } catch (error: any) {
    console.error("[bKash] Callback processing error:", error);
    return NextResponse.redirect(
      new URL(`/checkout?error=${encodeURIComponent(error.message || "Failed to finalize payment")}`, req.url)
    );
  }
}
