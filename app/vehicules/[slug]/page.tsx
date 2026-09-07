import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getVehicles, getVehicleBySlug } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/site-config";

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

  const whatsappMessage = `Bonjour, je souhaite reserver le ${vehicle.brand} ${vehicle.model} (${vehicle.price_per_day} DH/jour).`;

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

            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-center bg-[var(--color-red-primary)] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)] sm:inline-flex"
            >
              Reserver ce vehicule via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:hidden">
        <a
          href={buildWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-red-primary)] text-sm font-bold text-white transition-all active:scale-[0.98]"
        >
          Reserver via WhatsApp - {vehicle.price_per_day} DH/j
        </a>
      </div>
    </main>
  );
}