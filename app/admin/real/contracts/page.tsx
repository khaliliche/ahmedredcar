import Link from "next/link";
import { FilePlus, FileText, Pencil, Search } from "lucide-react";
import { getReservations, type Reservation } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DeleteContractButton from "@/components/admin/DeleteContractButton";

export const dynamic = "force-dynamic";

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function signState(r: Reservation) {
  if (r.status === "cancelled") {
    return { text: "Annulé", badge: "bg-red-50 text-red-700" };
  }
  if (r.signed_at && r.admin_signed_at) {
    return { text: "Signé", badge: "bg-green-50 text-green-700" };
  }
  if (r.signed_at || r.admin_signed_at) {
    return { text: "Signé partiellement", badge: "bg-yellow-50 text-yellow-700" };
  }
  return { text: "Non signé", badge: "bg-black/5 text-black/60" };
}

const SOURCES = [
  { value: "", label: "Tous" },
  { value: "online", label: "En ligne" },
  { value: "walk_in", label: "Guichet" },
] as const;

export default async function AdminContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string }>;
}) {
  const { q = "", source = "" } = await searchParams;
  const all = await getReservations();

  // A "contract" is any reservation that has been given a contract number,
  // whether it came from the website or was created at the desk.
  const contracts = all.filter((r) => r.contract_number);

  const needle = q.trim().toLowerCase();
  const rows = contracts.filter((r) => {
    if ((source === "online" || source === "walk_in") && r.source !== source) {
      return false;
    }
    if (!needle) return true;
    return [
      r.contract_number,
      r.full_name,
      r.vehicle_label,
      r.driver_phone,
      r.cin_number,
      r.registration_plate,
    ]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(needle));
  });

  const hrefFor = (s: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s) params.set("source", s);
    const qs = params.toString();
    return `/admin/real/contracts${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="contracts" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
                Tous les contrats
              </h1>
              <p className="mt-1 text-sm text-black/50">
                {rows.length} affiché{rows.length > 1 ? "s" : ""} sur {contracts.length}
              </p>
            </div>
            <Link
              href="/admin/real/contracts/new"
              className="flex items-center gap-2 rounded-xl bg-[var(--color-red-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <FilePlus className="h-4 w-4" />
              Nouveau contrat
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <form action="/admin/real/contracts" className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Rechercher : n° contrat, client, véhicule, téléphone, CIN, plaque"
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-red-primary)]"
              />
              {source && <input type="hidden" name="source" value={source} />}
            </form>
            <div className="flex gap-1.5">
              {SOURCES.map((s) => (
                <Link
                  key={s.value}
                  href={hrefFor(s.value)}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                    source === s.value
                      ? "bg-[var(--color-charcoal)] text-white"
                      : "bg-white text-black/60 hover:bg-black/5"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {rows.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-black/15 p-8 text-center text-black/50">
              Aucun contrat trouvé.
            </p>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              {rows.map((r) => {
                const st = signState(r);
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/admin/real/reservations/${r.id}`}
                          className="font-semibold text-[var(--color-ink)] hover:underline"
                        >
                          {r.full_name}
                        </Link>
                        <p className="mt-0.5 text-xs font-semibold text-black/40">
                          {r.contract_number} · {r.source === "walk_in" ? "Guichet" : "En ligne"}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.badge}`}>
                        {st.text}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-1 text-sm text-black/65 sm:grid-cols-3">
                      <p>
                        {r.vehicle_label}
                        {r.registration_plate ? ` · ${r.registration_plate}` : ""}
                      </p>
                      <p>
                        {formatDate(r.start_date)} → {formatDate(r.end_date)}
                      </p>
                      <p>{r.driver_phone}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/real/reservations/${r.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Voir / Modifier
                      </Link>
                      <Link
                        href={`/admin/real/reservations/${r.id}/pdf`}
                        className="flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        PDF
                      </Link>
                      <DeleteContractButton id={r.id} label={`${r.contract_number} - ${r.full_name}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
