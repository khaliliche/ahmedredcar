"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/site-config";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.7 4.607 1.905 6.475L4 29l7.72-1.867A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.357l-.355-.21-4.585 1.108 1.127-4.47-.232-.366A9.71 9.71 0 0 1 5.25 15c0-5.93 4.823-10.75 10.754-10.75S26.75 9.07 26.75 15 21.935 24.75 16.004 24.75Zm5.55-7.36c-.304-.152-1.797-.888-2.076-.99-.279-.101-.482-.152-.685.152-.203.305-.786.99-.964 1.194-.177.203-.355.229-.66.076-.304-.152-1.283-.473-2.444-1.51-.903-.806-1.514-1.802-1.692-2.107-.177-.305-.019-.47.133-.622.137-.136.304-.355.456-.533.152-.177.203-.305.304-.508.101-.203.05-.381-.025-.533-.076-.152-.685-1.653-.939-2.264-.247-.594-.499-.514-.685-.524l-.584-.01c-.203 0-.533.076-.812.381-.279.305-1.066 1.042-1.066 2.542s1.091 2.95 1.243 3.153c.152.203 2.148 3.28 5.204 4.601.727.314 1.294.502 1.736.642.729.232 1.393.199 1.918.121.585-.088 1.797-.735 2.05-1.444.253-.71.253-1.318.177-1.444-.076-.127-.279-.203-.583-.355Z" />
    </svg>
  );
}

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

      <WhatsAppIcon className="h-7 w-7 transition-transform group-hover:rotate-12 sm:h-8 sm:w-8" />
    </a>
  );
}