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
    return { title: "Véhicule introuvable | Ahmed Red Cars" };
  }

  return {
    title: `Location ${vehicle.brand} ${vehicle.model} | Ahmed Red Cars`,
    description: `Louez une ${vehicle.brand} ${vehicle.model} à partir de ${vehicle.price_per_day} DH/jour avec Ahmed Red Cars.`,
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
    <main className="pb-32 pt-24 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <Link
          href="/vehicules"
          className="inline-flex items-center gap-2 py-2 text-sm text-black/60 transition-colors hover:text-black"
        >
          <ArrowLeft size={16} />
          Retour aux vehicules
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:mt-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--color-charcoal)] sm:rounded-none">
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

            <div className="absolute bottom-3 right-3 rotate-[-3deg] border border-[var(--color-ink)]/15 bg-[var(--color-mist)] px-3 py-2 text-right shadow-md sm:bottom-4 sm:right-4 sm:px-4 sm:py-3">
              <p className="font-display text-lg font-extrabold leading-none text-[var(--color-ink)] sm:text-2xl">
                {vehicle.price_per_day} DH
              </p>
              <p className="mt-1 text-[11px] text-black/50 sm:text-xs">par jour</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
            <div>
              <h1 className="break-words font-display text-2xl font-extrabold leading-tight text-[var(--color-ink)] sm:text-4xl">
                {vehicle.brand} {vehicle.model}
              </h1>
            </div>

            {vehicle.description && (
              <div className="border-y border-black/10 py-4 sm:py-5">
                <p className="whitespace-pre-line break-words font-body text-sm leading-relaxed text-black/70 sm:text-base">
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