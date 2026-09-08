import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getVehicles, getVehicleBySlug } from "@/lib/db";
import ReservationSection from "@/components/vehicules/ReservationSection";

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return { title: "Véhicule introuvable | Ahmed Red Car" };
  }

  return {
    title: `Location ${vehicle.brand} ${vehicle.model} | Ahmed Red Car`,
    description: `Louez une ${vehicle.brand} ${vehicle.model} à partir de ${vehicle.price_per_day} DH/jour avec Ahmed Red Car.`,
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="pb-28 pt-32 sm:pb-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Link
          href="/vehicules"
          className="inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black"
        >
          <ArrowLeft size={16} />
          Retour aux vehicules
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-charcoal)]">
            {vehicle.image_url ? (
              <Image
                src={vehicle.image_url}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/30">
                Pas de photo
              </div>
            )}

            <div className="absolute bottom-4 right-4 rotate-[-3deg] border border-[var(--color-ink)]/15 bg-[var(--color-mist)] px-4 py-3 text-right shadow-md">
              <p className="font-display text-2xl font-extrabold leading-none text-[var(--color-ink)]">
                {vehicle.price_per_day} DH
              </p>
              <p className="mt-1 text-xs text-black/50">par jour</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display text-4xl font-extrabold text-[var(--color-ink)]">
                {vehicle.brand} {vehicle.model}
              </h1>
            </div>

            {vehicle.description && (
              <div className="border-y border-black/10 py-5">
                <p className="whitespace-pre-line font-body text-black/70">
                  {vehicle.description}
                </p>
              </div>
            )}

            <ReservationSection vehicle={vehicle} />
          </div>
        </div>
      </div>
    </main>
  );
}