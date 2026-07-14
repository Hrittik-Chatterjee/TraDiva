import { db } from "../../db";
import { orders, orderItems, products, inventory } from "../../db/schema";
import { eq, desc, and, lt, or, sql } from "drizzle-orm";

export async function cleanupExpiredPendingOrders(onlyForEmailOrUser?: {
  email?: string | null;
  userId?: string | null;
}) {
  try {
    const conditions = [
      eq(orders.status, "pending"),
      eq(orders.paymentStatus, "unpaid"),
    ];

    if (onlyForEmailOrUser) {
      const userConditions = [];
      if (onlyForEmailOrUser.userId) {
        userConditions.push(eq(orders.userId, onlyForEmailOrUser.userId));
      }
      if (onlyForEmailOrUser.email) {
        userConditions.push(eq(orders.guestEmail, onlyForEmailOrUser.email));
      }
      if (userConditions.length === 0) {
        return { success: true, count: 0 };
      }
      conditions.push(or(...userConditions)!);
    } else {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      conditions.push(lt(orders.createdAt, fiveMinutesAgo));
    }

    const expiredOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(and(...conditions));

    if (expiredOrders.length === 0) {
      return { success: true, count: 0 };
    }

    const expiredOrderIds = expiredOrders.map((o) => o.id);
    console.log(`[cleanup] Found ${expiredOrderIds.length} orders to cancel:`, expiredOrderIds);

    for (const orderId of expiredOrderIds) {
      const orderRecord = await db
        .select({ status: orders.status })
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (orderRecord.length === 0 || orderRecord[0].status !== "pending") {
        continue;
      }

      await db
        .update(orders)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      for (const item of items) {
        await db
          .update(inventory)
          .set({
            stock: sql`${inventory.stock} + ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(inventory.productId, item.productId));
      }

      console.log(`[cleanup] Cancelled order ${orderId} and restocked its items.`);
    }

    return { success: true, count: expiredOrderIds.length };
  } catch (error) {
    console.error("[cleanup] Error cleaning up expired pending orders:", error);
    return { error: "Failed to cleanup expired pending orders" };
  }
}


export async function getOrderById(id: string) {
  const orderRecord = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (orderRecord.length === 0) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        images: products.images,
      },
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return {
    ...orderRecord[0],
    items,
  };
}

export async function getOrdersByUserId(userId: string) {
  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrdersByEmail(email: string) {
  return await db
    .select()
    .from(orders)
    .where(eq(orders.guestEmail, email))
    .orderBy(desc(orders.createdAt));
}

export async function getAllOrders(statusFilter?: string) {
  // Lazy cleanup expired pending orders
  await cleanupExpiredPendingOrders();

  if (statusFilter) {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, statusFilter))
      .orderBy(desc(orders.createdAt));
  }
  return await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
}

