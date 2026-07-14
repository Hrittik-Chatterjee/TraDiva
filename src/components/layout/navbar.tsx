"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/components/providers/cart-provider";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface NavbarProps {
  categories?: Category[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to determine active link classes
  const getLinkClass = (path: string) => {
    const base = "text-sm font-medium transition-colors";
    const isActive = pathname === path;
    return isActive ? `${base} text-dark-pink font-semibold` : `${base} text-steel hover:text-ink`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent py-4 md:py-6 px-6 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left Side: Brand Logo & Desktop Nav in a unified floating pill */}
        <div className="flex items-center gap-6 bg-lightest-pink/90 backdrop-blur-md border border-light-pink rounded-full px-5 py-2.5 shadow-sm">
          <Link href="/" className="flex items-center shrink-0">
            {/* Logo Image */}
            <img
              src="/TraDivaLogo.png"
              alt="TraDiva Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 border-l border-light-pink pl-6">
            <Link href="/catalog" className={getLinkClass("/catalog")}>
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm font-medium text-steel hover:text-ink transition-colors cursor-pointer"
                aria-haspopup="true"
              >
                Categories
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-3 w-3 transition-transform group-hover:rotate-180"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-3 w-48 rounded-2xl border border-light-pink bg-canvas py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-steel hover:text-dark-pink hover:bg-lightest-pink/30 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span className="block px-4 py-2 text-xs text-stone">No categories available</span>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile hamburger menu trigger inside the pill */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex md:hidden items-center justify-center p-1 text-steel hover:text-ink transition-colors cursor-pointer"
            aria-label="Open Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Right Side: Actions (Pill action button + Circular buttons) */}
        <div className="flex items-center gap-3">
          {/* Main Action Pill (Desktop only) */}
          <div className="hidden md:block">
            {session ? (
              <Link
                href="/orders"
                className="inline-flex h-11 items-center justify-center bg-lightest-pink/90 backdrop-blur-md border border-light-pink text-ink text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm hover:border-dark-pink transition-all active:scale-[0.98]"
              >
                My Orders
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center bg-lightest-pink/90 backdrop-blur-md border border-light-pink text-ink text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm hover:border-dark-pink transition-all active:scale-[0.98]"
              >
                Sign Up
              </Link>
            )}
          </div>

          {/* Cart Circular Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="h-11 w-11 flex items-center justify-center bg-lightest-pink/90 backdrop-blur-md border border-light-pink hover:border-dark-pink text-ink rounded-full relative shadow-sm cursor-pointer transition-all active:scale-[0.95]"
            aria-label="Open Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-dark-pink text-[10px] font-bold text-on-primary shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Log In Circular Button */}
          {session ? (
            <Link
              href="/profile"
              className="h-11 w-11 flex items-center justify-center bg-brand-yellow border border-light-pink text-primary font-black rounded-full shadow-sm hover:border-dark-pink transition-all active:scale-[0.95] select-none text-sm"
              title="My Profile"
            >
              {session.user.name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link
              href="/login"
              className="h-11 w-11 flex items-center justify-center bg-lightest-pink/90 backdrop-blur-md border border-light-pink hover:border-dark-pink text-ink rounded-full shadow-sm transition-all active:scale-[0.95]"
              aria-label="Log In"
              title="Log In"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
          )}

          {/* Logout button (Desktop only, if logged in) */}
          {session && (
            <button
              onClick={() => authClient.signOut()}
              className="hidden md:inline-flex h-11 items-center justify-center bg-lightest-pink/90 backdrop-blur-md border border-light-pink hover:border-dark-pink text-ink text-xs font-semibold rounded-full px-4 shadow-sm transition-all active:scale-[0.95] cursor-pointer"
            >
              Log Out
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-canvas border-l border-light-pink p-6 shadow-2xl transition-transform duration-300 md:hidden flex flex-col justify-between ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-lightest-pink">
            <span className="font-sans font-bold text-ink">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-steel hover:text-ink cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links inside Drawer */}
          <nav className="flex flex-col gap-4">
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-steel hover:text-dark-pink transition-colors"
            >
              Shop All
            </Link>

            {/* Categories section in Drawer */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone block">
                Categories
              </span>
              <div className="pl-3 flex flex-col gap-3 border-l border-light-pink">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-medium text-steel hover:text-dark-pink transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-stone">No categories available</span>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Footer/Account actions inside Drawer */}
        <div className="border-t border-lightest-pink pt-6 space-y-4">
          {session ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-steel hover:text-dark-pink transition-colors flex items-center gap-1.5"
              >
                📦 My Orders
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-dark-pink hover:underline"
              >
                Hi, {session.user.name.split(" ")[0]}
              </Link>
              <button
                onClick={() => {
                  authClient.signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full h-10 inline-flex items-center justify-center rounded-full bg-lightest-pink text-xs font-semibold text-dark-pink hover:bg-light-pink transition-all active:scale-[0.98]"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-10 inline-flex items-center justify-center rounded-full border border-light-pink text-xs font-semibold text-ink hover:bg-lightest-pink transition-all active:scale-[0.98]"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-10 inline-flex items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
