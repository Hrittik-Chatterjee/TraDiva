import { getAllOrders } from "@/services/order";
import Link from "next/link";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;

  // Fetch orders from DB
  const ordersList = await getAllOrders(statusFilter);

  // Status option lists for filters
  const filterOptions = [
    { label: "All Orders", value: undefined },
    { label: "⏳ Pending", value: "pending" },
    { label: "💳 Paid", value: "paid" },
    { label: "🚚 Shipped", value: "shipped" },
    { label: "✅ Delivered", value: "delivered" },
    { label: "❌ Cancelled", value: "cancelled" },
  ];

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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-light-pink">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">📦 Orders Dashboard</h1>
          <p className="text-sm text-stone mt-1">Manage and track customer order fulfillment.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-lightest-pink/30 border border-light-pink/40 rounded-xl w-max">
        {filterOptions.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <Link
              key={opt.label}
              href={opt.value ? `/admin/orders?status=${opt.value}` : "/admin/orders"}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? "bg-dark-pink text-white shadow-sm"
                  : "text-ink hover:bg-lightest-pink/60 hover:text-dark-pink"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      {ordersList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-light-pink rounded-2xl bg-white shadow-sm text-center">
          <span className="text-4xl mb-4">📭</span>
          <h3 className="text-sm font-bold text-ink">No Orders Found</h3>
          <p className="text-xs text-stone mt-1 max-w-xs">
            {statusFilter
              ? `There are no orders with "${statusFilter}" status currently.`
              : "No customer orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-light-pink/60 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-light-pink bg-lightest-pink/10 text-xs font-bold uppercase tracking-wider text-stone">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer / Email</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-pink/30 text-sm">
              {ordersList.map((order) => {
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

                // Customer info
                const customerEmail = order.guestEmail || "Registered Customer";

                return (
                  <tr key={order.id} className="hover:bg-lightest-pink/10 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-ink">
                      #{order.id.slice(0, 8).toUpperCase()}...
                    </td>
                    <td className="py-4 px-6 text-ink">
                      <span className="font-semibold text-xs truncate max-w-[200px] block">{customerEmail}</span>
                    </td>
                    <td className="py-4 px-6 text-stone text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${paymentColor}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-ink">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-lg transition-all shadow-sm"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
