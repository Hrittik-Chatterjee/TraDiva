import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/services/order";
import Link from "next/link";
import { MoirangPheePattern } from "@/components/shared/manipuri-patterns";
import { Metadata } from "next";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Details #${id} | TraDiva`,
    description: `Track shipment and review receipt specs for order ID ${id}.`,
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;

  // 1. Fetch user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/login?callbackUrl=/orders/${id}`);
  }

  // 2. Fetch order details
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // 3. Secure Guard: Ensure order belongs to logged-in user
  if (order.userId !== session.user.id) {
    notFound();
  }

  const addr = order.shippingAddress as any;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Status badges
  const payStatusStyles =
    order.paymentStatus === "paid"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : "bg-amber-50 text-amber-600 border-amber-200";

  let statusStyles = "bg-stone-50 text-stone-600 border-stone-200";
  if (order.status === "paid") statusStyles = "bg-emerald-50 text-emerald-600 border-emerald-200";
  else if (order.status === "shipped") statusStyles = "bg-purple-50 text-purple-600 border-purple-200";
  else if (order.status === "delivered") statusStyles = "bg-blue-50 text-blue-600 border-blue-200";
  else if (order.status === "cancelled") statusStyles = "bg-slate-100 text-slate-500 border-slate-200";

  return (
    <div className="bg-canvas py-12 px-6 md:px-8 flex-1">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="text-xs text-stone">
          <Link href="/orders" className="hover:underline">
            &larr; Back to Order History
          </Link>
        </div>

        {/* Order Details Header Card */}
        <div className="border border-light-pink rounded-3xl bg-canvas p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <span className="font-mono text-xs text-stone">Order ID: {order.id}</span>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Receipt Specifications</h1>
            <p className="text-xs text-steel">Placed on {orderDate}</p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${payStatusStyles}`}>
              💳 {order.paymentStatus}
            </span>
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusStyles}`}>
              📦 {order.status}
            </span>
          </div>
        </div>

        {/* Tracking Widget Panel if Shipped */}
        {addr?.tracking && (
          <div className="border border-purple-200 rounded-3xl bg-purple-50/20 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wider flex items-center gap-2">
              <span>🚀</span> Shipment Tracking Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-ink">
              <div>
                <p className="text-stone font-bold uppercase tracking-wider mb-0.5">Shipping Carrier</p>
                <p className="text-sm font-bold text-purple-900">{addr.tracking.carrier}</p>
              </div>
              <div>
                <p className="text-stone font-bold uppercase tracking-wider mb-0.5">Tracking Number</p>
                <p className="text-sm font-mono font-bold select-all bg-white border border-purple-100 px-2 py-0.5 rounded w-max">
                  {addr.tracking.trackingId}
                </p>
              </div>
              {addr.tracking.shippedAt && (
                <div className="sm:col-span-2">
                  <p className="text-stone font-bold uppercase tracking-wider mb-0.5">Date Dispatched</p>
                  <p className="text-steel">
                    {new Date(addr.tracking.shippedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Breakdown */}
        <div className="border border-light-pink rounded-3xl bg-canvas overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-lightest-pink bg-lightest-pink/10">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Delivery & Billing Specs</h3>
          </div>
          <MoirangPheePattern height={10} className="bg-canvas" />

          <div className="p-6 md:p-8 space-y-8 text-sm">
            {/* Destination details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone block">Shipping Destination</span>
                <div className="text-ink leading-relaxed font-medium">
                  <p className="font-semibold">{addr.name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  <p className="text-stone mt-2">📞 {addr.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone block mb-1">Billing Account</span>
                  <span className="text-ink font-semibold">{session.user.email}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone block mb-1">Estimated Shipping</span>
                  <span className="text-success-accent font-semibold flex items-center gap-1">
                    🚀 Standard (2-5 Business Days)
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Grid */}
            <div className="border-t border-lightest-pink pt-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone block">Items Purchased</span>
              
              <div className="divide-y divide-lightest-pink border border-light-pink rounded-2xl overflow-hidden bg-white">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4 items-center">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-light-pink bg-lightest-pink/10">
                      {item.product.images[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl bg-lightest-pink/20">👗</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-ink truncate">{item.product.name}</h4>
                      <p className="text-xs text-stone mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-ink shrink-0">
                      ৳ {((item.price * item.quantity) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtotal & Totals */}
            <div className="border-t border-lightest-pink pt-6 space-y-2.5 text-xs text-steel">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">
                  ৳ {(order.totalAmount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-success-accent font-semibold">Free</span>
              </div>
              <div className="border-t border-light-pink pt-4 flex justify-between items-center text-ink text-sm">
                <span className="font-bold">Total Amount Paid</span>
                <span className="font-bold text-lg">
                  ৳ {(order.totalAmount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
