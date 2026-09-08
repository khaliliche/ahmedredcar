import type { Vehicle } from "@/lib/db";
import { Image as ImageIcon } from "lucide-react";

const inputClasses =
  "rounded-lg border border-black/15 px-3 py-3 sm:py-2.5 focus:border-[var(--color-red-primary)]/50 focus:outline-none";

export default function VehicleForm({
  action,
  vehicle,
}: {
  action: (formData: FormData) => void;
  vehicle?: Vehicle;
}) {
  return (
    <form action={action} className="flex w-full max-w-lg flex-col gap-5 pb-24 md:pb-2">
      <input
        type="hidden"
        name="existing_image_url"
        defaultValue={vehicle?.image_url ?? ""}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Marque</span>
          <input
            type="text"
            name="brand"
            required
            defaultValue={vehicle?.brand}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Modele</span>
          <input
            type="text"
            name="model"
            required
            defaultValue={vehicle?.model}
            className={inputClasses}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Prix par jour (DH)</span>
        <input
          type="number"
          inputMode="numeric"
          name="price_per_day"
          required
          min={0}
          defaultValue={vehicle?.price_per_day}
          className={`${inputClasses} sm:max-w-[220px]`}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          name="description"
          rows={5}
          defaultValue={vehicle?.description ?? ""}
          className={`${inputClasses} resize-y`}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">
          Photo {vehicle ? "(laisser vide pour garder l'actuelle)" : ""}
        </span>

        {vehicle?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.image_url}
            alt="Photo actuelle"
            className="mb-1 h-44 w-full max-w-xs rounded-xl object-cover sm:h-40"
          />
        )}

        <div className="flex items-center gap-2 rounded-lg border border-dashed border-black/20 bg-black/[0.02] px-3 py-3">
          <ImageIcon className="h-4 w-4 shrink-0 text-black/40" />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm text-black/60 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-ink)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
        </div>
      </label>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur safe-bottom md:static md:z-auto md:mt-2 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div className="mx-auto max-w-lg">
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--color-red-primary)] px-4 py-3 font-semibold text-white shadow-sm transition-transform active:scale-[0.99] md:w-auto md:py-2.5"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
}