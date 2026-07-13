import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../db";
import { orders, orderItems, products } from "../../../db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Order History | TraDiva",
  description: "View and track all your previous hand-woven TraDiva purchases.",
};

export default async function CustomerOrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  // 1. Fetch user orders
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt));

  // 2. Fetch associated items for these orders using inner joins in a single batch query
  const orderIds = userOrders.map((o) => o.id);
  const itemsMap: Record<string, any[]> = {};

  if (orderIds.length > 0) {
    const allItems = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: products.name,
        productImage: products.images,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(inArray(orderItems.orderId, orderIds));

    for (const item of allItems) {
      if (!itemsMap[item.orderId]) {
        itemsMap[item.orderId] = [];
      }
      itemsMap[item.orderId].push(item);
    }
  }

  return (
    <div className="bg-canvas py-12 px-6 md:px-8 flex-1">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page Header */}
        <div className="border-b border-lightest-pink pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink">My Purchase History</h1>
          <p className="text-steel text-sm mt-1.5">
            Review and track shipments for your TraDiva order receipts.
          </p>
        </div>

        {/* Empty State */}
        {userOrders.length === 0 ? (
          <div className="border border-dashed border-light-pink rounded-3xl p-12 text-center space-y-4 bg-white/40">
            <span className="text-5xl block">🛍️</span>
            <h2 className="text-xl font-bold text-ink">No orders found</h2>
            <p className="text-stone text-sm max-w-sm mx-auto">
              You haven't placed any purchases yet. Head over to our heritage catalog to find authentic Manipuri clothing.
            </p>
            <Link
              href="/catalog"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-8 text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98]"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => {
              const items = itemsMap[order.id] || [];
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              const addr = order.shippingAddress as any;

              // Helper for payment status styles
              const payStatusStyles =
                order.paymentStatus === "paid"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-amber-50 text-amber-600 border-amber-200";

              // Helper for fulfillment status styles
              let statusStyles = "bg-stone-50 text-stone-600 border-stone-200";
              if (order.status === "paid") statusStyles = "bg-emerald-50 text-emerald-600 border-emerald-200";
              else if (order.status === "shipped") statusStyles = "bg-purple-50 text-purple-600 border-purple-200";
              else if (order.status === "delivered") statusStyles = "bg-blue-50 text-blue-600 border-blue-200";
              else if (order.status === "cancelled") statusStyles = "bg-slate-100 text-slate-500 border-slate-200";

              return (
                <div
                  key={order.id}
                  className="border border-light-pink rounded-3xl bg-canvas overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Card Header Summary */}
                  <div className="px-6 py-4 bg-lightest-pink/10 border-b border-lightest-pink flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-stone uppercase font-bold tracking-wider mb-0.5">Date Placed</p>
                        <p className="font-semibold text-ink">{orderDate}</p>
                      </div>
                      <div>
                        <p className="text-stone uppercase font-bold tracking-wider mb-0.5">Total Price</p>
                        <p className="font-bold text-ink">
                          ৳ {(order.totalAmount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${payStatusStyles}`}>
                        💳 {order.paymentStatus}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles}`}>
                        📦 {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6 divide-y divide-lightest-pink space-y-4">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-light-pink bg-lightest-pink/10">
                            {item.productImage[0] ? (
                              <img src={item.productImage[0]} alt={item.productName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xl bg-lightest-pink/20">👗</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-ink truncate">{item.productName}</h4>
                            <p className="text-xs text-stone mt-0.5">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-ink shrink-0">
                            ৳ {((item.price * item.quantity) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details if shipped */}
                    {addr?.tracking && (
                      <div className="pt-4 mt-4 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-purple-50/30 border border-purple-100/50 p-3 rounded-xl">
                        <span className="font-semibold text-purple-700 flex items-center gap-1.5">
                          🚀 Shipped via: <span className="font-bold text-purple-900">{addr.tracking.carrier}</span>
                        </span>
                        <span className="font-mono text-stone bg-white px-2 py-0.5 border border-purple-100 rounded">
                          Tracking ID: <span className="font-bold text-ink select-all">{addr.tracking.trackingId}</span>
                        </span>
                      </div>
                    )}

                    {/* View Details Link */}
                    <div className="pt-4 flex justify-between items-center text-xs">
                      <span className="font-mono text-stone">Order ID: {order.id}</span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-bold text-brand-blue hover:underline flex items-center gap-1"
                      >
                        View Full Receipt &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
