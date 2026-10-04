import { notFound } from "next/navigation";
import Link from "next/link";
import { getReservationById } from "@/lib/db";
import AdminSignaturePad from "@/components/admin/AdminSignaturePad";

// Admin-only: lives under /admin/real, so middleware.ts already blocks
// anyone without the admin session cookie.
export default async function AgencySignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservationById(Number(id));
  if (!reservation) notFound();

  const fmt = (v: string | Date) =>
    new Date(v).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-center font-display text-2xl font-extrabold text-[var(--color-ink)]">
          Ahmed Red Car
        </h1>
        <p className="mb-6 text-center text-sm text-black/50">
          Contrat de location - signature de l&apos;agence
        </p>

        <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/70">
          <p className="font-semibold text-black">{reservation.vehicle_label}</p>
          <p className="mt-1">{reservation.full_name}</p>
          <p className="mt-1">
            Du {fmt(reservation.start_date)} à {reservation.start_time} au{" "}
            {fmt(reservation.end_date)} à {reservation.end_time}
          </p>
          {reservation.contract_number && (
            <p className="mt-1 text-xs font-semibold text-black/40">
              Contrat {reservation.contract_number}
            </p>
          )}
        </div>

        <AdminSignaturePad
          reservationId={reservation.id}
          existing={reservation.admin_signature_data}
        />

        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          {reservation.contract_number && (
            <a
              href={`/admin/real/reservations/${reservation.id}/contract`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/15 bg-white px-3 py-2 hover:bg-black/5"
            >
              Voir le PDF
            </a>
          )}
          <Link
            href={`/admin/real/reservations/${reservation.id}`}
            className="rounded-lg border border-black/15 bg-white px-3 py-2 hover:bg-black/5"
          >
            Retour à la réservation
          </Link>
        </div>
      </div>
    </main>
  );
}