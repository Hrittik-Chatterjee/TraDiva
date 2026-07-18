"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// Register Draggable on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "The craftsmanship of the Phanek is absolutely breathtaking. You can feel the heritage and care in every single thread. Highly recommended!",
    name: "Emily Watson",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "Finally, a store that brings authentic Manipuri weaves to the global stage. The Innaphi has a beautiful luster and drape. A joy to wear!",
    name: "Jessica Li",
    location: "San Francisco, USA",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "Stunning colors and premium texture. The Muga Silk Saree I ordered exceeded all my expectations. The shipping was fast and packaging was lovely.",
    name: "Priya Sharma",
    location: "New Delhi, India",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "Exceptional customer service and gorgeous handloom artistry. TraDiva connects us directly with native weavers, preserving culture with luxury.",
    name: "David Thorne",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "As a local, I am proud to see our traditional weaves presented so elegantly. The quality of the handspun silk matches the finest native standards.",
    name: "Laishram Tomba",
    location: "Imphal, Manipur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  }
];

const originalLength = testimonials.length; // 5

export default function TestimonialsSection() {
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const draggableInstance = useRef<{ kill: () => void }[] | null>(null);

  // 3 repeats to act as an infinite horizontal scrolling buffer
  const itemsWithClones = [
    ...testimonials, // 0 - 4
    ...testimonials, // 5 - 9
    ...testimonials  // 10 - 14
  ];

  const [cardWidth, setCardWidth] = useState(380);
  const [gapWidth, setGapWidth] = useState(24);

  // Playhead offset and timeline reference
  const playheadRef = useRef({ offset: 0 });
  const loopTimeline = useRef<gsap.core.Timeline | null>(null);

  // Ticker animation control refs
  const targetSpeed = useRef(0.6); // speed in pixels per frame
  const currentSpeed = useRef(0.6);
  const isDragging = useRef(false);
  const isAnimating = useRef(false);
  const isHovered = useRef(false);
  const dragHistory = useRef<{ x: number; t: number }[]>([]);

  const updateCardDimensions = useCallback(() => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector(".testimonial-card");
    if (card) {
      setCardWidth(card.clientWidth);
      const style = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(style.columnGap || style.gap) || 24;
      setGapWidth(gap);
    }
  }, []);

  // Sync widths and basic sizes on load and resize
  useEffect(() => {
    updateCardDimensions();
    const timer = setTimeout(updateCardDimensions, 100);
    window.addEventListener("resize", updateCardDimensions);
    return () => {
      window.removeEventListener("resize", updateCardDimensions);
      clearTimeout(timer);
    };
  }, [updateCardDimensions]);

  // Instantiate Timeline and Draggable
  useEffect(() => {
    if (!trackRef.current || !proxyRef.current || !trackWrapperRef.current) return;

    const cardSlotWidth = cardWidth + gapWidth;
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
      trigger: trackWrapperRef.current,
      dragClickables: false,
      onPress: function () {
        gsap.killTweensOf(playheadRef.current);
        this.startOffset = playheadRef.current.offset;
        targetSpeed.current = 0;
        currentSpeed.current = 0;
        dragHistory.current = [];
      },
      onDrag: function () {
        isDragging.current = true;
        const deltaX = this.x - this.startX;
        playheadRef.current.offset = this.startOffset - deltaX / cycleWidth;

        // Record rolling pointer history (keep last 100ms)
        const now = performance.now();
        dragHistory.current.push({ x: this.x, t: now });
        const cutoff = now - 100;
        while (dragHistory.current.length > 1 && dragHistory.current[0].t < cutoff) {
          dragHistory.current.shift();
        }

        if (loopTimeline.current) {
          const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
          loopTimeline.current.progress(wrappedTime);
        }
      },
      onRelease: function () {
        // If no actual drag occurred (just a click/tap), restore autoplay
        if (!isDragging.current) {
          targetSpeed.current = isHovered.current ? 0 : 0.6;
        }
      },
      onDragEnd: function () {
        isDragging.current = false;

        // Calculate release velocity from rolling pointer history
        const history = dragHistory.current;
        let pixelVelocity = 0;
        if (history.length >= 2) {
          const oldest = history[0];
          const newest = history[history.length - 1];
          const dt = newest.t - oldest.t;
          if (dt > 0) {
            pixelVelocity = (newest.x - oldest.x) / dt; // px per ms
          }
        }
        dragHistory.current = [];

        // Convert pixel velocity to progress velocity and project momentum
        const progressVelocity = pixelVelocity / cycleWidth; // progress per ms
        const projectedOffset = playheadRef.current.offset - progressVelocity * 400; // 400ms momentum

        isAnimating.current = true;

        gsap.to(playheadRef.current, {
          offset: projectedOffset,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: function () {
            if (loopTimeline.current) {
              const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
              loopTimeline.current.progress(wrappedTime);
            }
          },
          onComplete: function () {
            isAnimating.current = false;
            // Accelerate back to normal speed if not hovered
            targetSpeed.current = isHovered.current ? 0 : 0.6;
          }
        });
      }
    });

    // 3. Constant speed ticker frame loop using GSAP's native ticker
    const tick = () => {
      if (!loopTimeline.current) return;

      // Smoothly interpolate current speed towards target speed (lerp deceleration/acceleration)
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.15;

      if (!isDragging.current && !isAnimating.current && Math.abs(currentSpeed.current) > 0.001) {
        playheadRef.current.offset += currentSpeed.current / cycleWidth;
        const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
        loopTimeline.current.progress(wrappedTime);
      }
    };

    gsap.ticker.add(tick);

    // Set initial position based on playhead offset
    const wrappedTime = gsap.utils.wrap(0, 1, playheadRef.current.offset);
    loopTimeline.current.progress(wrappedTime);

    return () => {
      gsap.ticker.remove(tick);
      if (draggableInstance.current) {
        draggableInstance.current[0].kill();
      }
      if (loopTimeline.current) {
        loopTimeline.current.kill();
      }
    };
  }, [cardWidth, gapWidth]);

  // Decelerate ticker on mouse hover
  const handleMouseEnter = () => {
    isHovered.current = true;
    targetSpeed.current = 0;
  };

  // Accelerate ticker on mouse leave
  const handleMouseLeave = () => {
    isHovered.current = false;
    if (!isDragging.current && !isAnimating.current) {
      targetSpeed.current = 0.6;
    }
  };



  return (
    <section 
      className="w-full py-16 md:py-24 px-6 bg-lightest-pink overflow-hidden relative select-none"
    >
      <div className="page-container">
        
        {/* Hidden drag proxy element */}
        <div ref={proxyRef} className="invisible absolute pointer-events-none" />

        {/* Section Title Header */}
        <div className="text-center mb-16 select-none">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-ink">
            What People Are Saying
          </h2>
          <p className="text-xs md:text-sm font-semibold text-ink/75 mt-3 max-w-lg mx-auto leading-relaxed">
            {"Don't just take our word for it. Here's what our customers has to say."}
          </p>
        </div>

        {/* Relative container holding scroll track and gradient overlays */}
        <div className="relative w-full">
          
          {/* Left Vignette Fade Shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-20 bg-gradient-to-r from-lightest-pink via-lightest-pink/40 to-transparent pointer-events-none" />

          {/* Right Vignette Fade Shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-20 bg-gradient-to-l from-lightest-pink via-lightest-pink/40 to-transparent pointer-events-none" />

          {/* Scroll Container Wrapper */}
          <div 
            ref={trackWrapperRef} 
            className="overflow-hidden select-none cursor-grab active:cursor-grabbing py-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Constant Translating Slider Track */}
            <div 
              ref={trackRef}
              className="flex gap-4 sm:gap-6 w-max"
            >
              {itemsWithClones.map((item, index) => (
                <div
                  key={index}
                  className="testimonial-card bg-white rounded-[22px] border border-[#EFE8E2] shadow-sm p-8 flex flex-col justify-between w-[280px] sm:w-[320px] md:w-[380px] flex-shrink-0 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-md hover:border-dark-pink/25"
                >
                  {/* Upper quote content */}
                  <div className="relative">
                    <span className="absolute -top-8 -left-3 text-[120px] font-serif leading-none text-[#E3D8CE] select-none pointer-events-none">
                      “
                    </span>
                    <p className="text-ink/85 text-sm md:text-base leading-relaxed pt-8 relative z-10 font-normal">
                      {`"${item.quote}"`}
                    </p>
                  </div>

                  {/* Bottom customer profile */}
                  <div className="flex items-center gap-4 mt-8">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-inner">
                      <Image
                        src={item.avatar}
                        fill
                        className="object-cover"
                        sizes="48px"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm md:text-base text-ink truncate leading-tight">
                        {item.name}
                      </span>
                      <span className="text-xs md:text-sm text-ink/50 font-semibold tracking-wider uppercase mt-0.5">
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
