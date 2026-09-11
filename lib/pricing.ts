// Central place for tiered pricing rules.
// Key = price_per_day (5-14 days). Add a new entry here whenever
// you introduce a new base price for a vehicle.
export const PRICE_TIERS: Record<number, { extended15: number; monthly30: number }> = {
  300: { extended15: 280, monthly30: 250 },
  550: { extended15: 500, monthly30: 450 },
};

export function getTieredPricing(pricePerDay: number) {
  const tier = PRICE_TIERS[pricePerDay];
  if (tier) {
    return { price_extended_15: tier.extended15, price_monthly_30: tier.monthly30 };
  }
  // Unknown base price - flat rate until you add a tier for it above.
  return { price_extended_15: pricePerDay, price_monthly_30: pricePerDay };
}
