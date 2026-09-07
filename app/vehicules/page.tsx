import { getVehicles } from "@/lib/db";
import VehicleCard from "@/components/home/VehicleCard";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ ville?: string; depart?: string; retour?: string }>;
}) {
  const params = await searchParams;
  const hasSearch = params.ville && params.depart && params.retour;
  const vehicles = await getVehicles();

  return (
    <main className="pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            Nos véhicules
          </h1>
          {hasSearch ? (
            <p className="mt-2 font-body text-sm text-black/60 sm:mt-3 sm:text-base">
              Disponibilité à {params.ville} du {params.depart} au {params.retour}.
            </p>
          ) : (
            <p className="mt-2 font-body text-sm text-black/60 sm:mt-3 sm:text-base">
              Toute notre flotte.
            </p>
          )}
        </div>

        {vehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 border border-dashed border-black/15 py-16 text-center">
            <p className="font-body text-black/60">Aucun véhicule pour le moment.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
