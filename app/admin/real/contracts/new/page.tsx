import Link from "next/link";
import { FilePlus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function NewContractPage() {
  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="new-contract" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-red-primary)]/10 text-[var(--color-red-primary)]">
              <FilePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
                Nouveau contrat
              </h1>
              <p className="mt-1 text-sm text-black/50">
                Saisissez le numéro de série, puis cliquez sur Contrat : le PDF s&apos;ouvre, prêt à remplir.
              </p>
            </div>
          </div>

          <form
            action="/admin/real/contracts/blank"
            method="get"
            target="_blank"
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5"
          >
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-black/60">N° de série</span>
              <input
                name="serial"
                required
                maxLength={40}
                autoFocus
                placeholder="Ex : 0125"
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-lg bg-[var(--color-red-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              Contrat
            </button>
          </form>

          <p className="mt-6 text-sm text-black/50">
            Besoin d&apos;enregistrer le contrat dans le système (véhicule, dates, signatures) ?{" "}
            <Link href="/admin/real/contracts/new/full" className="font-semibold underline">
              Formulaire complet
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}