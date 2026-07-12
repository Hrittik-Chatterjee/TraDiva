import { db } from "../../db";
import { orders, orderItems, products } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

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
