import { createVehicleAction } from "@/app/admin/actions";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function NewVehiclePage() {
  return (
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="vehicules" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
            Ajouter un véhicule
          </h1>

          <form action={createVehicleAction} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)]">Marque</label>
              <input
                type="text"
                name="brand"
                required
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)]">Modèle</label>
              <input
                type="text"
                name="model"
                required
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)]">Prix / jour (DH)</label>
              <input
                type="number"
                name="price_per_day"
                required
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)]">Description</label>
              <textarea
                name="description"
                rows={4}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)]">Photo</label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[var(--color-red-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              Enregistrer
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}