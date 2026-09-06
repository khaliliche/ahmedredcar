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
    <main className="pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold text-[var(--color-ink)]">
            Nos vehicules
          </h1>
          {hasSearch ? (
            <p className="mt-3 font-body text-black/60">
              Disponibilite a {params.ville} du {params.depart} au {params.retour}.
            </p>
          ) : (
            <p className="mt-3 font-body text-black/60">
              Toute notre flotte, de la citadine economique au SUV premium.
            </p>
          )}
        </div>

        <VehiclesGrid vehicles={vehicles} />
      </div>
    </main>
  );
}
