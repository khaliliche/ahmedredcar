"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

const SPEED_PX_PER_SEC = 36;
const SPEED_PX_PER_SEC_PHONE = 22;
const RESUME_DELAY_MS = 1200;

type ReviewItem = {
  name: string;
  rating: number;
  text: string;
};

export default function Reviews() {
  const { t, language, dir } = useLanguage();
  const items: ReviewItem[] = [...translations[language].reviews.items];
  const loopItems = [...items, ...items];

  const trackRef = useRef<HTMLDivElement>(null);
  const halfWidthRef = useRef(0);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    halfWidthRef.current = track.scrollWidth / 2;
    track.scrollLeft = track.scrollLeft % halfWidthRef.current || 1;
  }, [language]);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!track) return;

    if (halfWidthRef.current <= 0) {
      halfWidthRef.current = track.scrollWidth / 2;
    }
    const half = halfWidthRef.current;
    if (half <= 0) return;

    if (isInteractingRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const speed =
      window.innerWidth < 640 ? SPEED_PX_PER_SEC_PHONE : SPEED_PX_PER_SEC;
    let next = track.scrollLeft + (speed * delta) / 1000;
    if (next >= half) next -= half;
    track.scrollLeft = next;
  });

  const pause = () => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const scheduleResume = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      const track = trackRef.current;
      const half = halfWidthRef.current;
      if (track && half > 0) {
        let value = track.scrollLeft % half;
        if (value < 0) value += half;
        track.scrollLeft = value;
      }
      isInteractingRef.current = false;
    }, RESUME_DELAY_MS);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-ink)] via-[var(--color-charcoal)] to-[var(--color-ink)] py-0 sm:py-20">
      <div className="relative overflow-hidden rounded-none bg-gradient-to-br from-[#5c0a0a] via-[#8a1010] to-[#3d0707] py-12 sm:mx-6 sm:rounded-3xl sm:py-16 lg:mx-10 xl:mx-auto xl:max-w-6xl">
        <div className="px-5 sm:px-8 lg:px-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c040]">
            {t("reviews.label")}
          </p>

          <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {t("reviews.title")}
          </h2>

          <span
            className="mt-3 block h-1 w-14 rounded-full bg-[#d4a017]"
            aria-hidden="true"
          />
        </div>

        <div className="relative mt-7 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] sm:mt-12 sm:[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div
            ref={trackRef}
            dir="ltr"
            className="reviews-track flex gap-3 overflow-x-auto px-4 sm:gap-6 sm:px-10"
            onPointerDown={pause}
            onPointerUp={scheduleResume}
            onPointerCancel={scheduleResume}
            onTouchStart={pause}
            onTouchEnd={scheduleResume}
            onMouseEnter={pause}
            onMouseLeave={scheduleResume}
            onWheel={pause}
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
          </div>
        </div>
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
      className="w-[78vw] max-w-[300px] shrink-0 select-none overflow-hidden rounded-2xl border border-[#d4a017]/40 bg-[var(--color-cream)] shadow-lg shadow-black/30 sm:w-[320px] sm:max-w-none"
    >
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#e8b923] via-[#d4a017] to-[#b8860b] px-4 py-3 sm:px-5">
        <span className="truncate font-display text-sm font-bold text-[var(--color-ink)]">
          {name}
        </span>

        <div className="flex shrink-0 items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < rating
                  ? "fill-[#5c0a0a] text-[#5c0a0a]"
                  : "fill-transparent text-black/30"
              }
            />
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-[#8a1010]/30" />

      <p className="px-4 py-4 font-body text-[15px] leading-relaxed text-black/75 sm:px-5 sm:text-sm sm:text-black/70">
        {text}
      </p>
    </div>
  );
}