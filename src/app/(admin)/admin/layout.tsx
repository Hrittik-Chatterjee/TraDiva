import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = session?.user?.role === "admin";

  // Production check: Strict role guard
  if (!isDev && !isAdmin) {
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
          </nav>
        </div>

        {/* Admin Meta Data & Back Button */}
        <div className="pt-4 border-t border-light-pink flex flex-col gap-2">
          <span className="text-xs text-stone truncate font-medium">
            {session?.user?.email || "No session active"}
          </span>
          <span className="text-[10px] font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink border border-light-pink px-2.5 py-0.5 rounded-full w-max">
            {isAdmin ? "Admin Mode" : "Dev Bypass"}
          </span>
          <Link href="/" className="text-xs font-semibold text-brand-blue hover:underline mt-2">
            Back to Storefront &rarr;
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-6xl flex flex-col gap-6">
        {/* Warning Banner in Dev Mode when not an actual admin user */}
        {isDev && !isAdmin && (
          <div className="p-4 rounded-xl border border-brand-yellow bg-surface-yellow text-xs text-yellow-dark flex flex-col gap-1.5 shadow-sm">
            <span className="font-bold">⚠️ Local Dev Warning: Role Guard Bypass Active</span>
            <p>
              Your active account is not configured with the <strong>&quot;admin&quot;</strong> role in the database.
              To strictly test routing and security, run this SQL query on your database:
            </p>
            <code className="bg-canvas/50 px-2.5 py-1 rounded font-mono text-[10px] w-max select-all border border-brand-yellow/30">
              UPDATE &quot;user&quot; SET role = &apos;admin&apos; WHERE email = &apos;{session?.user?.email || "your-email"}&apos;;
            </code>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
