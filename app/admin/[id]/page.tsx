import { notFound } from "next/navigation";
import VehicleForm from "@/components/admin/VehicleForm";
import { getVehicleById } from "@/lib/db";
import { updateVehicleAction } from "@/app/admin/actions";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicleById(Number(id));

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
        Modifier {vehicle.brand} {vehicle.model}
      </h1>

      <div className="mt-8">
        <VehicleForm
          action={updateVehicleAction.bind(null, vehicle.id)}
          vehicle={vehicle}
        />
      </div>
    </main>
  );
}
