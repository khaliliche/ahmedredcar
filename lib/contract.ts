// Shared constants and billing math for the rental contract (Feature 1)
// and the availability check (Feature 2). The PDF renderer (Lot 3) will
// build on top of these.

export const DAMAGE_ZONES = [
  "Avant",
  "Arrière",
  "Côté gauche",
  "Côté droit",
  "Toit",
  "Pare-brise",
  "Intérieur",
  "Jantes",
] as const;

// Matches the physical "Équipement du véhicule" checklist on the paper
// contract exactly (3 printed columns).
export const EQUIPMENT_ITEMS = [
  { key: "carte_grise", label: "Carte grise" },
  { key: "vignette", label: "Vignette" },
  { key: "assurance", label: "Assurance" },
  { key: "visite_technique", label: "Visite technique" },
  { key: "autorisation_circulation", label: "Autorisation de circulation" },
  { key: "manivelle", label: "Manivelle" },
  { key: "cric", label: "Cric" },
  { key: "roue_secours", label: "Roue de secours" },
  { key: "jantes_aluminium", label: "Jantes aluminium" },
  { key: "enjoliveur", label: "Enjoliveur" },
  { key: "housses_auto", label: "Housses auto" },
  { key: "tapis", label: "Tapis" },
  { key: "allume_cigare", label: "Allume cigare" },
  { key: "extincteur", label: "Extincteur" },
] as const;

// Matches the "Dommages" legend on the paper contract: each damage type
// has a fixed symbol drawn on the vehicle diagram.
export const DAMAGE_TYPES = [
  { value: "Éraflure", symbol: "/" },
  { value: "Bosse", symbol: "X" },
  { value: "Manque", symbol: "O" },
] as const;

export const TVA_RATE = 0.2;

export function daysBetween(start: string | Date, end: string | Date) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function calculateBilling(params: {
  pricePerDay: number;
  startDate: string;
  endDate: string;
  deliveryFee: number;
  pickupFee: number;
}) {
  const days = daysBetween(params.startDate, params.endDate);
  const totalHT = params.pricePerDay * days + params.deliveryFee + params.pickupFee;
  const tva = totalHT * TVA_RATE;
  const totalTTC = totalHT + tva;
  return { days, totalHT, tva, totalTTC };
}
