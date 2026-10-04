import Link from "next/link";
import { ArrowLeft, FilePlus } from "lucide-react";
import { getVehicles } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import NewContractForm from "@/components/admin/NewContractForm";

export default async function NewContractPage() {
  const vehicles = await getVehicles();

  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="contracts" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/real/contracts"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 transition-colors hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Contrats
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-red-primary)]/10 text-[var(--color-red-primary)]">
              <FilePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
                Nouveau contrat
              </h1>
              <p className="mt-1 text-sm text-black/50">
                Remplissez le contrat, puis envoyez le lien de signature au client.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
            <NewContractForm
              vehicles={vehicles.map((v) => ({
                id: v.id,
                label: `${v.brand} ${v.model}`,
              }))}
            />
          </div>
        </div>
      </main>
    </div>
  );
}