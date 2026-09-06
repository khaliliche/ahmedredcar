"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/site-config";

export default function WhatsAppFloat() {
  const pathname = usePathname();

  // Les pages détail des véhicules ont déjà leur propre CTA WhatsApp
  // sticky sur mobile, donc on masque la bulle flottante sur ces pages.
  const hasOwnStickyCTA = /^\/vehicules\/[^/]+$/.test(pathname ?? "");

  const whatsappMessage =
    "Bonjour Ahmed Red Car, je souhaite avoir des informations.";

  return (
    <a
      href={buildWhatsAppLink(whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Ahmed Red Car sur WhatsApp"
      className={`group fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 active:scale-95 sm:right-6 sm:h-16 sm:w-16 ${
        hasOwnStickyCTA ? "hidden sm:flex" : "flex"
      }`}
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {/* Anneau discret */}
      <span
        className="absolute inset-0 -z-10 rounded-full bg-[#22c55e] opacity-30"
        aria-hidden="true"
      />

      <MessageCircle
        size={26}
        strokeWidth={2.5}
        className="transition-transform group-hover:rotate-12 sm:size-7"
      />
    </a>
  );
}