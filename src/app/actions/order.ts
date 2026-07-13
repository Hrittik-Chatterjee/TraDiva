"use server";

import { db } from "../../../db";
import { orders, orderItems, products, inventory } from "../../../db/schema";
import { checkoutSchema } from "@/lib/validation/checkout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sql, and, gte } from "drizzle-orm";
import { trackServerEvent } from "@/services/posthog";
import { revalidatePath } from "next/cache";

export async function createOrderAction(input: {
  checkoutData: any;
  items: { productId: string; quantity: number }[];
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id || null;

  // 1. Validate checkout details
  const validation = checkoutSchema.safeParse(input.checkoutData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { email, name, line1, line2, city, state, postalCode, country, phone } = validation.data;
  const shippingAddress = { name, line1, line2: line2 || null, city, state, postalCode, country, phone };

  if (!input.items || input.items.length === 0) {
    return { error: "Your cart is empty" };
  }

  try {
    const validatedItems: {
      productId: string;
      quantity: number;
      price: number;
      currentStock: number;
    }[] = [];

    let totalAmount = 0;

    // A. Validate stock and retrieve prices sequentially (fully compatible with neon-http)
    for (const item of input.items) {
      const productRecord = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          isActive: products.isActive,
          stock: inventory.stock,
        })
        .from(products)
        .leftJoin(inventory, eq(products.id, inventory.productId))
        .where(eq(products.id, item.productId))
        .limit(1);

      if (productRecord.length === 0 || !productRecord[0].isActive) {
        return { error: `Product not found or inactive` };
      }

      const prod = productRecord[0];
      const stock = prod.stock ?? 0;

      if (stock < item.quantity) {
        return { error: `Insufficient stock for "${prod.name}". Only ${stock} items left.` };
      }

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: prod.price,
        currentStock: stock,
      });

      totalAmount += prod.price * item.quantity;
    }

    // B. Apply inventory deductions and insert records
    const orderId = "ord_" + crypto.randomUUID();

    // Atomically deduct stock — only succeeds if stock is still sufficient at write time.
    // Prevents overselling under concurrent orders (race condition safe).
    for (const item of validatedItems) {
      const result = await db
        .update(inventory)
        .set({
          stock: sql`${inventory.stock} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(inventory.productId, item.productId),
            gte(inventory.stock, item.quantity)
          )
        );

      if (result.rowCount === 0) {
        return { error: "Stock was just purchased by someone else. Please review your cart and try again." };
      }
    }

    // Create the order
    await db.insert(orders).values({
      id: orderId,
      userId,
      guestEmail: userId ? null : email,
      status: "pending",
      paymentStatus: "unpaid",
      totalAmount,
      shippingAddress,
    });

    // Create order items
    for (const item of validatedItems) {
      await db.insert(orderItems).values({
        id: "item_" + crypto.randomUUID(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // 3. Track events in PostHog
    const trackId = userId || "anonymous_customer";
    trackServerEvent(trackId, "order_placed", {
      orderId,
      totalAmount,
      itemsCount: validatedItems.length,
      isGuest: !userId,
    });

    revalidatePath("/admin/products");
    return { success: true, orderId };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { error: "Failed to process order. Please try again." };
  }
}

export async function shipOrderAction(orderId: string, carrier: string, trackingNumber: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = session?.user?.role === "admin";
  if (!isDev && !isAdmin) {
    return { error: "Unauthorized: Admin access required" };
  }

  try {
    const orderRecords = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (orderRecords.length === 0) {
      return { error: "Order not found" };
    }

    const order = orderRecords[0];
    const shippingAddress = order.shippingAddress as Record<string, any>;
    const updatedAddress = {
      ...shippingAddress,
      tracking: {
        carrier,
        trackingNumber,
        shippedAt: new Date().toISOString(),
      },
    };

    await db
      .update(orders)
      .set({
        status: "shipped",
        shippingAddress: updatedAddress,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    trackServerEvent(session?.user?.id || "admin", "order_shipped", {
      orderId,
      carrier,
      trackingNumber,
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}/confirmation`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to ship order:", error);
    return { error: error.message || "Failed to ship order. Please try again." };
  }
}

export async function deliverOrderAction(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = session?.user?.role === "admin";
  if (!isDev && !isAdmin) {
    return { error: "Unauthorized: Admin access required" };
  }

  try {
    const orderRecords = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (orderRecords.length === 0) {
      return { error: "Order not found" };
    }

    await db
      .update(orders)
      .set({
        status: "delivered",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    trackServerEvent(session?.user?.id || "admin", "order_delivered", {
      orderId,
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}/confirmation`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to deliver order:", error);
    return { error: error.message || "Failed to deliver order. Please try again." };
  }
}

export async function cancelOrderAction(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = session?.user?.role === "admin";
  if (!isDev && !isAdmin) {
    return { error: "Unauthorized: Admin access required" };
  }

  try {
    const orderRecords = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (orderRecords.length === 0) {
      return { error: "Order not found" };
    }

    const order = orderRecords[0];
    if (order.status === "cancelled") {
      return { error: "Order is already cancelled" };
    }

    // Update order status first
    await db
      .update(orders)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Retrieve order items to restock
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    // Restock each item
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

    trackServerEvent(session?.user?.id || "admin", "order_cancelled", {
      orderId,
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}/confirmation`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel order:", error);
    return { error: error.message || "Failed to cancel order. Please try again." };
  }
}

