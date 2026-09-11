const encoder = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Deterministic session token derived from the password + a separate
// secret, so the cookie never contains the raw admin password.
export async function getExpectedSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password || !secret) return null;

  return sha256Hex(`${password}:${secret}`);
}

export async function checkPassword(submitted: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !submitted) return false;
  return timingSafeEqual(submitted, password);
}

// Brute-force protection: per-IP failed-attempt counter with temporary
// lockout. In-memory, so it resets on redeploy/server restart - fine
// for a single-admin deployment, not for a multi-instance fleet.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

type LoginAttemptState = { count: number; lockedUntil: number };
const loginAttempts = new Map<string, LoginAttemptState>();

export function checkLoginRateLimit(
  key: string
): { allowed: true } | { allowed: false; retryAfterSec: number } {
  const state = loginAttempts.get(key);
  if (!state) return { allowed: true };
  if (state.lockedUntil > Date.now()) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((state.lockedUntil - Date.now()) / 1000),
    };
  }
  return { allowed: true };
}

export function recordLoginFailure(key: string): void {
  const state = loginAttempts.get(key) ?? { count: 0, lockedUntil: 0 };
  state.count += 1;
  if (state.count >= MAX_ATTEMPTS) {
    state.lockedUntil = Date.now() + LOCKOUT_MS;
    state.count = 0;
  }
  loginAttempts.set(key, state);
}

export function resetLoginFailures(key: string): void {
  loginAttempts.delete(key);
}