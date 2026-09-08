export const siteConfig = {
  name: "Ahmed Red Car",
  tagline: "Location de voitures au Maroc",
  phone: "+212 6 61 41 27 59",
  whatsappNumber: "212661412759",
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

export function buildReservationWhatsAppMessage(data: {
  vehicleLabel: string;
  fullName: string;
  age: number;
  cinNumber: string;
  licenseIssueDate: string;
  startDate: string;
  endDate: string;
}) {
  return [
    `Nouvelle demande de reservation - Ahmed Red Car`,
    ``,
    `Vehicule : ${data.vehicleLabel}`,
    `Client : ${data.fullName} (${data.age} ans)`,
    `CIN N° : ${data.cinNumber}`,
    `Permis obtenu le : ${data.licenseIssueDate}`,
    `Du : ${data.startDate}`,
    `Au : ${data.endDate}`,
  ].join("\n");
}