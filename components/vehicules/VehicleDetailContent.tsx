"use client";

import type { Vehicle } from "@/lib/db";
import VehicleCard from "@/components/home/VehicleCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function VehiclesPageContent({
  vehicles,
  ville,
  depart,
  retour,
}: {
  vehicles: Vehicle[];
  ville?: string;
  depart?: string;
  retour?: string;
}) {
  const { t } = useLanguage();
  const hasSearch = Boolean(ville && depart && retour);

  return (
    <main className="pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            {t("vehiclesPage.title")}
          </h1>

          {hasSearch ? (
            <p className="mt-2 font-body text-sm text-black/60 sm:mt-3 sm:text-base">
              {t("vehiclesPage.availability", {
                ville: ville!,
                depart: depart!,
                retour: retour!,
              })}
            </p>
          ) : (
            <p className="mt-2 font-body text-sm text-black/60 sm:mt-3 sm:text-base">
              {t("vehiclesPage.allFleet")}
            </p>
          )}
        </div>

        {vehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 border border-dashed border-black/15 py-16 text-center">
            <p className="font-body text-black/60">
              {t("vehiclesPage.noVehicles")}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
