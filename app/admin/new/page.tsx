import Link from "next/link";
import { getVehicles, getReservations } from "@/lib/db";
import { deleteVehicleAction } from "@/app/admin/actions";
import { Car, CalendarClock, Wallet, Plus, Pencil, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboard() {
  const [vehicles, reservations] = await Promise.all([
    getVehicles(),
    getReservations(),
  ]);
  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const fleetValue = vehicles.reduce((sum, v) => sum + Number(v.price_per_day), 0);

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="vehicules" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
                Véhicules
              </h1>
              <p className="mt-1 text-sm text-black/50">Votre flotte, en un coup d&apos;œil.</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/reservations"
                className="flex-1 rounded-lg border border-black/15 px-4 py-2 text-center text-sm font-semibold transition-colors hover:bg-black/5 sm:flex-none"
              >
                Réservations
              </Link>
              <Link
                href="/admin/new"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-red-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] sm:flex-none"
              >
                <Plus className="h-4 w-4" /> Ajouter
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard icon={Car} label="Véhicules" value={vehicles.length} tone="ink" />
            <StatCard icon={CalendarClock} label="En attente" value={pendingCount} tone="yellow" />
            <StatCard
              icon={Wallet}
              label="Valeur flotte / jour"
              value={`${fleetValue.toLocaleString("fr-FR")} DH`}
              tone="ink"
              wide
            />
          </div>

          <div className="mt-10">
            {vehicles.length === 0 && (
              <p className="rounded-xl border border-dashed border-black/15 p-8 text-center text-black/50">
                Aucun véhicule pour le moment.
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative h-36 w-full bg-black/5">
                    {vehicle.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={vehicle.image_url}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-black/35">
                        Pas de photo
                      </div>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[var(--color-ink)] shadow-sm">
                      {vehicle.price_per_day} DH/j
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4">
                    <p className="truncate font-semibold text-[var(--color-ink)]">
                      {vehicle.brand} {vehicle.model}
                    </p>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <Link
                        href={`/admin/${vehicle.id}`}
                        className="rounded-lg border border-black/15 p-2 transition-colors hover:bg-black/5"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <form action={deleteVehicleAction.bind(null, vehicle.id)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  wide,
}: {
  icon: typeof Car;
  label: string;
  value: string | number;
  tone: "ink" | "yellow";
  wide?: boolean;
}) {
  const toneClasses =
    tone === "yellow"
      ? { wrap: "border-yellow-200 bg-yellow-50", text: "text-yellow-700", icon: "text-yellow-700/70" }
      : { wrap: "border-black/10 bg-white", text: "text-[var(--color-ink)]", icon: "text-black/45" };

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses.wrap} ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
      <div className={`flex items-center gap-2 ${toneClasses.icon}`}>
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className={`mt-2 font-display text-3xl font-extrabold ${toneClasses.text}`}>{value}</p>
    </div>
  );
}