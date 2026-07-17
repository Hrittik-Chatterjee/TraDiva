"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Register useGSAP
gsap.registerPlugin(useGSAP);

interface Category {
  id: number;
  title: string;
  image: string;
  hoverTitle: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const categories: Category[] = [
  {
    id: 0,
    title: "Saree",
    image: "/Saree.jpg",
    hoverTitle: "Manipuri Silk Sarees",
    description: "Exquisite handwoven silk sarees decorated with traditional temple borders and intricate gold floral work.",
    bgColor: "oklch(77.8% 0.149 354.2)",
    textColor: "oklch(48.4% 0.174 358.7)",
  },
  {
    id: 1,
    title: "Urna",
    image: "/urna.jpg",
    hoverTitle: "Traditional Dupattas",
    description: "Delicate and lightweight stoles featuring handwoven Manipuri motifs and elegant border designs.",
    bgColor: "oklch(79.4% 0.111 303.9)",
    textColor: "oklch(29.2% 0.101 288.7)",
  },
  {
    id: 2,
    title: "Innaphi",
    image: "/Inaphi.jpg",
    hoverTitle: "Moirang Phee Shawls",
    description: "Semi-translucent traditional shawls featuring the iconic hand-loomed Moirang Phee temple motifs.",
    bgColor: "oklch(94.6% 0.141 104.4)",
    textColor: "oklch(68.8% 0.121 96.1)",
  },
  {
    id: 3,
    title: "Phanek",
    image: "/Phanek.jpg",
    hoverTitle: "Phanek Maphals",
    description: "Striped wrap skirts woven in premium cotton or silk, finished with hand-embroidered border patterns.",
    bgColor: "oklch(82.2% 0.073 246.3)",
    textColor: "oklch(29.1% 0.101 287.8)",
  }
];

export default function CulturalCategories() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Maintain local display state to swap text midway through transition
  const [displayTitle, setDisplayTitle] = useState("Shop Cultural Masterpieces");

  useGSAP(() => {
    if (!titleRef.current) return;

    const targetTitle = activeIndex !== null 
      ? categories[activeIndex].hoverTitle 
      : "Shop Cultural Masterpieces";

    // Only run animation if content is changing
    if (displayTitle === targetTitle) return;

    const tl = gsap.timeline();

    // 1. Slide up and fade out previous text
    tl.to(titleRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        // Swap text contents
        setDisplayTitle(targetTitle);
        // Position new text below the frame
        gsap.set(titleRef.current, { y: 30 });
      }
    });

    // 2. Slide up and fade in new text
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out"
    });
  }, [activeIndex]);

  const activeBgColor = activeIndex !== null 
    ? categories[activeIndex].bgColor 
    : "oklch(97.7% 0.011 31.1)"; // Default canvas color

  const activeTextColor = activeIndex !== null 
    ? categories[activeIndex].textColor 
    : "oklch(24.5% 0.008 17.7)"; // Default ink color

  return (
    <section 
      ref={containerRef}
      className="w-full py-2 md:py-4 transition-colors duration-500 ease-out"
      style={{ backgroundColor: activeBgColor }}
    >
      <div className="page-container px-6">
        {/* Animated Heading Section with Clip Mask */}
        <div className="text-center mb-16 flex flex-col items-center select-none">
          <div className="overflow-hidden py-1 h-[48px] md:h-[60px] flex items-center justify-center">
            <h2 
              ref={titleRef} 
              className="text-3xl md:text-5xl font-black uppercase tracking-tight transition-colors duration-500 ease-out"
              style={{ color: activeTextColor }}
            >
              {displayTitle}
            </h2>
          </div>
        </div>

        {/* Categories Flex Grid */}
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 min-h-[480px]">
          {categories.map((cat) => {
            const isActive = activeIndex === cat.id;
            const isAnyActive = activeIndex !== null;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveIndex(cat.id)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(isActive ? null : cat.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out group flex-1
                  ${isActive ? "md:flex-[3.5] shadow-2xl" : ""}
                  ${isAnyActive && !isActive ? "md:flex-[0.7] opacity-65 md:opacity-85" : ""}
                  aspect-[4/3] md:aspect-auto min-h-[220px] md:min-h-none
                `}
              >
                {/* Background Category Image */}
                <Image
                  src={cat.image}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority
                  alt={cat.title}
                />

                {/* Default Title Overlay (Bottom-left) */}
                <div 
                  className={`absolute bottom-6 left-6 z-10 text-white font-black text-2xl tracking-wide uppercase transition-all duration-500
                    ${isActive ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
                  `}
                >
                  {cat.title}
                </div>

                {/* Hover/Active Frosted Glassmorphic Overlay */}
                <div 
                  className={`absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col justify-end p-8 text-white transition-all duration-500 z-20
                    ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                  `}
                >
                  <h3 className="text-2xl md:text-3xl font-black uppercase mb-3 tracking-wide">
                    {cat.hoverTitle}
                  </h3>
                  <p className="text-xs md:text-sm text-white/95 leading-relaxed font-medium max-w-xl">
                    {cat.description}
                  </p>
                  
                  <Link 
                    href={`/catalog?category=${cat.title.toLowerCase()}`}
                    className="mt-6 inline-flex w-max items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-bold text-ink hover:bg-brand-yellow hover:text-ink active:scale-[0.98] transition-all"
                  >
                    Explore Collection &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
