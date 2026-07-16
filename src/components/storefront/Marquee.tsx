"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!marqueeRef.current) return;

    // 1. Create a continuous horizontal loop animation (moving right to left)
    const loopTween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 40,
      repeat: -1,
    });

    let currentDirection = 1;

    // 2. Monitor scroll direction to dynamically reverse marquee speed & direction
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Only update timeScale when direction changes (from 1 to -1 or vice versa)
        if (self.direction !== currentDirection) {
          currentDirection = self.direction;
          loopTween.timeScale(currentDirection);
        }
      },
    });

    return () => {
      loopTween.kill();
      trigger.kill();
    };
  }, { scope: containerRef });

  const trackItems = (
    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      <img
        src="/TraDivalogo.svg"
        alt="TraDiva Logo"
        className="h-8 md:h-8 w-auto object-contain brightness-0 invert opacity-95"
      />
      <span className="text-[max(16px,1vw)] md:text-[max(20px,2vw)] font-black leading-none">✦</span>
      <span className="text-[max(16px,1vw)] md:text-[max(20px,2vw)] font-black tracking-tight leading-none">
        Preserving the Weaving Heritage of Manipur
      </span>
      <span className="text-[max(16px,1vw)] md:text-[max(20px,2vw)] font-black leading-none">✦</span>
      <span className="text-[max(16px,1vw)] md:text-[max(20px,2vw)] font-black tracking-tight leading-none">
        Authentic Phaneks, Innaphis & Cultural Attire
      </span>
      <span className="text-[max(16px,1vw)] md:text-[max(20px,2vw)] font-black leading-none">✦</span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full bg-dark-pink text-white py-3 md:py-6 overflow-hidden select-none flex relative z-20 border-y border-white/5"
    >
      <div
        ref={marqueeRef}
        className="flex items-center gap-2 md:gap-3 whitespace-nowrap w-max will-change-transform"
      >
        {/* Render multiple tracks for a seamless, continuous infinite scroll */}
        {trackItems}
        {trackItems}
        {trackItems}
        {trackItems}
      </div>
    </div>
  );
}
