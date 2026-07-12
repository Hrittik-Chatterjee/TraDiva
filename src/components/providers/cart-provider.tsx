"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import posthog from "posthog-js";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number; // in cents
  image: string | null;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage (only run client-side once mounted)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("tradiva_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Defer state update to prevent synchronous setState inside useEffect warning
        setTimeout(() => {
          setCartItems(parsed);
          setIsInitialized(true);
        }, 0);
        return;
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setTimeout(() => {
      setIsInitialized(true);
    }, 0);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("tradiva_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product: Omit<CartItem, "quantity">, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.productId);
      
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        
        posthog.capture("cart_update_quantity", {
          productId: product.productId,
          name: product.name,
          oldQuantity: existingItem.quantity,
          newQuantity,
        });

        return prevItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        const finalQuantity = Math.min(quantity, product.stock);
        
        posthog.capture("cart_add_item", {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: finalQuantity,
        });

        return [...prevItems, { ...product, quantity: finalQuantity }];
      }
    });
    
    // Automatically open the cart sheet on add
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find((item) => item.productId === productId);
    if (itemToRemove) {
      posthog.capture("cart_remove_item", {
        productId,
        name: itemToRemove.name,
      });
    }

    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          const finalQuantity = Math.max(1, Math.min(quantity, item.stock));
          
          posthog.capture("cart_update_quantity", {
            productId,
            name: item.name,
            oldQuantity: item.quantity,
            newQuantity: finalQuantity,
          });

          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Derive cart aggregations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Track cart view when it is opened
  useEffect(() => {
    if (isCartOpen) {
      posthog.capture("cart_view", {
        itemCount: cartCount,
        totalValue: cartTotal / 100,
      });
    }
  }, [isCartOpen, cartCount, cartTotal]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
