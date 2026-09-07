"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/db";
import VehicleCard from "@/components/home/VehicleCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeaturedVehiclesGrid({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  const { t } = useLanguage();

  return (
    <section id="vehicules" className="mx-auto max-w-6xl py-20 lg:px-10">
      <div className="flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-0">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            {t("featured.title")}
          </h2>

          <p className="mt-3 font-body text-black/60">
            {t("featured.subtitle")}
          </p>
        </div>

        <Link
          href="/vehicules"
          className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-[var(--color-red-primary)] hover:text-[var(--color-red-dark)]"
        >
          {t("featured.seeAll")}
          <ArrowRight size={16} />
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <p className="mt-10 px-6 text-black/50 lg:px-0">
          {t("featured.noVehicles")}
        </p>
      ) : (
        <>
          <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4 pl-6 pr-6 sm:hidden">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-10 hidden gap-6 px-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:px-0">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

