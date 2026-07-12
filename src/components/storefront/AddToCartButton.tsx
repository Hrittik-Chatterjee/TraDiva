"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number; // in cents
    images: string[];
    stock: number | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] || null,
        stock: stock,
      },
      quantity
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center justify-between rounded-full border border-light-pink bg-canvas px-4 py-2 h-12 w-full sm:w-32 select-none">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="text-stone hover:text-ink disabled:opacity-30 font-semibold cursor-pointer text-lg px-2"
            type="button"
          >
            &minus;
          </button>
          <span className="font-medium text-sm text-ink">{quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= stock}
            className="text-stone hover:text-ink disabled:opacity-30 font-semibold cursor-pointer text-lg px-2"
            type="button"
          >
            +
          </button>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="flex-1 h-12 inline-flex items-center justify-center rounded-full bg-primary px-10 text-sm font-semibold text-on-primary hover:bg-dark-pink disabled:bg-stone disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
        type="button"
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
