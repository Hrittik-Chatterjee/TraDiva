"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { ManipuriGirlPlaceholder, MoirangPheePattern } from "@/components/shared/manipuri-patterns";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Elegant slide up & fade in entrance for hero components
    gsap.from(".hero-badge", {
      opacity: 0,
      y: -15,
      duration: 0.6,
      ease: "power2.out",
    });
    
    gsap.from(".hero-title", {
      opacity: 0,
      y: 25,
      duration: 0.8,
      delay: 0.15,
      ease: "power3.out",
    });
    
    gsap.from(".hero-desc", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      delay: 0.3,
      ease: "power2.out",
    });
    
    gsap.from(".hero-actions", {
      opacity: 0,
      y: 15,
      duration: 0.7,
      delay: 0.45,
      ease: "power2.out",
    });
    
    gsap.from(".hero-image", {
      opacity: 0,
      scale: 0.96,
      duration: 1.0,
      delay: 0.25,
      ease: "power2.out",
    });

    // Animate Category cards on scroll/appear slightly later
    gsap.from(".category-card", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.6,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center bg-canvas">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Brand Text & CTAs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Cultural Tag Badge */}
          <div className="hero-badge mb-6 inline-flex items-center rounded-full bg-lightest-pink px-4 py-1.5 text-xs font-semibold text-dark-pink border border-light-pink">
            🌸 Traditional Manipuri Weaves & Attire
          </div>
 
          {/* Hero Title (80px display, tight leading) */}
          <h1 className="hero-title max-w-3xl text-4xl sm:text-6xl md:text-[76px] font-medium leading-[1.05] tracking-tight md:tracking-[-2px] text-ink mb-6">
            Embrace the Heritage of Manipur.
          </h1>
 
          {/* Hero Subtitle */}
          <p className="hero-desc max-w-144 text-lg text-steel mb-10 leading-relaxed">
            Discover exquisite Phaneks, Innaphis, and handcrafted cultural products woven with love and legacy. Experience premium authenticity, directly from native Manipuri artisans.
          </p>
 
          {/* Action buttons with black-pill style and pink borders */}
          <div className="hero-actions flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-on-primary hover:bg-dark-pink active:scale-[0.98] transition-all"
            >
              Explore Collection
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-light-pink bg-transparent px-8 text-sm font-medium text-ink hover:bg-lightest-pink active:scale-[0.98] transition-all"
            >
              Our Heritage Story
            </Link>
          </div>
        </div>
 
        {/* Right Side: Animated Manipuri Cartoon Character Frame (5 cols) */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="hero-image relative w-full max-w-85 aspect-4/5 rounded-3xl border border-light-pink bg-lightest-pink/40 p-6 shadow-sm flex flex-col justify-between items-center overflow-hidden">
            {/* Traditional Pattern Decorative Corner Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow"></div>
            
            {/* The Floating Cartoon Illustration */}
            <div className="w-full h-full max-h-65 animate-gentle-float">
              <ManipuriGirlPlaceholder />
            </div>
 
            {/* Sub-label describing the character attire */}
            <div className="text-center mt-2 z-10">
              <span className="text-[11px] font-bold tracking-wider text-dark-pink uppercase bg-canvas border border-light-pink px-3 py-1 rounded-full">
                Wearing Phanek & Innaphi
              </span>
            </div>
          </div>
        </div>
      </section>
 
      {/* Repeating Traditional Pattern Divider */}
      <MoirangPheePattern height={24} className="bg-canvas my-8" />
 
      {/* Featured Categories / Cultural Highlights */}
      <section className="w-full max-w-7xl px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-ink mb-3">Shop Cultural Masterpieces</h2>
          <p className="text-steel max-w-112 mx-auto text-sm">Every garment carries centuries of traditional motifs and spiritual weaving heritage.</p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Phanek */}
          <div className="category-card group rounded-2xl border border-light-pink bg-canvas p-6 flex flex-col justify-between aspect-4/3 hover:border-dark-pink hover:bg-lightest-pink/20 transition-all cursor-pointer">
            <div>
              <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink px-2.5 py-1 rounded">Phanek</span>
              <h3 className="text-xl font-semibold text-ink mt-3">Striped Phanek Maphal</h3>
              <p className="text-stone text-xs mt-1">Traditional wrap skirts woven in pure mulberry silk with signature borders.</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-lightest-pink group-hover:border-light-pink transition-all">
              <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Designs &rarr;</span>
              <span className="text-xs font-bold text-ink">From $89</span>
            </div>
          </div>
 
          {/* Card 2: Innaphi */}
          <div className="category-card group rounded-2xl border border-light-pink bg-canvas p-6 flex flex-col justify-between aspect-4/3 hover:border-dark-pink hover:bg-lightest-pink/20 transition-all cursor-pointer">
            <div>
              <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink px-2.5 py-1 rounded">Innaphi</span>
              <h3 className="text-xl font-semibold text-ink mt-3">Moirang Phee Shawls</h3>
              <p className="text-stone text-xs mt-1">Exquisite semi-translucent shawls featuring handwoven temple border motifs.</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-lightest-pink group-hover:border-light-pink transition-all">
              <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Designs &rarr;</span>
              <span className="text-xs font-bold text-ink">From $120</span>
            </div>
          </div>
 
          {/* Card 3: Headgear & Accessories */}
          <div className="category-card group rounded-2xl border border-light-pink bg-canvas p-6 flex flex-col justify-between aspect-4/3 hover:border-dark-pink hover:bg-lightest-pink/20 transition-all cursor-pointer">
            <div>
              <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink px-2.5 py-1 rounded">Accessories</span>
              <h3 className="text-xl font-semibold text-ink mt-3">Kajenglei & Bridal Ornaments</h3>
              <p className="text-stone text-xs mt-1">Bridal circular crowns, necklaces, and traditional jewelry sets.</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-lightest-pink group-hover:border-light-pink transition-all">
              <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Designs &rarr;</span>
              <span className="text-xs font-bold text-ink">From $45</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
