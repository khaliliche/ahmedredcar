"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Waves, Mountain, Route, ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/db";

const tripOptions = [
  {
    id: "ville",
    label: "En ville",
    icon: Building2,
    reason: "Compacte et maniable, parfaite pour circuler et se garer facilement en ville.",
  },
  {
    id: "plage",
    label: "À la plage",
    icon: Waves,
    reason: "Confortable et économique, idéale pour des trajets côtiers décontractés.",
  },
  {
    id: "montagne",
    label: "À la montagne",
    icon: Mountain,
    reason: "Confortable, spacieuse et adaptée aux longues routes et aux terrains variés.",
  },
  {
    id: "voyage",
    label: "Long voyage",
    icon: Route,
    reason: "Spacieux et confortable, conçu pour les longs trajets en toute sérénité.",
  },
];

export default function TripFinder({ vehicles }: { vehicles: Vehicle[] }) {
  const [selected, setSelected] = useState(tripOptions[0].id);

  if (vehicles.length === 0) return null;

  const index = tripOptions.findIndex((o) => o.id === selected);
  const option = tripOptions[index];
  const vehicle = vehicles[index % vehicles.length];

  return (
    <section className="bg-[var(--color-charcoal)] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
          Quel voyage préparez-vous ?
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-px bg-white/10 sm:mt-10 sm:grid-cols-4">
          {tripOptions.map((opt) => {
            const Icon = opt.icon;
            const active = opt.id === selected;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`flex flex-col items-center gap-2 bg-[var(--color-ink)] px-3 py-5 text-xs font-medium transition-colors sm:px-4 sm:py-6 sm:text-sm ${
                  active ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <Icon
                  size={20}
                  className={`mb-0.5 sm:size-[22px] ${active ? "text-[var(--color-red-primary)]" : ""}`}
                />
                {opt.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-8 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="max-w-md">
              <p className="font-body text-xs text-white/50 sm:text-sm">
                Nous vous recommandons
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/70 sm:mt-3">
                {option.reason}
              </p>
            </div>

            <Link
              href={`/vehicules/${vehicle.slug}`}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border border-[var(--color-red-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-primary)] active:scale-[0.98] sm:px-6"
            >
              Voir ce véhicule
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
