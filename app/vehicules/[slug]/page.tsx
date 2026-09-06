
import { notFound } from "next/navigation";
import Link from "next/link";
import { Fuel, Users, Cog, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { vehicles } from "@/data/vehicles";
import { buildWhatsAppLink } from "@/lib/site-config";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = vehicles.find((v) => v.slug === slug);

  if (!vehicle) notFound();

  const whatsappMessage = `Bonjour, je souhaite reserver le ${vehicle.brand} ${vehicle.model} (${vehicle.pricePerDay} DH/jour).`;

  return (
    <main className="pt-32 pb-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">

        {/* Header / Logo */}
        <div className="mb-10 flex items-center justify-center">
          <Link href="/" aria-label="Ahmed Redcar - Accueil">
            <Image
              src="/images/ahmed-redcar-logo.png"
              alt="Ahmed Redcar - Car Rental"
              width={220}
              height={220}
              className="h-auto w-[180px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Back button */}
        <Link
          href="/vehicules"
          className="inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black"
        >
          <ArrowLeft size={16} />
          Retour aux vehicules
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* Vehicle image */}
          <div className="flex aspect-[4/3] items-center justify-center bg-[var(--color-charcoal)]">
            <span className="font-display text-2xl font-bold text-white/20">
              {vehicle.brand} {vehicle.model}
            </span>
          </div>

          {/* Vehicle information */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-block bg-[var(--color-red-primary)] px-3 py-1 text-xs font-semibold text-white">
                {vehicle.category}
              </span>

              <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--color-ink)]">
                {vehicle.brand} {vehicle.model}
              </h1>

              <p className="mt-2 font-body text-lg text-black/60">
                A partir de{" "}
                <span className="font-semibold text-[var(--color-red-primary)]">
                  {vehicle.pricePerDay} DH
                </span>{" "}
                / jour
              </p>
            </div>

            {/* Vehicle specifications */}
            <div className="grid grid-cols-3 gap-4 border-y border-black/10 py-5">

              <div className="flex flex-col items-center gap-2 text-center">
                <Cog
                  size={20}
                  className="text-[var(--color-red-primary)]"
                />
                <span className="text-xs text-black/60">
                  {vehicle.transmission}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <Fuel
                  size={20}
                  className="text-[var(--color-red-primary)]"
                />
                <span className="text-xs text-black/60">
                  {vehicle.fuel}
                </span>
              </div>

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

            {/* WhatsApp reservation */}
            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-red-primary)] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
            >
              Reserver ce vehicule via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

