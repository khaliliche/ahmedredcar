import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PenLine, FileText } from "lucide-react";
import {
  getReservationById,
  getVehicleById,
  getVehicles,
  getBlockingReservation,
} from "@/lib/db";
import { saveContractAction, generateContractAction } from "@/app/admin/real/actions";
import { resolveContractBilling, DEFAULT_MIN_RENTAL_DAYS } from "@/lib/contract";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContractForm from "@/components/admin/ContractForm";
import SendSigningLinkButton from "@/components/admin/SendSigningLinkButton";

function toIso(value: string | Date) {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 10);
}

const disabledBtn =
  "flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-black/10 px-3 py-1.5 text-xs font-semibold text-black/30";

export default async function ContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const reservation = await getReservationById(Number(id));

  if (!reservation) {
    notFound();
  }

  const [vehicle, vehicles, blocked] = await Promise.all([
    reservation.vehicle_id ? getVehicleById(reservation.vehicle_id) : Promise.resolve(null),
    getVehicles(),
    reservation.vehicle_id
      ? getBlockingReservation(
          reservation.vehicle_id,
          toIso(reservation.start_date),
          toIso(reservation.end_date),
          reservation.id
        )
      : Promise.resolve(null),
  ]);

  const vehiclePricing = {
    price_per_day: vehicle?.price_per_day ?? 0,
    price_extended_15: vehicle?.price_extended_15 ?? vehicle?.price_per_day ?? 0,
    price_monthly_30: vehicle?.price_monthly_30 ?? vehicle?.price_per_day ?? 0,
    min_rental_days: vehicle?.min_rental_days ?? DEFAULT_MIN_RENTAL_DAYS,
  };
  const billing = resolveContractBilling(vehiclePricing, reservation);

  const showSteps =
    saved === "1" ||
    Boolean(reservation.contract_number) ||
    Boolean(reservation.signed_at) ||
    Boolean(reservation.signed_2_at) ||
    Boolean(reservation.admin_signed_at);

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active={reservation.contract_number ? "contracts" : "reservations"} />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={reservation.contract_number ? "/admin/real/contracts" : "/admin/real/reservations"}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 transition-colors hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {reservation.contract_number ? "Tous les contrats" : "R\u00e9servations"}
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
            {"R\u00e9servation"} #{reservation.id} - {reservation.full_name}
          </h1>
          {reservation.contract_number && (
            <p className="mt-1 text-xs font-semibold text-black/40">
              Contrat {reservation.contract_number}
            </p>
          )}

          <div className="mt-6">
            <ContractForm
              mode="edit"
              reservationId={reservation.id}
              vehicles={vehicles.map((v) => ({ id: v.id, label: `${v.brand} ${v.model}` }))}
              submit={saveContractAction.bind(null, reservation.id)}
              calculated={{
                totalTTC: billing.calculatedTotalTTC,
                days: billing.days,
                dailyRate: billing.dailyRate,
              }}
              initial={{
                contract_number: reservation.contract_number ?? "",

                vehicle_id: reservation.vehicle_id,
                vehicle_label: reservation.vehicle_label,
                registration_plate: reservation.registration_plate,

                first_name: reservation.first_name,
                last_name: reservation.last_name,
                birth_date: reservation.birth_date,
                cin_number: reservation.cin_number,
                cin_issue_date: reservation.cin_issue_date,
                license_issue_date: reservation.license_issue_date,
                driver_address: reservation.driver_address,
                driver_phone: reservation.driver_phone,
                driver_license_number: reservation.driver_license_number,
                driver_passport_number: reservation.driver_passport_number,
                passport_issue_date: reservation.passport_issue_date,

                has_second_driver: reservation.has_second_driver,
                second_driver_first_name: reservation.second_driver_first_name,
                second_driver_last_name: reservation.second_driver_last_name,
                second_driver_birth_date: reservation.second_driver_birth_date,
                second_driver_address: reservation.second_driver_address,
                second_driver_phone: reservation.second_driver_phone,
                second_driver_cin_number: reservation.second_driver_cin_number,
                second_driver_cin_issue_date: reservation.second_driver_cin_issue_date,
                second_driver_license_number: reservation.second_driver_license_number,
                second_driver_license_issue_date: reservation.second_driver_license_issue_date,
                second_driver_passport_number: reservation.second_driver_passport_number,
                second_driver_passport_issue_date: reservation.second_driver_passport_issue_date,

                start_date: reservation.start_date,
                end_date: reservation.end_date,
                start_time: reservation.start_time,
                end_time: reservation.end_time,
                departure_place: reservation.departure_place,
                return_place: reservation.return_place,

                advance: Number(reservation.advance),
                override_total_ttc:
                  reservation.override_total_ttc != null
                    ? Number(reservation.override_total_ttc)
                    : null,
                prolongation: reservation.prolongation,
                expected_return_date: reservation.expected_return_date,
                expected_return_time: reservation.expected_return_time,

                fuel_level: reservation.fuel_level,
                fuel_type: reservation.fuel_type,
                damages: reservation.damages,
              }}
            />
          </div>

          {showSteps && (
            <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
                Signatures
              </h2>

              {blocked ? (
                <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {"Signatures d\u00e9sactiv\u00e9es : voiture r\u00e9serv\u00e9e jusqu'au " + blocked.end_label + "."}
                </p>
              ) : (
                <p className="mt-3 text-sm text-black/50">
                  Envoyez les liens de signature, puis signez pour l&apos;agence.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {blocked ? (
                  <>
                    <button type="button" disabled className={disabledBtn}>
                      <PenLine className="h-3.5 w-3.5" />
                      Envoyer au client (WhatsApp)
                    </button>
                    {reservation.has_second_driver && (
                      <button type="button" disabled className={disabledBtn}>
                        <PenLine className="h-3.5 w-3.5" />
                        Envoyer au 2e conducteur (WhatsApp)
                      </button>
                    )}
                    <button type="button" disabled className={disabledBtn}>
                      Signature agence
                    </button>
                  </>
                ) : (
                  <>
                    <SendSigningLinkButton
                      reservationId={reservation.id}
                      signedAt={reservation.signed_at}
                      label="Envoyer au client (WhatsApp)"
                    />
                    {reservation.has_second_driver && (
                      <SendSigningLinkButton
                        reservationId={reservation.id}
                        signedAt={reservation.signed_2_at}
                        driver="second"
                        label="Envoyer au 2e conducteur (WhatsApp)"
                      />
                    )}
                    {reservation.admin_signed_at ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          Agence signe le {new Date(reservation.admin_signed_at).toLocaleString("fr-FR")}
                        </span>
                        <Link
                          href={`/admin/real/reservations/${reservation.id}/agency-sign`}
                          className="text-xs font-semibold text-black/50 underline hover:text-black/80"
                        >
                          Modifier
                        </Link>
                      </span>
                    ) : (
                      <Link
                        href={`/admin/real/reservations/${reservation.id}/agency-sign`}
                        className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black/80"
                      >
                        Signature agence
                      </Link>
                    )}
                  </>
                )}
              </div>
              <div className="mt-5 border-t border-black/10 pt-4">
                {blocked ? (
                  <button type="button" disabled className={disabledBtn}>
                    <FileText className="h-3.5 w-3.5" />
                    {"G\u00e9n\u00e9rer le contrat"}
                  </button>
                ) : (
                  <form action={generateContractAction.bind(null, reservation.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-[var(--color-red-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                    >
                      <FileText className="h-4 w-4" />
                      {"G\u00e9n\u00e9rer le contrat"}
                    </button>
                  </form>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}