"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface StorefrontFeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number; /* in cents */
  images: string[];
  categoryName?: string | null;
  categorySlug?: string | null;
}

export default function FeaturedProducts({ products }: { products?: StorefrontFeaturedProduct[] }) {
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.images[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    categorySlug: p.categorySlug || "all",
  }));

  return (
    <section className="w-full py-16 md:py-24 px-6 bg-lightest-pink">
      <div className="page-container">
        {/* Top Header matching BlueprintSection */}
        <div className="text-center mb-12 select-none">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-ink">
            Featured Products
          </h2>
        </div>

        {/* Responsive Grid Layout (2 cols mobile, 3 cols desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {displayProducts.map((product, index) => (
            <Link
              href={`/product/${product.slug}`}
              key={product.id || index}
              className="relative rounded-[24px] md:rounded-[32px] overflow-hidden aspect-[4/3] cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500 bg-canvas"
            >
              {/* Product Background Image */}
              <Image
                src={product.image}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={index < 3}
                alt={product.name}
              />

              {/* Bottom Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent z-10" />

              {/* Bouncy Rotating Star Motif (Top-right) */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-white/90 text-2xl md:text-3xl group-hover:rotate-90 transition-transform duration-500 ease-out select-none">
                ✦
              </div>

              {/* White Text Title & Taka Price (Bottom-left) */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 text-white select-none">
                <h3 className="text-base md:text-2xl font-black uppercase tracking-tight leading-tight max-w-[90%]">
                  {product.name}
                </h3>
                {product.price > 0 && (
                  <p className="text-xs md:text-sm font-bold text-[#ffea79] mt-0.5">
                    ৳ {(product.price / 100).toLocaleString("en-BD", { minimumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-dark-pink hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out"
          >
            Explore More &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
