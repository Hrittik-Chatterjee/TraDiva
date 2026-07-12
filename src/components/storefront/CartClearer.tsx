"use client";

import { useEffect } from "react";
import { useCart } from "@/components/providers/cart-provider";

export default function CartClearer() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
