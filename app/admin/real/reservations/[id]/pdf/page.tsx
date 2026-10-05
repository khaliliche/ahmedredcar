import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReservationById } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContractPdfViewer from "@/components/admin/ContractPdfViewer";

export default async function ContractPdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservationById(Number(id));

  if (!reservation) {
    notFound();
  }
  if (!reservation.contract_number) {
    redirect(`/admin/real/reservations/${reservation.id}`);
  }

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="reservations" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/admin/real/reservations/${reservation.id}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 transition-colors hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au contrat
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
            Contrat {reservation.contract_number}
          </h1>
          <p className="mt-1 text-sm text-black/50">
            {reservation.full_name} - {reservation.vehicle_label}
          </p>

          <ContractPdfViewer src={`/admin/real/reservations/${reservation.id}/contract`} />
        </div>
      </main>
    </div>
  );
}