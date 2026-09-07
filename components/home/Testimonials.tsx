
"use client";

import { Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <div className="max-w-lg">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
          {t("contact.title")}
        </h2>

        <p className="mt-2 font-body text-sm text-black/60 sm:mt-3 sm:text-base">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
        {/* Téléphone */}
        <a
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="group flex flex-col items-start gap-3 border-t-2 border-[var(--color-red-primary)] bg-[var(--color-mist)] p-5 transition-colors hover:bg-white sm:p-6"
        >
          <Phone className="text-[var(--color-red-primary)]" size={22} />

          <span className="font-display font-bold text-[var(--color-ink)]">
            {t("contact.phone")}
          </span>

          <span className="font-body text-sm text-black/60">
            {siteConfig.phone}
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={buildWhatsAppLink(t("whatsapp.defaultMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start gap-3 border-t-2 border-[var(--color-red-primary)] bg-[var(--color-mist)] p-5 transition-colors hover:bg-white sm:p-6"
        >
          <MessageCircle className="text-[var(--color-red-primary)]" size={22} />

          <span className="font-display font-bold text-[var(--color-ink)]">
            {t("contact.whatsapp")}
          </span>

          <span className="font-body text-sm text-black/60">
            {t("contact.whatsappResponse")}
          </span>
        </a>

        {/* Zone de service */}
        <div className="flex flex-col items-start gap-3 border-t-2 border-[var(--color-brass)] bg-[var(--color-mist)] p-5 sm:p-6">
          <MapPin className="text-[var(--color-brass)]" size={22} />

          <span className="font-display font-bold text-[var(--color-ink)]">
            {t("contact.serviceZone")}
          </span>

          <span className="font-body text-sm text-black/60">
            {t("contact.serviceZoneText")}
          </span>
        </div>
      </div>
    </section>
  );
}