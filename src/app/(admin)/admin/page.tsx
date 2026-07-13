import { getProducts, getCategories } from "@/services/catalog";
import { getAllOrders } from "@/services/order";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productsList, categoriesList, ordersList] = await Promise.all([
    getProducts(),
    getCategories(),
    getAllOrders(),
  ]);

  // Calculate order statistics
  const activeOrders = ordersList.filter((o) => o.status !== "cancelled");
  const totalRevenue = activeOrders
    .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = ordersList.filter((o) => o.status === "pending").length;

  // Helper to format price in BDT
  const formatPrice = (amountInCents: number) => {
    return `৳ ${(amountInCents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight mb-8">Admin Dashboard</h1>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/10">
          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Total Revenue</span>
          <h2 className="text-3xl font-bold mt-2 text-ink">{formatPrice(totalRevenue)}</h2>
          <p className="text-[10px] text-stone mt-2">Excluding cancelled orders.</p>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/10">
          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Total Orders</span>
          <h2 className="text-3xl font-bold mt-2 text-ink">{ordersList.length}</h2>
          <Link href="/admin/orders" className="text-xs text-brand-blue hover:underline mt-4 block">
            Manage Orders &rarr;
          </Link>
        </div>

        {/* Pending Fulfillment */}
        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/10">
          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Pending Shipments</span>
          <h2 className="text-3xl font-bold mt-2 text-ink">{pendingOrdersCount}</h2>
          <Link href="/admin/orders?status=pending" className="text-xs text-brand-blue hover:underline mt-4 block">
            Ship Orders &rarr;
          </Link>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/10">
          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Total Products</span>
          <h2 className="text-3xl font-bold mt-2 text-ink">{productsList.length}</h2>
          <Link href="/admin/products" className="text-xs text-brand-blue hover:underline mt-4 block">
            Manage Products &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions & Store Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-light-pink bg-canvas">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/products/new"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-xs font-medium text-on-primary hover:bg-dark-pink transition-colors"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex h-10 items-center justify-center rounded-full border border-light-pink bg-transparent px-6 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors"
            >
              Create Category
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex h-10 items-center justify-center rounded-full border border-light-pink bg-transparent px-6 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors"
            >
              Fulfill Orders
            </Link>
          </div>
        </div>

        {/* Store Metadata */}
        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone uppercase tracking-wider mb-2">Categories Count</h3>
            <h4 className="text-xl font-bold text-ink">{categoriesList.length} categories active</h4>
          </div>
          <Link href="/admin/categories" className="text-xs text-brand-blue hover:underline mt-4 block">
            Manage Categories &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

