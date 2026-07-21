"use client";

import React from "react";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="relative w-full min-h-[550px] md:min-h-[650px] flex flex-col items-center justify-between pt-16 pb-[210px] md:pt-24 md:pb-[140px] px-6 bg-charcoal overflow-hidden select-none">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/yellowcontact.webp"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          alt="Contact us background"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Glassmorphic Core Card */}
      <div className="relative z-10 my-auto -translate-y-2 w-full max-w-3xl backdrop-blur-md bg-white/15 border border-white/20 rounded-3xl p-8 md:p-14 text-center text-white shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 leading-tight">
          Ready to outperform the market?
        </h2>
        <p className="text-sm md:text-base text-white/90 max-w-xl mb-8 leading-relaxed">
          Connect with TraDiva to explore bespoke handloom collections, wholesale partnerships, and custom Manipuri craft designs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="bg-brand-yellow hover:bg-[#ffe066] text-primary font-bold py-3 px-8 rounded-full transition-all duration-200 text-xs md:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
            Partner with us
          </button>
          <button className="border-2 border-white/80 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 text-xs md:text-sm uppercase tracking-wider backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer">
            Request an audit
          </button>
        </div>
      </div>
    </section>
  );
}
