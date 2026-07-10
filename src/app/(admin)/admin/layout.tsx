import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Strict route protection: Admin role required
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-canvas text-primary">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-light-pink bg-lightest-pink/30 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Brand Wordmark */}
          <Link href="/admin" className="block mb-8 text-xl font-bold tracking-tight text-dark-pink">
            TraDiva Admin
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-lightest-pink/50 transition-colors font-medium text-sm text-ink"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-lightest-pink/50 transition-colors font-medium text-sm text-ink"
            >
              🛍️ Products
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-lightest-pink/50 transition-colors font-medium text-sm text-ink"
            >
              🏷️ Categories
            </Link>
            <Link
              href="/admin/brands"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-lightest-pink/50 transition-colors font-medium text-sm text-ink"
            >
              ✨ Brands
            </Link>
          </nav>
        </div>

        {/* Admin Meta Data & Back Button */}
        <div className="pt-4 border-t border-light-pink flex flex-col gap-2">
          <span className="text-xs text-stone truncate font-medium">{session.user.email}</span>
          <span className="text-[10px] font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink border border-light-pink px-2.5 py-0.5 rounded-full w-max">
            Admin Mode
          </span>
          <Link href="/" className="text-xs font-semibold text-brand-blue hover:underline mt-2">
            Back to Storefront &rarr;
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  );
}
