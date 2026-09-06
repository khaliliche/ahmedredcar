import Link from "next/link";
import Image from "next/image";
import { Fuel, Users, Cog } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";

function categoryColor(category: Vehicle["category"]) {
  return category === "Premium"
    ? "bg-[var(--color-brass)]"
    : "bg-[var(--color-red-primary)]";
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="group flex flex-col border border-black/10 bg-white transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(11,10,8,0.4)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-charcoal)]">
        <span
          className={`absolute left-0 top-4 px-3 py-1 text-xs font-semibold text-white ${categoryColor(
            vehicle.category
          )}`}
        >
          {vehicle.category}
        </span>

        <Image
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute bottom-3 right-3 rotate-[-3deg] border border-[var(--color-ink)]/15 bg-[var(--color-mist)] px-3 py-2 text-right shadow-md">
          <p className="font-display text-xl font-extrabold leading-none text-[var(--color-ink)]">
            {vehicle.pricePerDay} DH
          </p>
          <p className="mt-1 text-[11px] text-black/50">par jour</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
          {vehicle.brand} {vehicle.model}
        </h3>

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