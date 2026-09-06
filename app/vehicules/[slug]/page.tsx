"use client";

import { useState } from "react";
import VehicleCard from "@/components/home/VehicleCard";
import type { Vehicle } from "@/data/vehicles";

const categories: Array<Vehicle["category"] | "Tous"> = [
  "Tous",
  "Economique",
  "Confort",
  "SUV",
  "Premium",
];

function activeClasses(cat: Vehicle["category"] | "Tous") {
  if (cat === "Premium") {
    return "border-[var(--color-brass)] bg-[var(--color-brass)] text-white";
  }
  return "border-[var(--color-red-primary)] bg-[var(--color-red-primary)] text-white";
}

export default function VehiclesGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [active, setActive] = useState<Vehicle["category"] | "Tous">("Tous");

  const filtered =
    active === "Tous" ? vehicles : vehicles.filter((v) => v.category === active);

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`h-10 border px-4 text-sm font-semibold transition-colors active:scale-95 sm:h-11 sm:py-2 ${
              active === cat
                ? activeClasses(cat)
                : "border-black/10 text-black/60 hover:border-black/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 sm:hidden snap-x-mandatory">
        {filtered.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="mt-8 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 border border-dashed border-black/15 py-16 text-center">
          <p className="font-body text-black/60">
            Aucun véhicule dans cette catégorie pour le moment.
          </p>
          <button
            onClick={() => setActive("Tous")}
            className="font-body text-sm font-semibold text-[var(--color-red-primary)] hover:text-[var(--color-red-dark)]"
          >
            Voir toute la flotte
          </button>
        </div>
      )}
    </div>
  );
}