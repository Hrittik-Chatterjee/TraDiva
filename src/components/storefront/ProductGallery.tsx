"use client";

import { useState } from "react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-4/5 w-full rounded-3xl border border-light-pink bg-lightest-pink/10 flex items-center justify-center text-6xl">
        👗
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Large Image View */}
      <div className="aspect-4/5 w-full rounded-3xl border border-light-pink bg-lightest-pink/10 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIdx]}
          alt="Product details"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                activeIdx === idx ? "border-dark-pink" : "border-light-pink/80 hover:border-dark-pink"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
