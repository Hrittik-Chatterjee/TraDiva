"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/components/providers/cart-provider";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const { cartCount, setIsCartOpen } = useCart();

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
        <div className="flex items-center gap-6">
          {/* Shopping Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2 text-steel hover:text-ink transition-colors cursor-pointer"
            aria-label="Open Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-dark-pink text-[9px] font-bold text-on-primary">
                {cartCount}
              </span>
            )}
          </button>

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
      </div>
    </header>
  );
}
