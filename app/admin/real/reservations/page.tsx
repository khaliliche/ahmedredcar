import Link from "next/link";
import { getReservations, type Reservation } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AVATAR_COLORS = [
  "bg-[var(--color-red-primary)]",
  "bg-[var(--color-brass)]",
  "bg-[var(--color-clay)]",
  "bg-[var(--color-ink)]",
];

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
function avatarColor(name: string) {
  const idx = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function statusOf(r: Reservation) {
  if (r.status === "cancelled") {
    return { text: "Annul\u00e9e", badge: "bg-red-50 text-red-700", dot: "bg-red-500" };
  }
  if (r.contract_number) {
    return { text: "Contrat g\u00e9n\u00e9r\u00e9", badge: "bg-green-50 text-green-700", dot: "bg-green-500" };
  }
  return { text: "En attente", badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500" };
}

// Waiting requests first, then generated / cancelled ones.
function rank(r: Reservation) {
  return r.status !== "cancelled" && !r.contract_number ? 0 : 1;
}

export default async function AdminReservationsPage() {
  const all = await getReservations();
  const rows = all.filter((r) => r.source === "online").sort((a, b) => rank(a) - rank(b));

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="reservations" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
            {"R\u00e9servations en ligne"}
          </h1>
          <p className="mt-1 text-sm text-black/50">{rows.length} au total</p>

          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-black/10 bg-white md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs font-semibold uppercase tracking-wide text-black/40">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">{"V\u00e9hicule"}</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const st = statusOf(r);
                  return (
                    <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/real/reservations/${r.id}`}
                          className="flex items-center gap-2.5 hover:opacity-80"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(r.full_name)}`}
                          >
                            {initials(r.full_name)}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--color-ink)]">{r.full_name}</p>
                            <p className="text-xs text-black/40">{r.driver_phone}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-black/70">{r.vehicle_label}</td>
                      <td className="px-4 py-3 text-black/70">
                        {formatDate(r.start_date)} {"\u2192"} {formatDate(r.end_date)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                          {st.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {rows.length === 0 && (
              <p className="p-8 text-center text-black/50">
                {"Aucune r\u00e9servation en ligne pour le moment."}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 md:hidden">
            {rows.length === 0 && (
              <p className="rounded-xl border border-dashed border-black/15 p-8 text-center text-black/50">
                {"Aucune r\u00e9servation en ligne pour le moment."}
              </p>
            )}
            {rows.map((r) => {
              const st = statusOf(r);
              return (
                <Link
                  key={r.id}
                  href={`/admin/real/reservations/${r.id}`}
                  className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(r.full_name)}`}
                      >
                        {initials(r.full_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">{r.full_name}</p>
                        <p className="text-xs text-black/45">{r.vehicle_label}</p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.text}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-black/60">
                    {formatDate(r.start_date)} {"\u2192"} {formatDate(r.end_date)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}