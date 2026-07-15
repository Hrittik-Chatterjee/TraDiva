"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!imageRef.current || !containerRef.current) return;

    // Scroll parallax translation: move background container downwards as we scroll down
    gsap.to(imageRef.current, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image Wrapper (taller than viewport to give headroom for animation) */}
      <div
        ref={imageRef}
        className="absolute -top-[15%] left-0 h-[130%] w-full z-0 pointer-events-none"
      >
        <Image
          src="/hero.webp"
          fill
          className="object-cover"
          priority
          alt="TraDiva Hero"
        />
      </div>

      {/* Premium Pinkish Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-dark-pink/55 to-black/45 z-10" />

      {/* Centered Content Container */}
      <div className="relative z-20 max-w-5xl px-6 flex flex-col items-center text-center text-on-primary">
        {/* Cultural Tag Badge */}
        <div className="mb-6 inline-flex items-center rounded-full bg-lightest-pink px-4 py-1.5 text-xs font-semibold text-dark-pink border border-light-pink">
          🌸 Traditional Manipuri Weaves & Attire
        </div>

        {/* Hero Title */}
        <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-[80px] font-bold leading-[1.05] tracking-tight md:tracking-[-2px] mb-6 text-on-primary uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
          Embrace the Heritage of Manipur.
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-on-primary/80 mb-10 leading-relaxed font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          Discover exquisite Phaneks, Innaphis, and handcrafted cultural products woven with love and legacy. Experience premium authenticity, directly from native Manipuri artisans.
        </p>

        {/* Action buttons (Reusing existing storefront classes) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-on-primary hover:bg-dark-pink active:scale-[0.98] transition-all"
          >
            Explore Collection
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-light-pink bg-transparent px-8 text-sm font-medium text-on-primary hover:bg-light-pink/20 active:scale-[0.98] transition-all"
          >
            Our Heritage Story
          </Link>
        </div>
      </div>
    </section>
  );
}
