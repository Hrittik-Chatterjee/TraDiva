"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

    // 2. Monitor scroll direction and speed to dynamically influence marquee speed & direction
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // self.direction is 1 when scrolling down, -1 when scrolling up
        const scrollDirection = self.direction;
        
        // Map scroll velocity to a very subtle speed multiplier (capped to a safe maximum of 1.5x speed)
        const velocity = Math.abs(self.getVelocity());
        const speedMultiplier = Math.min(1.5, 1 + velocity / 2000);

        // Smoothly adjust the timeline's playback direction and speed
        gsap.to(loopTween, {
          timeScale: scrollDirection * speedMultiplier,
          duration: 0.5,
          overwrite: "auto",
        });
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
        className="flex items-center gap-2 md:gap-3 whitespace-nowrap"
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
