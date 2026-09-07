"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import { moroccanCities } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BookingBar() {
  const router = useRouter();
  const { t } = useLanguage();
  const [city, setCity] = useState(moroccanCities[0]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [time, setTime] = useState("10:00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      ville: city,
      depart: start,
      retour: end,
      heure: time,
    });
    router.push(`/vehicules?${params.toString()}`);
  }

  return (
    <>
      {/* Desktop / Tablet inline form */}
      <form
        onSubmit={handleSubmit}
        className="relative hidden rounded-2xl glass-dark p-2 shadow-2xl shadow-black/30 sm:block"
      >
        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-5">
          <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
            <MapPin size={18} className="shrink-0 text-[var(--color-red-primary)]" />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {t("bookingBar.city")}
              </span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent text-sm font-medium text-white outline-none"
              >
                {moroccanCities.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
            <Calendar size={18} className="shrink-0 text-[var(--color-red-primary)]" />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {t("bookingBar.departure")}
              </span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
                className="bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
              />
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
            <Calendar size={18} className="shrink-0 text-[var(--color-red-primary)]" />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {t("bookingBar.return")}
              </span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
                className="bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
              />
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
            <Clock size={18} className="shrink-0 text-[var(--color-red-primary)]" />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {t("bookingBar.time")}
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
              />
            </div>
          </label>

          <button
            type="submit"
            className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-red-primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--color-red-dark)] hover:shadow-lg hover:shadow-red-primary/30 active:scale-[0.98] lg:col-span-1"
          >
            <Search size={18} />
            {t("bookingBar.search")}
          </button>
        </div>
      </form>

      {/* Mobile sticky bottom bar */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 z-40 glass-dark shadow-[0_-4px_20px_rgba(0,0,0,0.3)] sm:hidden"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)",
          paddingTop: "0.75rem",
          paddingLeft: "max(env(safe-area-inset-left), 1rem)",
          paddingRight: "max(env(safe-area-inset-right), 1rem)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5">
            <MapPin size={16} className="shrink-0 text-[var(--color-red-primary)]" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none"
            >
              {moroccanCities.map((c) => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("mobile-booking-drawer");
              if (el) el.classList.remove("hidden");
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white/70"
          >
            <Calendar size={16} />
            {start && end ? `${start} → ${end}` : t("bookingBar.dates")}
          </button>

          <button
            type="submit"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-red-primary)] text-white shadow-lg transition-all active:scale-95"
            aria-label={t("bookingBar.search")}
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Mobile booking drawer (dates) */}
      <div
        id="mobile-booking-drawer"
        className="fixed inset-0 z-[70] hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.classList.add("hidden");
          }
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[var(--color-ink)] p-6 pb-safe">
          <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-white/20" />
          <h3 className="mb-6 font-display text-xl font-bold text-white">
            {t("bookingBar.selectDates")}
          </h3>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-white/40">
                {t("bookingBar.departureDate")}
              </span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
                className="h-12 rounded-xl bg-white/5 px-4 text-white outline-none [color-scheme:dark]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-white/40">
                {t("bookingBar.returnDate")}
              </span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
                className="h-12 rounded-xl bg-white/5 px-4 text-white outline-none [color-scheme:dark]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-white/40">
                {t("bookingBar.time")}
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-12 rounded-xl bg-white/5 px-4 text-white outline-none [color-scheme:dark]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              document.getElementById("mobile-booking-drawer")?.classList.add("hidden");
            }}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--color-red-primary)] text-sm font-bold text-white transition-all active:scale-95"
          >
            {t("bookingBar.confirm")}
          </button>
        </div>
      </div>
    </>
  );
}