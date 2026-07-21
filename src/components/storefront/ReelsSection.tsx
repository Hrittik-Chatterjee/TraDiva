"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// Register Draggable on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

export interface StorefrontReel {
  id?: string;
  title: string;
  tagline: string;
  imageUrl: string;
  videoUrl: string;
  categorySlug: string;
}

const defaultFeaturedReels: StorefrontReel[] = [
  {
    title: "TraDiva Silk",
    tagline: "#HandspunLuxury",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "saree"
  },
  {
    title: "Moirang Weaves",
    tagline: "#ArtisanPride",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "innaphi"
  },
  {
    title: "Saree Stories",
    tagline: "#CulturalLegacy",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "saree"
  },
  {
    title: "Innaphi Aura",
    tagline: "#ManipuriThreads",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "innaphi"
  },
  {
    title: "Heritage Urna",
    tagline: "#ArtistryInEveryWeave",
    imageUrl: "https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "urna"
  }
];

export default function ReelsSection({ reels }: { reels?: StorefrontReel[] }) {
  const activeReels = reels && reels.length > 0 ? reels : defaultFeaturedReels;
  const originalLength = activeReels.length;

  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const draggableInstance = useRef<{ kill: () => void }[] | null>(null);
  
  // 3 repeats of the cards to act as an infinite horizontal scrolling buffer
  const itemsWithClones = [
    ...activeReels,
    ...activeReels,
    ...activeReels
  ];

  const [leftActiveIndex, setLeftActiveIndex] = useState(0); // Active index on leftmost focus (0 to 4)
  const [isDraggingState, setIsDraggingState] = useState(false); // Blocks link clicks during drag
  const [cardWidth, setCardWidth] = useState(300);

  // Playhead offset and progress timeline reference
  const playheadRef = useRef({ offset: 0 });
  const loopTimeline = useRef<gsap.core.Timeline | null>(null);
  const dragHistory = useRef<{ x: number; time: number }[]>([]);

  const updateCardWidth = () => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector(".reel-card");
    if (card) {
      setCardWidth(card.clientWidth);
    }
  };

  // Sync widths and basic sizes on load and resize
  useEffect(() => {
    updateCardWidth();
    const timer = setTimeout(updateCardWidth, 100);
    window.addEventListener("resize", updateCardWidth);
    return () => {
      window.removeEventListener("resize", updateCardWidth);
      clearTimeout(timer);
    };
  }, []);

  // Update card shading overlay calculations dynamically based on coordinates
  const updateShadesAndCounter = useCallback((progress: number) => {
    const spacing = 1 / originalLength; // 0.2
    const rawIndex = Math.round(progress / spacing);
    const activeIdx = ((rawIndex % originalLength) + originalLength) % originalLength; // 0 to 4
    setLeftActiveIndex(activeIdx);
  }, []);

  // Instantiate Timeline and Draggable
  useEffect(() => {
    if (!trackRef.current || !proxyRef.current || !trackWrapperRef.current) return;

    const cardSlotWidth = cardWidth + 24;
    const cycleWidth = originalLength * cardSlotWidth; // Width of 1 cycle (5 cards)

    // 1. Pause timeline translating track from 0 to -cycleWidth
    loopTimeline.current = gsap.timeline({ paused: true, repeat: -1 });
    loopTimeline.current.to(trackRef.current, {
      x: -cycleWidth,
      duration: 1,
      ease: "none"
    });

    // Destroy existing Draggable instance if any
    if (draggableInstance.current) {
      draggableInstance.current[0].kill();
    }

    // 2. Setup Draggable on hidden proxy element with NO BOUNDS
    draggableInstance.current = Draggable.create(proxyRef.current, {
      type: "x",
      trigger: trackWrapperRef.current, // drag anywhere on the track
      dragClickables: false,
      onPress: function () {
        gsap.killTweensOf(playheadRef.current); // Stop active snap glides instantly
        this.startOffset = playheadRef.current.offset;
        setIsDraggingState(true);
        dragHistory.current = [{ x: this.x, time: Date.now() }];
      },
      onDrag: function () {
        const now = Date.now();
        dragHistory.current.push({ x: this.x, time: now });
        dragHistory.current = dragHistory.current.filter(item => now - item.time < 100);

        // Convert pixel drag displacement to timeline progress offset
        const deltaX = this.x - this.startX;
        playheadRef.current.offset = this.startOffset - deltaX / cycleWidth;

        // Apply progress with seamless wrapping
        if (loopTimeline.current) {
          const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
          loopTimeline.current.progress(wrappedTime);
          updateShadesAndCounter(wrappedTime);
        }
      },
      onRelease: function () {
        setTimeout(() => {
          setIsDraggingState(false);
        }, 50);
      },
      onDragEnd: function () {
        const history = dragHistory.current;
        let pixelVelocity = 0;
        if (history.length > 1) {
          const oldest = history[0];
          const newest = history[history.length - 1];
          const timeDiff = newest.time - oldest.time;
          if (timeDiff > 0) {
            pixelVelocity = ((newest.x - oldest.x) / timeDiff) * 1000; // px/sec
          }
        }

        const progressVelocity = pixelVelocity / cycleWidth; // progress units per second

        // Momentum snap projection
        const momentumFactor = 0.8; // friction length multiplier
        const projectedOffset = playheadRef.current.offset - (progressVelocity * momentumFactor);

        const spacing = 1 / originalLength; // 0.2
        const targetOffset = Math.round(projectedOffset / spacing) * spacing;

        // Glide speed duration proportional to release flick velocity
        const animDuration = Math.max(0.4, Math.min(1.2, Math.abs(progressVelocity) * 0.6));

        gsap.to(playheadRef.current, {
          offset: targetOffset,
          duration: animDuration,
          ease: "power4.out", // Fast glide, gradual friction deceleration
          onUpdate: function () {
            if (loopTimeline.current) {
              const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
              loopTimeline.current.progress(wrappedTime);
              updateShadesAndCounter(wrappedTime);
            }
          }
        });
      }
    });

    // Set initial position based on playhead offset
    const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
    loopTimeline.current.progress(wrappedTime);
    updateShadesAndCounter(wrappedTime);

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current[0].kill();
      }
      if (loopTimeline.current) {
        loopTimeline.current.kill();
      }
    };
  }, [cardWidth, updateShadesAndCounter]); // Only rebuilds timeline metrics on resize

  const slideTo = (targetOffset: number) => {
    gsap.killTweensOf(playheadRef.current);

    gsap.to(playheadRef.current, {
      offset: targetOffset,
      duration: 0.5,
      ease: "power3.out",
      onUpdate: function () {
        if (loopTimeline.current) {
          const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
          loopTimeline.current.progress(wrappedTime);
          updateShadesAndCounter(wrappedTime);
        }
      }
    });
  };

  const scrollLeftAction = () => {
    const spacing = 1 / originalLength;
    const currentSnapped = Math.round(playheadRef.current.offset / spacing) * spacing;
    slideTo(currentSnapped - spacing);
  };

  const scrollRightAction = () => {
    const spacing = 1 / originalLength;
    const currentSnapped = Math.round(playheadRef.current.offset / spacing) * spacing;
    slideTo(currentSnapped + spacing);
  };

  const activeIndexStr = String(leftActiveIndex + 1).padStart(2, "0");
  const totalSlidesStr = String(originalLength).padStart(2, "0");

  return (
    <section className="w-full py-16 md:py-24 px-6 bg-canvas overflow-hidden relative">
      <div className="page-container">
        
        {/* Hidden drag proxy element */}
        <div ref={proxyRef} className="invisible absolute pointer-events-none" />

        {/* Header Layout (Title left, Description right) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 select-none">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-dark-pink leading-none">
              Woven by <br /> Hand & Heart
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-xs md:text-sm font-semibold text-dark-pink/80 leading-relaxed">
              We capture every thread of our heritage storytelling, sharing the authentic artisan journeys that connect you directly to Manipuri cultural luxury.
            </p>
          </div>
        </div>

        {/* Slider Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          
          {/* Controls & Index Indicator (Left on desktop) */}
          <div className="w-full md:w-[220px] flex-shrink-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-6 select-none">
            <div className="flex flex-col">
              <div className="text-5xl md:text-6xl font-black text-dark-pink tracking-tight flex items-baseline">
                <span>{activeIndexStr}</span>
                <span className="text-3xl md:text-4xl text-dark-pink/40 mx-2">/</span>
                <span className="text-3xl md:text-4xl text-dark-pink/40">{totalSlidesStr}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={scrollLeftAction}
                className="w-12 h-12 rounded-full bg-dark-pink flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer shadow-md"
                aria-label="Previous Slide"
              >
                &larr;
              </button>
              <button
                onClick={scrollRightAction}
                className="w-12 h-12 rounded-full bg-dark-pink flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer shadow-md"
                aria-label="Next Slide"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Scrolling Reels Track Wrapper */}
          <div ref={trackWrapperRef} className="flex-grow overflow-hidden select-none cursor-grab active:cursor-grabbing">
            {/* Translated Slider Track */}
            <div 
              ref={trackRef}
              className="flex gap-6"
            >
              {itemsWithClones.map((reel, index) => {
                // Loop-aware index distance mapping (relative to current active index)
                const dist = (index - leftActiveIndex + 15) % originalLength;

                return (
                  <div
                    key={index}
                    className="reel-card w-[260px] md:w-[300px] aspect-[9/16] flex-shrink-0 rounded-[32px] overflow-hidden relative group shadow-md hover:shadow-xl transition-all duration-500 bg-white"
                  >
                    {/* Background Preview Image */}
                    <Image
                      src={reel.imageUrl}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none select-none"
                      sizes="(max-width: 768px) 260px, 300px"
                      alt={reel.title}
                      draggable="false"
                    />

                    {/* Active Card Loop Video Overlay */}
                    {dist === 0 && (
                      <video
                        src={reel.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                      />
                    )}

                    {/* Bottom Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent z-10" />

                    {/* Translucent White Shade Overlay (No CSS transition property to avoid animation overhead and lag) */}
                    <div 
                      className={`absolute inset-0 bg-white z-15 pointer-events-none ${
                        dist === 0 
                          ? "opacity-0" 
                          : dist === 1 
                            ? "opacity-35" 
                            : "opacity-75"
                      }`}
                    />

                    {/* Star Icon (Top-right) - only visible on active card */}
                    <div 
                      className={`absolute top-5 right-5 z-20 text-white/90 text-2xl select-none transition-all duration-500 ${
                        dist === 0 
                          ? "opacity-100 rotate-0 group-hover:rotate-90" 
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      ✦
                    </div>

                    {/* Text & Button Overlay (Bottom-left) - only visible on active card */}
                    <div 
                      className={`absolute bottom-6 left-6 right-6 z-20 text-white select-none transition-all duration-500 ${
                        dist === 0 
                          ? "opacity-100 translate-y-0" 
                          : "opacity-0 translate-y-6 pointer-events-none"
                      }`}
                    >
                      <span className="text-[#ffea79] text-xl md:text-2xl font-black uppercase tracking-tight block leading-tight mb-1">
                        {reel.title}
                      </span>
                      <span className="text-white/90 text-xs md:text-sm font-bold block mb-4">
                        {reel.tagline}
                      </span>
                      
                      <Link
                        href={reel.categorySlug === "all" ? "/catalog" : `/catalog?category=${reel.categorySlug}`}
                        className={`inline-block bg-[#ffea79] text-black font-bold text-xs md:text-sm px-6 py-2 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out ${
                          isDraggingState ? "pointer-events-none" : ""
                        }`}
                      >
                        Shop Look
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
