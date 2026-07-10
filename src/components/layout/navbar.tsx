"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            {/* Canary yellow brand signature logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-yellow font-sans text-xl font-bold tracking-tighter text-primary">
              TD
            </div>
            <span className="font-sans text-2xl font-bold tracking-tight text-ink">
              TraDiva
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/catalog"
              className="text-sm font-medium text-steel hover:text-ink transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-steel hover:text-ink transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/brands"
              className="text-sm font-medium text-steel hover:text-ink transition-colors"
            >
              Brands
            </Link>
          </nav>
        </div>

        {/* Right Side: Auth Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/account"
                className="text-sm font-medium text-steel hover:text-ink transition-colors"
              >
                Hi, {session.user.name.split(" ")[0]}
              </Link>
              <button
                onClick={() => authClient.signOut()}
                className="text-sm font-medium text-steel hover:text-ink cursor-pointer transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-steel hover:text-ink transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary hover:bg-charcoal transition-all active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
