import Link from "next/link";
import { getVehicles } from "@/lib/db";
import { deleteVehicleAction, logoutAction } from "@/app/admin/actions";

export default async function AdminDashboard() {
  const vehicles = await getVehicles();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
          Vehicules
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="rounded-lg bg-[var(--color-red-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            + Ajouter
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-black/15 px-4 py-2 text-sm font-semibold"
            >
              Deconnexion
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {vehicles.length === 0 && (
          <p className="text-black/50">Aucun vehicule pour le moment.</p>
        )}

        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4"
          >
            <div className="flex items-center gap-4">
              {vehicle.image_url ? (
                <img
                  src={vehicle.image_url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="h-16 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-black/5 text-[10px] text-black/40">
                  Pas de photo
                </div>
              )}

              <div>
                <p className="font-semibold">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="text-sm text-black/50">
                  {vehicle.price_per_day} DH/j
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/${vehicle.id}`}
                className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold"
              >
                Modifier
              </Link>

              <form action={deleteVehicleAction.bind(null, vehicle.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
