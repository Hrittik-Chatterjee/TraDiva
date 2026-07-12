"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { ManipuriGirlPlaceholder } from "@/components/shared/manipuri-patterns";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  return (
    <div className="bg-canvas py-12 px-6 md:px-8 flex-1 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col">
        {/* Page Header */}
        <div className="mb-12 border-b border-lightest-pink pb-8">
          <h1 className="text-4xl font-medium tracking-tight mb-2">Shopping Bag</h1>
          <p className="text-steel text-sm max-w-112">
            Please review the items in your bag before proceeding to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-full max-w-55 aspect-4/5 bg-lightest-pink/30 rounded-3xl border border-light-pink p-6 shadow-sm mb-8 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full max-h-45 animate-gentle-float">
                <ManipuriGirlPlaceholder />
              </div>
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">Your shopping bag is empty</h2>
            <p className="text-sm text-steel max-w-80 leading-relaxed mb-8">
              Looks like you haven&apos;t added any traditional Manipuri attire to your bag yet.
            </p>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98]"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-light-pink rounded-3xl overflow-hidden bg-canvas">
                <div className="p-6 md:p-8 space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-lightest-pink last:border-b-0 last:pb-0"
                    >
                      {/* Product Thumbnail */}
                      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-light-pink bg-lightest-pink/10 mx-auto sm:mx-0">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-4xl bg-lightest-pink/20">
                            👗
                          </div>
                        )}
                      </div>

                      {/* Details & Actions */}
                      <div className="flex flex-1 flex-col justify-between text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start gap-2">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              className="text-lg font-semibold text-ink hover:text-dark-pink transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-stone mt-1">
                              Unit Price: ${(item.price / 100).toFixed(2)}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-ink">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </span>
                        </div>

                        {/* Controls bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 rounded-full border border-light-pink bg-canvas px-3.5 py-1.5 select-none w-max">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="text-stone hover:text-ink disabled:opacity-30 font-semibold cursor-pointer text-sm px-1.5"
                              type="button"
                            >
                              &minus;
                            </button>
                            <span className="text-sm font-semibold text-ink w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="text-stone hover:text-ink disabled:opacity-30 font-semibold cursor-pointer text-sm px-1.5"
                              type="button"
                            >
                              +
                            </button>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-sm font-semibold text-brand-blue hover:text-dark-pink transition-colors cursor-pointer"
                            type="button"
                          >
                            Remove Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary panel */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="border border-light-pink rounded-3xl bg-lightest-pink/15 p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-bold text-ink border-b border-light-pink pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm text-steel">
                  <div className="flex justify-between">
                    <span>Items Total ({cartCount})</span>
                    <span className="font-semibold text-ink">${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-success-accent font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-light-pink pt-4 text-base font-bold text-ink">
                    <span>Order Total</span>
                    <span>${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {/* Mock checkout redirection */}
                  <Link
                    href="/checkout"
                    className="w-full h-12 inline-flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/catalog"
                    className="w-full h-12 inline-flex items-center justify-center rounded-full border border-light-pink bg-canvas text-sm font-semibold text-ink hover:bg-lightest-pink/40 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
