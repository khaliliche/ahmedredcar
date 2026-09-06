import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import VehicleCard from "@/components/home/VehicleCard";

export default function FeaturedVehicles() {
  return (
    <section id="vehicules" className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            Decouvrez nos vehicules
          </h2>
          <p className="mt-3 font-body text-black/60">
            Une flotte pensee pour tous les besoins, de la citadine economique
            au SUV premium.
          </p>
        </div>

        <Link
          href="/vehicules"
          className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-[var(--color-red-primary)] hover:text-[var(--color-red-dark)]"
        >
          Voir tous les vehicules
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}