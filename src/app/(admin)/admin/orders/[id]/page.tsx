import { getOrderById } from "@/services/order";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderFulfillmentManager from "@/components/admin/OrderFulfillmentManager";

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const resolvedParams = await params;
  const order = await getOrderById(resolvedParams.id);

  if (!order) {
    notFound();
  }

  // Address parsing
  const addr = order.shippingAddress as {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  // Helper to format price in BDT
  const formatPrice = (amountInCents: number) => {
    return `৳ ${(amountInCents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  // Get status pill colors
  let statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (order.status === "paid") statusColor = "bg-blue-50 text-blue-700 border-blue-200";
  if (order.status === "shipped") statusColor = "bg-purple-50 text-purple-700 border-purple-200";
  if (order.status === "delivered") statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (order.status === "cancelled") statusColor = "bg-rose-50 text-rose-700 border-rose-200";

  // Get payment status pill colors
  let paymentColor = "bg-stone-50 text-stone-600 border-stone-200";
  if (order.paymentStatus === "paid") paymentColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (order.paymentStatus === "refunded") paymentColor = "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-pink hover:underline"
        >
          &larr; Back to Orders Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-light-pink">
        <div>
          <span className="text-[10px] font-bold text-stone uppercase tracking-widest block">Order Detail</span>
          <h1 className="text-xl font-bold tracking-tight text-ink mt-0.5 font-mono">
            #{order.id.toUpperCase()}
          </h1>
          <p className="text-xs text-stone mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
            Status: {order.status.toUpperCase()}
          </span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${paymentColor}`}>
            Payment: {order.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Order Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Customer Address Details */}
          <div className="p-6 border border-light-pink/60 bg-white rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">📦 Shipping Destination</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-stone uppercase">Customer Name</span>
                <span className="font-semibold text-ink">{addr.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-stone uppercase">Contact Phone</span>
                <span className="font-semibold text-ink">{addr.phone}</span>
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-stone uppercase">Shipping Address</span>
                <span className="font-semibold text-ink">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                  <br />
                  {addr.city}, {addr.state} - {addr.postalCode}
                  <br />
                  {addr.country}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="p-6 border border-light-pink/60 bg-white rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">🛍️ Purchased Items</h3>
            
            <div className="divide-y divide-light-pink/20">
              {order.items.map((item) => {
                const product = item.product;
                const images = product.images as string[];
                const mainImage = images && images.length > 0 ? images[0] : "/placeholder.png";

                return (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-12 h-12 bg-lightest-pink/30 rounded-lg overflow-hidden border border-light-pink/30 flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="font-semibold text-sm text-ink hover:text-dark-pink transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <span className="text-xs text-stone block mt-0.5 font-mono">
                        {formatPrice(item.price)} x {item.quantity}
                      </span>
                    </div>

                    <div className="text-right font-semibold text-sm text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal & Total Details */}
            <div className="border-t border-light-pink/30 pt-4 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-stone">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-stone text-xs">
                <span>Shipping & Handing</span>
                <span>৳ 0.00 (Standard Included)</span>
              </div>
              <div className="flex justify-between font-bold text-ink text-base pt-2 border-t border-light-pink/20">
                <span>Grand Total</span>
                <span className="text-dark-pink">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Fulfillment controls */}
        <div>
          <OrderFulfillmentManager
            orderId={order.id}
            currentStatus={order.status}
            shippingAddress={order.shippingAddress}
          />
        </div>
      </div>
    </div>
  );
}
