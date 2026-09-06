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

export default function VehiclesGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [active, setActive] = useState<Vehicle["category"] | "Tous">("Tous");

  const filtered =
    active === "Tous" ? vehicles : vehicles.filter((v) => v.category === active);

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`border px-4 py-2 text-sm font-semibold transition-colors ${
              active === cat
                ? "border-[var(--color-red-primary)] bg-[var(--color-red-primary)] text-white"
                : "border-black/10 text-black/60 hover:border-black/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-black/50">
          Aucun vehicule dans cette categorie pour le moment.
        </p>
      )}
    </div>
  );
}
