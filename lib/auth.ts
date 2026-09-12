import {
  timingSafeEqual,
  getExpectedSessionToken,
  checkPassword,
} from "./auth-token";
import {
  getLockExpiry,
  recordFailedAttempt,
  clearFailures,
  consumeWindowedLimit,
} from "./db";

// Re-exported from auth-token so existing importers keep working.
export { timingSafeEqual, getExpectedSessionToken, checkPassword };

// ---- Client IP ----
// Prefer proxy-appended headers (Vercel, nginx), then normalize IPv4-in-IPv6.
export function getClientIp(h: Headers): string {
  const raw =
    h.get("x-real-ip") ??
    h.get("x-vercel-forwarded-for") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return raw.replace(/^::ffff:/, "").replace(/[\[\]]/g, "");
}

// ---- Persistent brute-force protection ----
// DB-backed, so a ban survives redeploys and cookie clearing.
export const LOGIN_MAX_ATTEMPTS = 8;
export const LOGIN_BAN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const SIGN_MAX_ATTEMPTS = 10;
export const SIGN_BAN_MS = 15 * 60 * 1000; // 15 minutes

export async function checkFailureLimit(
  key: string
): Promise<{ allowed: true } | { allowed: false; retryAfterSec: number }> {
  const lockedUntil = await getLockExpiry(key);
  if (!lockedUntil) return { allowed: true };
  const untilMs = new Date(lockedUntil).getTime();
  if (untilMs <= Date.now()) return { allowed: true };
  return {
    allowed: false,
    retryAfterSec: Math.ceil((untilMs - Date.now()) / 1000),
  };
}

export async function recordFailure(
  key: string,
  opts: { maxAttempts: number; banMs: number }
): Promise<void> {
  await recordFailedAttempt(key, opts);
}

export async function resetFailures(key: string): Promise<void> {
  await clearFailures(key);
}

// Public endpoints get a fixed-window budget per IP instead of a hard ban.
export async function checkReservationLimit(
  key: string
): Promise<boolean> {
  return consumeWindowedLimit(key, 5, 60 * 60 * 1000);
}