"use server";

import { db } from "../../../db";
import { orders, orderItems, products, inventory } from "../../../db/schema";
import { checkoutSchema } from "@/lib/validation/checkout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
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

    // Deduct stock
    for (const item of validatedItems) {
      await db
        .update(inventory)
        .set({
          stock: item.currentStock - item.quantity,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, item.productId));
    }

    // Create the order (mock paid state immediately for simulation)
    await db.insert(orders).values({
      id: orderId,
      userId,
      guestEmail: userId ? null : email,
      status: "paid",
      paymentStatus: "paid",
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
