
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/db";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useLanguage();

  return (
    <article className="group overflow-hidden border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/vehicules/${vehicle.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-mist)]">
          {vehicle.image_url ? (
            <Image
              src={vehicle.image_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-body text-sm text-black/40">
              {t("vehiclesPage.noImage")}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-red-primary)]">
                {vehicle.brand}
              </p>

              <h3 className="mt-1 font-display text-xl font-bold text-[var(--color-ink)]">
                {vehicle.model}
              </h3>
            </div>

            <div className="shrink-0 text-right">
              <span className="font-display text-lg font-extrabold text-[var(--color-ink)]">
                {vehicle.price_per_day} €
              </span>

              <span className="block font-body text-xs text-black/50">
                {t("vehicle.perDay")}
              </span>
            </div>
          </div>

          {vehicle.description && (
            <p className="mt-3 line-clamp-2 font-body text-sm leading-relaxed text-black/60">
              {vehicle.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2 font-body text-sm font-semibold text-[var(--color-red-primary)]">
            {t("featured.viewVehicle")}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

