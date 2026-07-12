"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { MoirangPheePattern, ManipuriGirlPlaceholder } from "@/components/shared/manipuri-patterns";

export default function CartSheet() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  const sheetRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sheet Content */}
      <div
        ref={sheetRef}
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-canvas shadow-2xl border-l border-light-pink animate-[slide-in_0.3s_ease-out]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-ink">Your Shopping Bag</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lightest-pink text-xs font-bold text-dark-pink border border-light-pink">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-light-pink bg-canvas text-stone hover:text-ink hover:bg-lightest-pink active:scale-95 transition-all cursor-pointer"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {/* Traditional Moirang Phee border spacer */}
        <MoirangPheePattern height={14} className="bg-canvas" />

        {/* Scrollable Cart Items Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="w-full max-w-[180px] aspect-[4/5] bg-lightest-pink/30 rounded-3xl border border-light-pink p-4 shadow-sm mb-6 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full max-h-[140px] animate-gentle-float">
                  <ManipuriGirlPlaceholder />
                </div>
              </div>
              <h3 className="text-base font-semibold text-ink mb-1">Your bag is empty</h3>
              <p className="text-xs text-steel max-w-[240px] leading-relaxed mb-6">
                Explore our collection of authentic, handwoven Manipuri textiles and apparel to fill your bag!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b border-lightest-pink pb-6 last:border-b-0 last:pb-0">
                  {/* Thumbnail Image */}
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-light-pink bg-lightest-pink/10">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl bg-lightest-pink/20">
                        👗
                      </div>
                    )}
                  </div>

                  {/* Item info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-ink hover:text-dark-pink transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm font-bold text-ink whitespace-nowrap">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone mt-0.5">
                        ${(item.price / 100).toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity controls & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 rounded-full border border-light-pink bg-canvas px-2.5 py-1 select-none">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-stone hover:text-ink disabled:opacity-30 font-semibold cursor-pointer text-xs px-1"
                        >
                          &minus;
                        </button>
                        <span className="text-xs font-semibold text-ink w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="text-stone hover:text-ink disabled:opacity-30 font-semibold cursor-pointer text-xs px-1"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs font-semibold text-brand-blue hover:text-dark-pink transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-light-pink bg-lightest-pink/20 px-6 py-6 space-y-4">
            <div className="space-y-1.5 text-xs text-steel">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-ink">${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-success-accent font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t border-lightest-pink pt-2.5 text-sm font-bold text-ink">
                <span>Total</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full h-11 inline-flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] cursor-pointer"
              >
                Review & Checkout
              </Link>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs font-semibold text-brand-blue hover:underline py-1 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
