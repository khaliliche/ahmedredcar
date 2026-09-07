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
    <form
      onSubmit={handleSubmit}
      className="relative rounded-2xl glass-dark p-2 shadow-2xl shadow-black/30"
    >
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
          <MapPin size={18} className="shrink-0 text-[var(--color-red-primary)]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {t("bookingBar.city")}
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
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
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {t("bookingBar.departure")}
            </span>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
            />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
          <Calendar size={18} className="shrink-0 text-[var(--color-red-primary)]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {t("bookingBar.return")}
            </span>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
            />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10 lg:px-5 lg:py-4">
          <Clock size={18} className="shrink-0 text-[var(--color-red-primary)]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {t("bookingBar.time")}
            </span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
            />
          </div>
        </label>

        <button
          type="submit"
          className="col-span-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-red-primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--color-red-dark)] hover:shadow-lg hover:shadow-red-primary/30 active:scale-[0.98] sm:col-span-2 lg:col-span-1"
        >
          <Search size={18} />
          {t("bookingBar.search")}
        </button>
      </div>
    </form>
  );
}