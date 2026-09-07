import type { Vehicle } from "@/lib/db";

export default function VehicleForm({
  action,
  vehicle,
}: {
  action: (formData: FormData) => void;
  vehicle?: Vehicle;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <input
        type="hidden"
        name="existing_image_url"
        defaultValue={vehicle?.image_url ?? ""}
      />

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Marque</span>
        <input
          type="text"
          name="brand"
          required
          defaultValue={vehicle?.brand}
          className="rounded-lg border border-black/15 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Modele</span>
        <input
          type="text"
          name="model"
          required
          defaultValue={vehicle?.model}
          className="rounded-lg border border-black/15 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Prix par jour (DH)</span>
        <input
          type="number"
          name="price_per_day"
          required
          min={0}
          defaultValue={vehicle?.price_per_day}
          className="rounded-lg border border-black/15 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          name="description"
          rows={5}
          defaultValue={vehicle?.description ?? ""}
          className="rounded-lg border border-black/15 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">
          Photo {vehicle ? "(laisser vide pour garder l'actuelle)" : ""}
        </span>
        {vehicle?.image_url && (
          <img
            src={vehicle.image_url}
            alt="Photo actuelle"
            className="mb-2 h-32 w-48 rounded-lg object-cover"
          />
        )}
        <input type="file" name="image" accept="image/*" />
      </label>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-[var(--color-red-primary)] px-4 py-2.5 font-semibold text-white"
      >
        Enregistrer
      </button>
    </form>
  );
}
