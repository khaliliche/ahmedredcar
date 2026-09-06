import VehiclesGrid from "@/components/vehicules/CategoryFilter";
import { vehicles } from "@/data/vehicles";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ ville?: string; depart?: string; retour?: string }>;
}) {
  const params = await searchParams;
  const hasSearch = params.ville && params.depart && params.retour;

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
              Toute notre flotte, de la citadine économique au SUV premium.
            </p>
          )}
        </div>

        <VehiclesGrid vehicles={vehicles} />
      </div>
    </main>
  );
}