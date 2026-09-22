"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const AUTOPLAY_MS = 4500;

type HeroCarouselProps = {
  images: string[];
};

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (images.length <= 1) {
      return;
    }

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    startAutoplay();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const goTo = (i: number) => {
    setIndex(i);
    startAutoplay();
  };

  if (images.length === 0) {
    return null;
  }

  // Keep the index valid if the images array becomes shorter.
  const currentIndex = index >= images.length ? 0 : index;
  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40 sm:max-w-lg lg:max-w-none"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={`${currentImage}-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage}
            alt="Ahmed Red Car"
            fill
            sizes="(min-width: 1024px) 44vw, 90vw"
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle gradient so dots stay readable over any photo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
