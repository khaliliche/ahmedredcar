// Shared constants and billing math for the rental contract.

export const DAMAGE_ZONES = [
  "Avant", "Arrière", "Côté gauche", "Côté droit",
  "Toit", "Pare-brise", "Intérieur", "Jantes",
] as const;

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

export const DAMAGE_TYPES = [
  { value: "Éraflure", symbol: "/" },
  { value: "Bosse", symbol: "X" },
  { value: "Manque", symbol: "O" },
] as const;

export const TVA_RATE = 0.2;

// Fallback only — real minimum now lives per-vehicle in the DB
// (vehicles.min_rental_days). This is used if that column is null.
export const DEFAULT_MIN_RENTAL_DAYS = 5;

// Minimal shape needed to price a rental. Matches the new vehicles columns.
export interface VehiclePricing {
  price_per_day: number;        // 5–14 days (base rate)
  price_extended_15: number;    // 15–29 days
  price_monthly_30: number;     // 30+ days
  min_rental_days: number;
}

export function getDailyRate(vehicle: VehiclePricing, days: number): number {
  if (days >= 30) return vehicle.price_monthly_30;
  if (days >= 15) return vehicle.price_extended_15;
  return vehicle.price_per_day;
}

export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((end.getTime() - start.getTime()) / msPerDay);
  return Math.max(diff, 0);
}

export function calculateRentalTotal(
  vehicle: VehiclePricing,
  startDate: string,
  endDate: string
): { days: number; dailyRate: number; subtotal: number } {
  const days = daysBetween(startDate, endDate);
  const dailyRate = getDailyRate(vehicle, days);
  return { days, dailyRate, subtotal: dailyRate * days };
}

export function isRentalDurationValid(
  days: number,
  minDays: number = DEFAULT_MIN_RENTAL_DAYS
): boolean {
  return days >= minDays;
}

// Back-compat alias — app/admin/reservations/[id]/page.tsx imports this name.
export function calculateBilling(
  vehicle: VehiclePricing,
  startDate: string,
  endDate: string
) {
  const { days, dailyRate, subtotal } = calculateRentalTotal(vehicle, startDate, endDate);
  const tva = subtotal * TVA_RATE;
  return { days, dailyRate, subtotal, tva, total: subtotal + tva };
}
