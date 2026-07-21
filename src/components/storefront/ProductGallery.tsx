"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images?: string[];
  videos?: string[];
}

export default function ProductGallery({ images = [], videos = [] }: ProductGalleryProps) {
  // Combine images and videos into unified media items
  const mediaItems: { type: "image" | "video"; url: string }[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  if (mediaItems.length === 0) {
    return (
      <div className="aspect-4/5 w-full rounded-3xl border border-light-pink bg-lightest-pink/10 flex items-center justify-center text-6xl">
        👗
      </div>
    );
  }

  const activeMedia = mediaItems[activeIdx] || mediaItems[0];

  return (
    <div className="space-y-4">
      {/* Main Large View (Image or Video) */}
      <div className="aspect-4/5 w-full rounded-3xl border border-light-pink bg-lightest-pink/10 overflow-hidden relative shadow-sm">
        {activeMedia.type === "video" ? (
          <video
            src={activeMedia.url}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover bg-black"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={activeMedia.url}
            alt="Product details"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail Bar */}
      {mediaItems.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                activeIdx === idx ? "border-dark-pink ring-2 ring-dark-pink/20" : "border-light-pink/80 hover:border-dark-pink"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-black relative flex items-center justify-center">
                  <video src={item.url} className="w-full h-full object-cover opacity-80" preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="w-7 h-7 rounded-full bg-brand-yellow text-primary flex items-center justify-center text-xs font-bold shadow-md">
                      ▶
                    </span>
                  </div>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
