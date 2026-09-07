import VehicleForm from "@/components/admin/VehicleForm";
import { createVehicleAction } from "@/app/admin/actions";

export default function NewVehiclePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
        Ajouter un vehicule
      </h1>

      <div className="mt-8">
        <VehicleForm action={createVehicleAction} />
      </div>
    </main>
  );
}
