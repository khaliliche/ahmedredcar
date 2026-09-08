import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";
import { getVehicleById } from "@/lib/db";
import { updateVehicleAction } from "@/app/admin/actions";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
    <div className="min-h-screen bg-[var(--color-mist)]/40 lg:flex">
      <AdminSidebar active="vehicules" />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 transition-colors hover:text-black/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Véhicules
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)] truncate">
            Modifier {vehicle.brand} {vehicle.model}
          </h1>

          <div className="mt-8">
            <VehicleForm
              action={updateVehicleAction.bind(null, vehicle.id)}
              vehicle={vehicle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}