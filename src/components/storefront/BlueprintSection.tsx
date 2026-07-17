"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StickerAsset {
  src: string;
  className: string;
  alt: string;
}

const stickerAssets: StickerAsset[] = [
  {
    src: "/popup/thing.svg",
    className: "absolute left-[4%] top-[16%] md:left-[4%] md:top-[20%] w-[80px] md:w-[130px] h-auto -rotate-12 z-20",
    alt: "Star Badge"
  },
  {
    src: "/popup/An_Icon.dfqwtppe_9OhHI.svg",
    className: "absolute left-[5%] bottom-[10%] md:bottom-auto md:top-[55%] w-[90px] md:w-[150px] h-auto rotate-6 z-20",
    alt: "Icon Badge"
  },
  {
    src: "/popup/Phanek.svg",
    className: "absolute left-[12%] top-[8%] md:left-[16%] md:top-[10%] w-[100px] md:w-[180px] h-auto -rotate-[15deg] z-20",
    alt: "Traditional Phanek Sticker"
  },
  {
    src: "/popup/chorki.svg",
    className: "absolute left-[42%] bottom-[8%] w-[110px] md:w-[130px] h-auto rotate-6 z-20",
    alt: "Spinning Wheel Badge"
  },
  {
    src: "/popup/arroba.D1T-WjYY_ZxELlA.svg",
    className: "absolute right-[4%] top-[18%] w-[90px] md:w-[140px] h-auto -rotate-6 z-20",
    alt: "@ Motif Sticker"
  },
  {
    src: "/popup/doll.svg",
    className: "absolute right-[5%] bottom-[2%] md:bottom-[10%] w-[110px] md:w-[190px] h-auto rotate-12 z-20",
    alt: "Manipuri Traditional Doll"
  },
  {
    src: "/popup/loom.svg",
    className: "absolute right-[22%] top-[6%] w-[130px] md:w-[150px] h-auto -rotate-12 z-20",
    alt: "Artisan Loom Badge"
  }
];

export default function BlueprintSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const stickers = gsap.utils.toArray(".sticker-blob");

    // Animate stickers popping out bouncy-style when the section enters the screen
    gsap.fromTo(
      stickers,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.5)",
        stagger: {
          each: 0.15,
          from: "random"
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden py-24 px-6 bg-charcoal"
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loomimage.jpg"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          alt="Weaver's loom backdrop"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Glassmorphic Core Card */}
      <div className="relative z-10 w-full max-w-4xl backdrop-blur-md bg-white/10 border border-white/15 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl flex flex-col items-center select-none">
        <div className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider border border-white/10 mb-6 w-max">
          Handloom Process
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-tight">
          The Weaver's Blueprint
        </h2>
        <p className="text-sm md:text-lg text-white/95 max-w-2xl leading-relaxed">
          A dedicated craft blueprint designed to preserve century-old Manipuri patterns while ensuring modern high-quality standards. We link local weaving artisans directly to global connoisseurs—guaranteeing authentic hand-spins, fair trade compensation, and pure cultural luxury in every thread.
        </p>
      </div>

      {/* Decorative Floating SVG Sticker Blobs */}
      {stickerAssets.map((asset, index) => (
        <div key={index} className={`sticker-blob ${asset.className}`}>
          <img
            src={asset.src}
            alt={asset.alt}
            className="w-full h-auto select-none pointer-events-none drop-shadow-2xl"
          />
        </div>
      ))}
    </section>
  );
}
