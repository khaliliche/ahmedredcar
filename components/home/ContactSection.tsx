import { Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <div className="max-w-lg">
        <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
          Contact
        </h2>
        <p className="mt-3 font-body text-black/60">
          Une question, une reservation particuliere ? Contactez-nous directement.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <a
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="flex flex-col items-start gap-3 border border-black/10 p-6 transition-colors hover:border-[var(--color-red-primary)]"
        >
          <Phone className="text-[var(--color-red-primary)]" size={22} />
          <span className="font-display font-bold text-[var(--color-ink)]">Telephone</span>
          <span className="font-body text-sm text-black/60">{siteConfig.phone}</span>
        </a>

        <a
          href={buildWhatsAppLink(
            "Bonjour Ahmed Red Car, je souhaite avoir des informations."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-start gap-3 border border-black/10 p-6 transition-colors hover:border-[var(--color-red-primary)]"
        >
          <MessageCircle className="text-[var(--color-red-primary)]" size={22} />
          <span className="font-display font-bold text-[var(--color-ink)]">WhatsApp</span>
          <span className="font-body text-sm text-black/60">Reponse rapide, 7j/7</span>
        </a>

        <div className="flex flex-col items-start gap-3 border border-black/10 p-6">
          <MapPin className="text-[var(--color-red-primary)]" size={22} />
          <span className="font-display font-bold text-[var(--color-ink)]">Zone de service</span>
          <span className="font-body text-sm text-black/60">
            Rabat, Casablanca, Marrakech et principales villes du Maroc
          </span>
        </div>
      </div>
    </section>
  );
}
