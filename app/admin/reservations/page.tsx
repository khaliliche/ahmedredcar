import Link from "next/link";
import { getReservations } from "@/lib/db";
import { updateReservationStatusAction, deleteReservationAction } from "@/app/admin/actions";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  contacted: "Contacté",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(value: string | Date) {
  const d = new Date(value);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function daysBetween(start: string | Date, end: string | Date) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function licenseYears(issueDate: string | Date) {
  const ms = Date.now() - new Date(issueDate).getTime();
  const years = ms / (1000 * 60 * 60 * 24 * 365.25);
  return years < 1 ? "< 1 an" : `${Math.floor(years)} an(s)`;
}

export default async function AdminReservationsPage() {
  const reservations = await getReservations();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
          Réservations
        </h1>

        <Link
          href="/admin"
          className="rounded-lg border border-black/15 px-4 py-2 text-sm font-semibold"
        >
          Retour aux véhicules
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {reservations.length === 0 && (
          <p className="text-black/50">Aucune réservation pour le moment.</p>
        )}

        {reservations.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-xl border border-black/10 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.full_name} — {r.age} ans</p>
                <p className="text-sm text-black/60">{r.vehicle_label}</p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[r.status]}`}
              >
                {STATUS_LABELS[r.status]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-black/70 sm:grid-cols-4">
              <p><span className="text-black/45">CIN :</span> {r.cin_number}</p>
              <p><span className="text-black/45">Ancienneté permis :</span> {licenseYears(r.license_issue_date)}</p>
              <p><span className="text-black/45">Du :</span> {formatDate(r.start_date)}</p>
              <p><span className="text-black/45">Au :</span> {formatDate(r.end_date)} ({daysBetween(r.start_date, r.end_date)} j)</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["pending", "contacted", "confirmed", "cancelled"] as const).map((status) => (
                <form key={status} action={updateReservationStatusAction.bind(null, r.id, status)}>
                  <button
                    type="submit"
                    disabled={r.status === status}
                    className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
                  >
                    {STATUS_LABELS[status]}
                  </button>
                </form>
              ))}

              <form action={deleteReservationAction.bind(null, r.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
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