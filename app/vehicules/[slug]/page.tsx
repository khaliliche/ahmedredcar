import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Fuel, Users, Cog, ArrowLeft } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { buildWhatsAppLink } from "@/lib/site-config";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = vehicles.find((v) => v.slug === slug);

  if (!vehicle) {
    return {
      title: "Véhicule introuvable | Ahmed Red Car",
    };
  }

  return {
    title: `Location ${vehicle.brand} ${vehicle.model} | Ahmed Red Car`,
    description: `Louez une ${vehicle.brand} ${vehicle.model} à partir de ${vehicle.pricePerDay} DH/jour avec Ahmed Red Car.`,
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const vehicle = vehicles.find((v) => v.slug === slug);

  if (!vehicle) {
    notFound();
  }

  const whatsappMessage = `Bonjour, je souhaite réserver le ${vehicle.brand} ${vehicle.model} (${vehicle.pricePerDay} DH/jour).`;

  return (
    <main className="pt-32 pb-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        {/* Retour */}
        <Link
          href="/vehicules"
          className="inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black"
        >
          <ArrowLeft size={16} />
          Retour aux véhicules
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image du véhicule */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-charcoal)]">
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Informations du véhicule */}
          <div className="flex flex-col gap-6">
            {/* Titre et prix */}
            <div>
              <span className="inline-block bg-[var(--color-red-primary)] px-3 py-1 text-xs font-semibold text-white">
                {vehicle.category}
              </span>

              <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--color-ink)]">
                {vehicle.brand} {vehicle.model}
              </h1>

              <p className="mt-2 font-body text-lg text-black/60">
                À partir de{" "}
                <span className="font-semibold text-[var(--color-red-primary)]">
                  {vehicle.pricePerDay} DH
                </span>{" "}
                / jour
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-3 gap-4 border-y border-black/10 py-5">
              {/* Transmission */}
              <div className="flex flex-col items-center gap-2 text-center">
                <Cog
                  size={20}
                  className="text-[var(--color-red-primary)]"
                />

                <span className="text-xs text-black/60">
                  {vehicle.transmission}
                </span>
              </div>

              {/* Carburant */}
              <div className="flex flex-col items-center gap-2 text-center">
                <Fuel
                  size={20}
                  className="text-[var(--color-red-primary)]"
                />

                <span className="text-xs text-black/60">
                  {vehicle.fuel}
                </span>
              </div>

              {/* Places */}
              <div className="flex flex-col items-center gap-2 text-center">
                <Users
                  size={20}
                  className="text-[var(--color-red-primary)]"
                />

                <span className="text-xs text-black/60">
                  {vehicle.seats} places
                </span>
              </div>
            </div>

            {/* Bouton WhatsApp */}
            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-red-primary)] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
            >
              Réserver ce véhicule via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
