import Link from "next/link";
import { Car, Fuel, Users, Cog } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="group flex flex-col border border-black/10">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[var(--color-charcoal)]">
        <span className="absolute left-3 top-3 bg-[var(--color-red-primary)] px-3 py-1 text-xs font-semibold text-white">
          {vehicle.category}
        </span>
        <Car className="text-white/20" size={64} strokeWidth={1} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="mt-1 font-body text-sm text-black/50">
            A partir de{" "}
            <span className="font-semibold text-[var(--color-red-primary)]">
              {vehicle.pricePerDay} DH
            </span>{" "}
            / jour
          </p>
        </div>

        <div className="flex flex-wrap gap-4 border-y border-black/5 py-3 text-xs text-black/60">
          <span className="flex items-center gap-1">
            <Cog size={14} /> {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={14} /> {vehicle.fuel}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {vehicle.seats} places
          </span>
        </div>

        <Link
          href={`/vehicules/${vehicle.slug}`}
          className="mt-auto inline-flex items-center justify-center border border-[var(--color-ink)] py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
        >
          Voir le vehicule
        </Link>
      </div>
    </div>
  );
}
