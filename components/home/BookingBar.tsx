"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import { moroccanCities } from "@/lib/constants";

export default function BookingBar() {
  const router = useRouter();
  const [city, setCity] = useState(moroccanCities[0]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [time, setTime] = useState("10:00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ ville: city, depart: start, retour: end, heure: time });
    router.push(`/vehicules?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative rounded-2xl glass-dark p-2 shadow-2xl shadow-black/30">
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4 transition-colors hover:bg-white/10">
          <MapPin size={18} className="text-[var(--color-red-primary)] shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Ville</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent text-sm text-white outline-none font-medium">
              {moroccanCities.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4 transition-colors hover:bg-white/10">
          <Calendar size={18} className="text-[var(--color-red-primary)] shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Départ</span>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} required className="bg-transparent text-sm text-white outline-none font-medium [color-scheme:dark]" />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4 transition-colors hover:bg-white/10">
          <Calendar size={18} className="text-[var(--color-red-primary)] shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Retour</span>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} required className="bg-transparent text-sm text-white outline-none font-medium [color-scheme:dark]" />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4 transition-colors hover:bg-white/10">
          <Clock size={18} className="text-[var(--color-red-primary)] shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Heure</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent text-sm text-white outline-none font-medium [color-scheme:dark]" />
          </div>
        </label>

        <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-red-primary)] px-5 py-4 text-sm font-bold text-white transition-all hover:bg-[var(--color-red-dark)] hover:shadow-lg hover:shadow-red-primary/30 btn-shine">
          <Search size={18} />
          Rechercher
        </button>
      </div>
    </form>
  );
}