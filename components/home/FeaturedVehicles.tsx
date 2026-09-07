import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getVehicles } from "@/lib/db";
import VehicleCard from "@/components/home/VehicleCard";

export default async function FeaturedVehicles() {
  const vehicles = (await getVehicles()).slice(0, 6);

  return (
    <section id="vehicules" className="mx-auto max-w-6xl py-20 lg:px-10">
      <div className="flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-0">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            Découvrez nos véhicules
          </h2>
          <p className="mt-3 font-body text-black/60">
            Une flotte pensée pour tous les besoins.
          </p>
        </div>

        <Link
          href="/vehicules"
          className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-[var(--color-red-primary)] hover:text-[var(--color-red-dark)]"
        >
          Voir tous les véhicules
          <ArrowRight size={16} />
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <p className="mt-10 px-6 text-black/50 lg:px-0">Aucun véhicule pour le moment.</p>
      ) : (
        <>
          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 pl-6 pr-6 snap-x-mandatory sm:hidden">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-10 hidden gap-6 px-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:px-0">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
