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
        <div className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider border border-white/10 mb-4 w-max">
          Heritage Support & Inquiries
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
          Have Questions or Need Fabric Care Help?
        </h2>
        <p className="text-sm md:text-base text-white/90 max-w-xl mb-8 leading-relaxed">
          Whether you need guidance on caring for your delicate Manipuri handlooms, have custom sizing inquiries, or need help with an order—our team is always here for you.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:support@tradiva.com"
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-[#ffe066] text-primary font-bold py-3 px-8 rounded-full transition-all duration-200 text-xs md:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 6.993V6.75" />
            </svg>
            Mail Us
          </a>
          <a
            href="tel:+8801700000000"
            className="inline-flex items-center gap-2 border-2 border-white/80 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 text-xs md:text-sm uppercase tracking-wider backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
            </svg>
            Call Us
          </a>
        </div>
      </div>
    </section>
  );
}
