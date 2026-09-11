import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReservationById, getVehicleById } from "@/lib/db";
import { updateReservationContractAction } from "@/app/admin/actions";
import { resolveBilling, DEFAULT_MIN_RENTAL_DAYS } from "@/lib/contract";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContractEditForm from "@/components/admin/ContractEditForm";

export default async function EditContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservationById(Number(id));

  if (!reservation) {
    notFound();
  }

  const vehicle = reservation.vehicle_id
    ? await getVehicleById(reservation.vehicle_id)
    : null;

  const vehiclePricing = {
    price_per_day: vehicle?.price_per_day ?? 0,
    price_extended_15: vehicle?.price_extended_15 ?? vehicle?.price_per_day ?? 0,
    price_monthly_30: vehicle?.price_monthly_30 ?? vehicle?.price_per_day ?? 0,
    min_rental_days: vehicle?.min_rental_days ?? DEFAULT_MIN_RENTAL_DAYS,
  };

  const billing = resolveBilling(vehiclePricing, reservation);

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="reservations" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/admin/reservations/${reservation.id}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 transition-colors hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a la reservation
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
            Modifier le contrat #{reservation.id}
          </h1>

          <div className="mt-6">
            <ContractEditForm
              action={updateReservationContractAction.bind(null, reservation.id)}
              initial={{
                full_name: reservation.full_name,
                age: reservation.age,
                cin_number: reservation.cin_number,
                license_issue_date: reservation.license_issue_date,
                driver_address: reservation.driver_address,
                driver_phone: reservation.driver_phone,
                driver_license_number: reservation.driver_license_number,
                driver_passport_number: reservation.driver_passport_number,

                has_second_driver: reservation.has_second_driver,
                second_driver_full_name: reservation.second_driver_full_name,
                second_driver_address: reservation.second_driver_address,
                second_driver_phone: reservation.second_driver_phone,
                second_driver_cin_number: reservation.second_driver_cin_number,
                second_driver_license_number: reservation.second_driver_license_number,
                second_driver_passport_number: reservation.second_driver_passport_number,

                vehicle_label: reservation.vehicle_label,
                registration_plate: reservation.registration_plate,

                start_date: reservation.start_date,
                end_date: reservation.end_date,
                start_time: reservation.start_time,
                end_time: reservation.end_time,

                mileage_start: reservation.mileage_start,
                mileage_end: reservation.mileage_end,
                damages: reservation.damages,
                equipment: reservation.equipment,
                delivery_fee: Number(reservation.delivery_fee),
                pickup_fee: Number(reservation.pickup_fee),

                fait_a: reservation.fait_a,
                override_total_ht: reservation.override_total_ht,
                override_tva: reservation.override_tva,
                override_total_ttc: reservation.override_total_ttc,
              }}
              calculated={{
                totalHT: billing.calculatedTotalHT,
                tva: billing.calculatedTVA,
                totalTTC: billing.calculatedTotalTTC,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}