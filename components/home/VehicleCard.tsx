import Link from "next/link";
import Image from "next/image";
import { Fuel, Users, Cog, ArrowUpRight } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";

function categoryColor(category: Vehicle["category"]) {
  return category === "Premium"
    ? "bg-[var(--color-brass)] text-[var(--color-ink)]"
    : "bg-[var(--color-red-primary)] text-white";
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="group relative flex w-[82vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/15 sm:w-auto sm:max-w-none sm:shrink sm:hover:-translate-y-2 border border-black/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-charcoal)]">
        <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${categoryColor(vehicle.category)}`}>
          {vehicle.category}
        </span>
        
        <Image
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 82vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        
        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="absolute bottom-4 right-4 rounded-xl bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
          <p className="font-display text-xl font-extrabold leading-none text-[var(--color-red-primary)]">
            {vehicle.pricePerDay} <span className="text-sm font-medium text-black/50">DH/j</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl font-bold text-[var(--color-ink)] group-hover:text-[var(--color-red-primary)] transition-colors">
            {vehicle.brand} {vehicle.model}
          </h3>
          <ArrowUpRight size={20} className="text-black/20 group-hover:text-[var(--color-red-primary)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>

        <div className="flex flex-wrap gap-3 border-y border-black/5 py-3 text-xs text-black/50">
          <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1">
            <Cog size={13} /> {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1">
            <Fuel size={13} /> {vehicle.fuel}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1">
            <Users size={13} /> {vehicle.seats} places
          </span>
        </div>

        <Link
          href={`/vehicules/${vehicle.slug}`}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] py-3 text-sm font-bold text-white transition-all hover:bg-[var(--color-red-primary)] hover:shadow-lg hover:shadow-red-primary/20"
        >
          Voir le véhicule
        </Link>
      </div>
    </div>
  );
}