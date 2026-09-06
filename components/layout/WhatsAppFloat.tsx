import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/site-config";

export default function WhatsAppFloat() {
  const whatsappMessage = "Bonjour Ahmed Red Car, je souhaite avoir des informations.";
  return (
    <a
      href={buildWhatsAppLink(whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Ahmed Red Car sur WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-110 hover:shadow-green-500/60 animate-pulse-glow group"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-green-500 opacity-40 animate-ping" aria-hidden="true" />
      <MessageCircle size={28} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
    </a>
  );
}