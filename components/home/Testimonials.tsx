"use client";

import { Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const cardClasses =
  "group flex flex-col items-start gap-3 rounded-2xl border border-[#d4a017]/30 bg-white/[0.06] p-5 backdrop-blur-sm transition-all duration-300 sm:p-6";
const cardHover =
  "hover:-translate-y-1 hover:border-[#f0c040] hover:bg-white/[0.12]";

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-[var(--color-ink)] via-[var(--color-charcoal)] to-[var(--color-ink)] py-16 sm:py-20"
    >
      <div className="relative mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#5c0a0a] via-[#8a1010] to-[#3d0707] px-5 py-14 sm:mx-6 sm:px-8 sm:py-16 lg:mx-10 lg:px-10 xl:mx-auto xl:max-w-6xl">
        <div className="max-w-lg">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {t("contact.title")}
          </h2>

          <span
            className="mt-3 block h-1 w-14 rounded-full bg-[#d4a017]"
            aria-hidden="true"
          />

          <p className="mt-3 font-body text-sm text-white/70 sm:text-base">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {/* Téléphone */}
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className={`${cardClasses} ${cardHover}`}
          >
            <Phone className="text-[#f0c040]" size={22} />

            <span className="font-display font-bold text-white">
              {t("contact.phone")}
            </span>

            <span className="font-body text-sm text-white/70" dir="ltr">
              {siteConfig.phone}
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href={buildWhatsAppLink(t("whatsapp.defaultMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClasses} ${cardHover}`}
          >
            <MessageCircle className="text-[#f0c040]" size={22} />

            <span className="font-display font-bold text-white">
              {t("contact.whatsapp")}
            </span>

            <span className="font-body text-sm text-white/70">
              {t("contact.whatsappResponse")}
            </span>
          </a>

          {/* Zone de service */}
          <div className={cardClasses}>
            <MapPin className="text-[#f0c040]" size={22} />

            <span className="font-display font-bold text-white">
              {t("contact.serviceZone")}
            </span>

            <span className="font-body text-sm text-white/70">
              {t("contact.serviceZoneText")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}