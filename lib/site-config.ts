export const siteConfig = {
  name: "Ahmed Red Car",
  tagline: "Location de voitures au Maroc",
  phone: "+212 6 00 00 00 00",
  whatsappNumber: "212600000000",
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Nos vehicules", href: "/vehicules" },
    { label: "Comment ca marche", href: "/#comment-ca-marche" },
    { label: "A propos", href: "/#a-propos" },
    { label: "Contact", href: "/#contact" },
  ],
};

export function buildWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
