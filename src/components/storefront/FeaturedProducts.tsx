"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductMock {
  title: string;
  image: string;
  category: string;
}

const featuredProducts: ProductMock[] = [
  {
    title: "Mayang Silk Saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    category: "saree"
  },
  {
    title: "Royal Phanek Maphal",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop",
    category: "phanek"
  },
  {
    title: "Moirang Phee Innaphi",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
    category: "innaphi"
  },
  {
    title: "Embroidered Urna",
    image: "https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop",
    category: "urna"
  },
  {
    title: "Golden Brocade Saree",
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=600&auto=format&fit=crop",
    category: "saree"
  },
  {
    title: "Handspun Silk Shawl",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    category: "innaphi"
  }
];

export default function FeaturedProducts() {
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
          {featuredProducts.map((product, index) => (
            <Link
              href={`/catalog?category=${product.category}`}
              key={index}
              className="relative rounded-[24px] md:rounded-[32px] overflow-hidden aspect-[4/3] cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500 bg-canvas"
            >
              {/* Product Background Image */}
              <Image
                src={product.image}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={index < 3}
                alt={product.title}
              />

              {/* Bottom Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent z-10" />

              {/* Bouncy Rotating Star Motif (Top-right) */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-white/90 text-2xl md:text-3xl group-hover:rotate-90 transition-transform duration-500 ease-out select-none">
                ✦
              </div>

              {/* White Text Title (Bottom-left) */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 text-white select-none">
                <h3 className="text-base md:text-3xl font-black uppercase tracking-tight leading-tight max-w-[85%]">
                  {product.title}
                </h3>
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
