"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { moroccanCities } from "@/lib/constants";

export default function BookingBar() {
  const router = useRouter();
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
      className="grid w-full grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/5 backdrop-blur sm:grid-cols-2 lg:grid-cols-5"
    >
      <label className="flex flex-col gap-1 bg-[var(--color-ink)] px-5 py-4">
        <span className="text-xs text-white/50">Ville de récupération</span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-transparent text-sm text-white outline-none"
        >
          {moroccanCities.map((c) => (
            <option key={c} value={c} className="text-black">
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 bg-[var(--color-ink)] px-5 py-4">
        <span className="text-xs text-white/50">Date de départ</span>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
        />
      </label>

      <label className="flex flex-col gap-1 bg-[var(--color-ink)] px-5 py-4">
        <span className="text-xs text-white/50">Date de retour</span>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
        />
      </label>

      <label className="flex flex-col gap-1 bg-[var(--color-ink)] px-5 py-4">
        <span className="text-xs text-white/50">Heure</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
        />
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-[var(--color-red-primary)] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
      >
        <Search size={18} />
        Rechercher
      </button>
    </form>
  );
}
