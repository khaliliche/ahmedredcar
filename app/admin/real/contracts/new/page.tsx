import Link from "next/link";
import { FilePlus } from "lucide-react";
import { getVehicles, getReservations } from "@/lib/db";
import { createManualContractAction } from "@/app/admin/real/contracts/new/actions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContractForm, { type ContractInitial } from "@/components/admin/ContractForm";

const EMPTY: ContractInitial = {
  contract_number: "",

  vehicle_id: null,
  vehicle_label: "",
  registration_plate: "",

  first_name: "",
  last_name: "",
  birth_date: "",
  cin_number: "",
  cin_issue_date: "",
  license_issue_date: "",
  driver_address: "",
  driver_phone: "",
  driver_license_number: "",
  driver_passport_number: "",
  passport_issue_date: "",

  has_second_driver: false,
  second_driver_first_name: "",
  second_driver_last_name: "",
  second_driver_birth_date: "",
  second_driver_address: "",
  second_driver_phone: "",
  second_driver_cin_number: "",
  second_driver_cin_issue_date: "",
  second_driver_license_number: "",
  second_driver_license_issue_date: "",
  second_driver_passport_number: "",
  second_driver_passport_issue_date: "",

  start_date: "",
  end_date: "",
  start_time: "10:00",
  end_time: "10:00",
  departure_place: "",
  return_place: "",

  advance: 0,
  override_total_ttc: null,
  prolongation: "",
  expected_return_date: "",
  expected_return_time: "",

  fuel_level: "",
  fuel_type: "",
  damages: [],
};

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function NewContractPage() {
  const [vehicles, all] = await Promise.all([getVehicles(), getReservations()]);
  const guichet = all.filter((r) => r.source === "walk_in").slice(0, 20);

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="new-contract" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-red-primary)]/10 text-[var(--color-red-primary)]">
              <FilePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
                Nouveau contrat
              </h1>
              <p className="mt-1 text-sm text-black/50">
                Remplissez le contrat puis cliquez sur Enregistrer.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ContractForm
              mode="create"
              vehicles={vehicles.map((v) => ({ id: v.id, label: `${v.brand} ${v.model}` }))}
              submit={createManualContractAction}
              initial={EMPTY}
            />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
              Contrats guichet
            </h2>
            {guichet.length === 0 ? (
              <p className="mt-3 text-sm text-black/40">Aucun contrat guichet pour le moment.</p>
            ) : (
              <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white">
                {guichet.map((r) => (
                  <Link
                    key={r.id}
                    href={`/admin/real/reservations/${r.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 px-4 py-3 text-sm last:border-0 hover:bg-black/[0.02]"
                  >
                    <span className="font-semibold text-[var(--color-ink)]">{r.full_name}</span>
                    <span className="text-black/60">{r.vehicle_label}</span>
                    <span className="text-black/50">
                      {formatDate(r.start_date)} - {formatDate(r.end_date)}
                    </span>
                    <span className="text-xs font-semibold text-black/40">{r.contract_number}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}