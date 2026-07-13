"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { createOrderAction } from "@/app/actions/order";
import { MoirangPheePattern } from "@/components/shared/manipuri-patterns";
import posthog from "posthog-js";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchError = searchParams.get("error");
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shipping Address State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [phone, setPhone] = useState("");

  // Load session user if available
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/get-session");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setEmail(data.user.email || "");
            setName(data.user.name || "");
          }
        }
      } catch (err) {
        console.error("Failed to load user session info:", err);
      }
    }
    loadSession();

    posthog.capture("checkout_initiated", {
      cartTotal,
      itemsCount: cartItems.length,
    });
  }, [cartTotal, cartItems.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      checkoutData: {
        email,
        name,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
        phone,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const res = await createOrderAction(payload);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else if (res.success && res.orderId) {
      // Redirect directly to the bKash payment gateway initializer endpoint
      window.location.href = `/api/bkash/create?orderId=${res.orderId}`;
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-canvas py-20 px-6 text-center flex-1 flex flex-col justify-center items-center">
        <span className="text-5xl mb-4 block">👜</span>
        <h2 className="text-xl font-bold text-ink mb-2">Your cart is empty</h2>
        <p className="text-sm text-steel mb-8 max-w-[360px]">
          Add some authentic heritage items to your bag before trying to checkout!
        </p>
        <Link
          href="/catalog"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-canvas py-12 px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 border-b border-lightest-pink pb-6">
          <h1 className="text-4xl font-medium tracking-tight mb-2">Secure Checkout</h1>
          <p className="text-steel text-sm max-w-[448px]">
            Please enter your delivery address and pay securely via bKash.
          </p>
        </div>

        {/* Error Alert */}
        {(error || searchError) && (
          <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error || searchError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Address */}
            <div className="border border-light-pink p-6 md:p-8 rounded-3xl bg-canvas space-y-6">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <span>📍</span> Delivery Address
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hrittik Chatterjee"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="line1" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="line1"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="e.g. 123 Main Street"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="line2" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    id="line2"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="e.g. Apt 4B"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Imphal"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    id="state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Manipur"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 795001"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* bKash Payment */}
            <div className="border border-light-pink p-6 md:p-8 rounded-3xl bg-canvas space-y-6">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <span className="text-xl">🌸</span> bKash Mobile Payment
              </h3>
              
              <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-white border border-light-pink rounded-2xl">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-[#e2136e] rounded-2xl text-white font-black text-lg shadow-sm font-sans tracking-wide">
                  bKash
                </div>
                <div>
                  <h4 className="font-bold text-sm text-ink">Pay with bKash Account</h4>
                  <p className="text-xs text-stone mt-1 leading-relaxed">
                    You will be securely redirected to bKash's official portal to authorize your payment using your bKash mobile wallet number, OTP, and PIN.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="border border-light-pink rounded-3xl bg-canvas overflow-hidden">
              <div className="px-6 py-5 border-b border-lightest-pink bg-lightest-pink/10">
                <span className="text-xs font-bold text-dark-pink uppercase tracking-widest">Order Summary</span>
              </div>
              <MoirangPheePattern height={10} className="bg-canvas" />

              <div className="p-6 space-y-4">
                {/* Scrollable list of items */}
                <div className="max-h-60 overflow-y-auto space-y-4 pr-1 divide-y divide-lightest-pink">
                  {cartItems.map((item, idx) => (
                    <div key={item.productId} className={`flex gap-4 ${idx > 0 ? "pt-4" : ""}`}>
                      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-light-pink bg-lightest-pink/10">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl bg-lightest-pink/20">👗</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-ink truncate">{item.name}</h4>
                        <p className="text-xs text-stone mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-ink">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-lightest-pink pt-4 space-y-2 text-sm text-steel">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-success-accent font-semibold">Free Delivery</span>
                  </div>
                  <div className="flex justify-between border-t border-light-pink pt-4 text-ink">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-lg">${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl border border-brand-red bg-brand-red/10 text-xs font-semibold text-brand-red-dark">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 inline-flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] disabled:bg-stone disabled:cursor-not-allowed mt-4 cursor-pointer"
                >
                  {loading ? "Processing Order..." : `Pay ৳ ${(cartTotal / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </button>
              </div>
            </div>

            <div className="text-center">
              <Link href="/cart" className="text-xs text-brand-blue hover:underline">
                &larr; Back to Shopping Bag
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-pink"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
