"use client";

import { useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

const SPEED_PX_PER_SEC = 36;

type ReviewItem = {
  name: string;
  rating: number;
  text: string;
};

export default function Reviews() {
  const { t, language, dir } = useLanguage();
  const items = [...translations[language].reviews.items];
  const loopItems = [...items, ...items];

  const trackRef = useRef<HTMLDivElement>(null);
  const halfWidthRef = useRef(0);
  const hasMeasured = useRef(false);
  const isInteracting = useRef(false);
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!track) return;

    if (!hasMeasured.current) {
      halfWidthRef.current = track.scrollWidth / 2;
      x.set(-halfWidthRef.current);
      hasMeasured.current = true;
    }

    if (isInteracting.current) return;

    const half = halfWidthRef.current;
    if (half <= 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let next = x.get() + (SPEED_PX_PER_SEC * delta) / 1000;
    if (next >= 0) next -= half;
    x.set(next);
  });

  const normalize = () => {
    const half = halfWidthRef.current;
    if (half <= 0) return;
    let value = x.get() % half;
    if (value > 0) value -= half;
    x.set(value);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--color-mist)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red-primary)]">
          {t("reviews.label")}
        </p>

        <h2 className="mt-2 font-display text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
          {t("reviews.title")}
        </h2>
      </div>

      <div className="relative mt-10 sm:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--color-mist)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--color-mist)] to-transparent sm:w-24" />

        <motion.div
          ref={trackRef}
          className="flex w-max cursor-grab gap-5 px-6 active:cursor-grabbing sm:gap-6 sm:px-10"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.06}
          onPointerEnter={() => {
            isInteracting.current = true;
          }}
          onPointerLeave={() => {
            isInteracting.current = false;
          }}
          onDragStart={() => {
            isInteracting.current = true;
          }}
          onDragEnd={() => {
            normalize();
            isInteracting.current = false;
          }}
        >
          {loopItems.map((item, index) => (
            <ReviewTicket
              key={`${item.name}-${index}`}
              name={item.name}
              rating={item.rating}
              text={item.text}
              dir={dir}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReviewTicket({
  name,
  rating,
  text,
  dir,
}: {
  name: string;
  rating: number;
  text: string;
  dir: "ltr" | "rtl";
}) {
  return (
    <div
      dir={dir}
      className="w-[270px] shrink-0 select-none bg-white shadow-md shadow-black/5 sm:w-[320px]"
    >
      <div className="flex items-center justify-between gap-3 bg-[var(--color-ink)] px-5 py-3">
        <span className="truncate font-display text-sm font-bold text-white">
          {name}
        </span>

        <div className="flex shrink-0 items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < rating
                  ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
                  : "fill-transparent text-white/25"
              }
            />
          ))}
        </div>
      </div>

      <div className="relative border-t border-dashed border-black/15">
        <span className="absolute -top-2.5 left-[-10px] h-5 w-5 rounded-full bg-[var(--color-mist)]" />
        <span className="absolute -top-2.5 right-[-10px] h-5 w-5 rounded-full bg-[var(--color-mist)]" />
      </div>

      <p className="px-5 py-4 font-body text-sm leading-relaxed text-black/70">
        {text}
      </p>
    </div>
  );
}