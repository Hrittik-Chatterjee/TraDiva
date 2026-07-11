import { getProducts, getCategories } from "@/services/catalog";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productsList, categoriesList] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/10">
          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Total Products</span>
          <h2 className="text-4xl font-bold mt-2">{productsList.length}</h2>
          <Link href="/admin/products" className="text-xs text-brand-blue hover:underline mt-4 block">
            Manage Products &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-2xl border border-light-pink bg-lightest-pink/10">
          <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Categories</span>
          <h2 className="text-4xl font-bold mt-2">{categoriesList.length}</h2>
          <Link href="/admin/categories" className="text-xs text-brand-blue hover:underline mt-4 block">
            Manage Categories &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-2xl border border-light-pink bg-canvas">
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
        </div>
      </div>
    </div>
  );
}
