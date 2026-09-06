"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Waves, Mountain, Route, ArrowRight } from "lucide-react";
import { vehicles } from "@/data/vehicles";

const tripOptions = [
  {
    id: "ville",
    label: "En ville",
    icon: Building2,
    slug: "renault-clio-5",
    reason:
      "Compacte et maniable, parfaite pour circuler et se garer facilement en ville.",
  },
  {
    id: "plage",
    label: "A la plage",
    icon: Waves,
    slug: "peugeot-208",
    reason:
      "Confortable et economique, ideale pour des trajets cotiers decontractes.",
  },
  {
    id: "montagne",
    label: "A la montagne",
    icon: Mountain,
    slug: "dacia-duster",
    reason:
      "Confortable, spacieuse et adaptee aux longues routes et aux terrains varies.",
  },
  {
    id: "voyage",
    label: "Long voyage",
    icon: Route,
    slug: "hyundai-tucson",
    reason:
      "Spacieux et confortable, concu pour les longs trajets en toute serenite.",
  },
];

export default function TripFinder() {
  const [selected, setSelected] = useState(tripOptions[0].id);
  const option = tripOptions.find((o) => o.id === selected)!;
  const vehicle = vehicles.find((v) => v.slug === option.slug)!;

  return (
    <section className="bg-[var(--color-charcoal)] py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          Quel voyage preparez-vous ?
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
          {tripOptions.map((opt) => {
            const Icon = opt.icon;
            const active = opt.id === selected;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`flex flex-col items-center gap-2 bg-[var(--color-ink)] px-4 py-6 text-sm transition-colors ${
                  active ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <Icon
                  size={22}
                  className={active ? "text-[var(--color-red-primary)]" : ""}
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
            className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="max-w-md">
              <p className="font-body text-sm text-white/50">
                Nous vous recommandons
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-white">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="mt-3 font-body text-sm text-white/70">
                {option.reason}
              </p>
            </div>

            <Link
              href={`/vehicules/${vehicle.slug}`}
              className="inline-flex items-center gap-2 border border-[var(--color-red-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-primary)]"
            >
              Voir ce vehicule
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
