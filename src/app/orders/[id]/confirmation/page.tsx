import { getOrderById } from "@/services/order";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MoirangPheePattern, ManipuriGirlPlaceholder } from "@/components/shared/manipuri-patterns";
import CartClearer from "@/components/storefront/CartClearer";
import { Metadata } from "next";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ConfirmationPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Confirmed | TraDiva`,
    description: `Thank you for your order! Your transaction details for order ID ${id} are available here.`,
  };
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

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

  return (
    <div className="bg-canvas py-16 px-6 md:px-8 flex-1 flex flex-col justify-center">
      {/* Wipe client cart state */}
      <CartClearer />

      <div className="mx-auto max-w-3xl w-full">
        {/* Success Header Card */}
        <div className="border border-light-pink rounded-3xl bg-canvas overflow-hidden shadow-sm mb-8 text-center p-8 md:p-12 relative">
          {/* Animated visual illustration */}
          <div className="mx-auto w-36 h-40 bg-lightest-pink/30 rounded-2xl border border-light-pink flex items-center justify-center p-4 overflow-hidden mb-6">
            <div className="w-full h-full max-h-[140px] animate-gentle-float">
              <ManipuriGirlPlaceholder />
            </div>
          </div>

          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink border border-light-pink px-3 py-1 rounded-full w-max mx-auto block mb-4">
            Payment Successful
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-2">
            Thank you for your order!
          </h1>
          <p className="text-sm text-steel max-w-[480px] mx-auto leading-relaxed">
            Your transaction has processed successfully. We are preparing your hand-woven items for shipment.
          </p>

          <div className="mt-8 pt-6 border-t border-lightest-pink max-w-sm mx-auto flex flex-col items-center gap-1">
            <span className="text-xs text-stone uppercase tracking-wider">Order ID</span>
            <span className="font-mono text-sm font-semibold bg-lightest-pink/50 border border-light-pink/40 px-3 py-1 rounded select-all text-ink">
              {order.id}
            </span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="border border-light-pink rounded-3xl bg-canvas overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-lightest-pink bg-lightest-pink/10">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Order Specifications</h3>
          </div>
          <MoirangPheePattern height={10} className="bg-canvas" />

          <div className="p-6 md:p-8 space-y-8">
            {/* Delivery address & Details row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
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
                  <span className="text-xs font-bold uppercase tracking-wider text-stone block mb-1">Contact Email</span>
                  <span className="text-ink font-semibold">{order.guestEmail || "Linked Account"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone block mb-1">Estimated Shipping</span>
                  <span className="text-success-accent font-semibold flex items-center gap-1">
                    🚀 Standard (2-5 Business Days)
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized List */}
            <div className="border-t border-lightest-pink pt-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone block">Items Purchased</span>
              
              <div className="divide-y divide-lightest-pink border border-light-pink rounded-2xl overflow-hidden bg-canvas">
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

            {/* Total Billing */}
            <div className="border-t border-light-pink pt-6 flex justify-between items-center text-ink">
              <span className="font-bold">Total Amount Paid</span>
              <span className="font-bold text-xl">৳ {(order.totalAmount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/catalog"
            className="h-11 inline-flex items-center justify-center rounded-full bg-primary px-8 text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98]"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="h-11 inline-flex items-center justify-center rounded-full border border-light-pink bg-canvas px-8 text-xs font-semibold text-ink hover:bg-lightest-pink transition-all active:scale-[0.98]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
