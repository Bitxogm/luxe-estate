"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyGalleryProps {
  imageUrl: string;
  images: string[];
  imageAlt: string;
}

const MAX_THUMBS = 5;

export default function PropertyGallery({ imageUrl, images, imageAlt }: PropertyGalleryProps) {
  const allImages = [imageUrl, ...images];
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const touchStartX = useRef<number | null>(null);

  function goTo(index: number) {
    if (index === active || fading) return;
    setFading(true);
    setTimeout(() => {
      setActive(index);
      setFading(false);
    }, 150);
  }

  function prev() {
    goTo(active === 0 ? allImages.length - 1 : active - 1);
  }

  function next() {
    goTo(active === allImages.length - 1 ? 0 : active + 1);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  const thumbImages = allImages.slice(0, MAX_THUMBS);
  const remaining = allImages.length - MAX_THUMBS;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="group relative aspect-video overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={allImages[active]}
          alt={imageAlt}
          fill
          priority
          className={`object-cover transition-opacity duration-150 ${fading ? "opacity-0" : "opacity-100"}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-nordic shadow backdrop-blur-sm transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-nordic shadow backdrop-blur-sm transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {thumbImages.map((img, i) => {
            const isOverflow = i === MAX_THUMBS - 1 && remaining > 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                  active === i
                    ? "ring-2 ring-mosque ring-offset-1 dark:ring-hint-green"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                {isOverflow && (
                  <div className="absolute inset-0 flex items-center justify-center bg-nordic/60 text-sm font-semibold text-white">
                    +{remaining}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
