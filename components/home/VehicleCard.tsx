"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import type { Vehicle } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.7 4.607 1.905 6.475L4 29l7.72-1.867A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.357l-.355-.21-4.585 1.108 1.127-4.47-.232-.366A9.71 9.71 0 0 1 5.25 15c0-5.93 4.823-10.75 10.754-10.75S26.75 9.07 26.75 15 21.935 24.75 16.004 24.75Zm5.55-7.36c-.304-.152-1.797-.888-2.076-.99-.279-.101-.482-.152-.685.152-.203.305-.786.99-.964 1.194-.177.203-.355.229-.66.076-.304-.152-1.283-.473-2.444-1.51-.903-.806-1.514-1.802-1.692-2.107-.177-.305-.019-.47.133-.622.137-.136.304-.355.456-.533.152-.177.203-.305.304-.508.101-.203.05-.381-.025-.533-.076-.152-.685-1.653-.939-2.264-.247-.594-.499-.514-.685-.524l-.584-.01c-.203 0-.533.076-.812.381-.279.305-1.066 1.042-1.066 2.542s1.091 2.95 1.243 3.153c.152.203 2.148 3.28 5.204 4.601.727.314 1.294.502 1.736.642.729.232 1.393.199 1.918.121.585-.088 1.797-.735 2.05-1.444.253-.71.253-1.318.177-1.444-.076-.127-.279-.203-.583-.355Z" />
    </svg>
  );
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useLanguage();

  const whatsappHref = buildWhatsAppLink(
    t("vehicleDetail.whatsappMessage", {
      brand: vehicle.brand,
      model: vehicle.model,
      price: vehicle.price_per_day,
    })
  );

  return (
    <article className="group flex flex-col overflow-hidden border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/vehicules/${vehicle.slug}`} className="block flex-1">
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
              {t("common.noPhoto")}
            </div>
          )}
        </div>

        <div className="p-5 pb-4">
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
              <span className="block font-body text-[11px] font-medium uppercase tracking-wide text-black/45">
                {t("common.fromPrice")}
              </span>

              <span className="font-display text-lg font-extrabold text-[var(--color-ink)]">
                {vehicle.price_per_day} DH
              </span>

              <span className="block font-body text-xs text-black/50">
                {t("vehicleDetail.perDay")}
              </span>
            </div>
          </div>

          {vehicle.description && (
            <p className="mt-3 line-clamp-2 font-body text-sm leading-relaxed text-black/60">
              {vehicle.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 font-body text-sm font-semibold text-[var(--color-red-primary)]">
            {t("common.seeVehicle")}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-2.5 px-5 pb-5">
        <Link
          href={`/vehicules/${vehicle.slug}?reserver=1`}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-charcoal)] to-[var(--color-red-primary)] px-4 py-2.5 font-body text-sm font-bold text-white transition-all hover:brightness-125"
        >
          <CalendarCheck size={16} />
          {t("common.reserveOnline")}
        </Link>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 bg-[#25D366] px-4 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-[#1ebe5b]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t("common.reserveWhatsapp")}
        </a>
      </div>
    </article>
  );
}