"use server";

import { headers } from "next/headers";
import { consumeSigningToken } from "@/lib/db";
import {
  getClientIp,
  checkFailureLimit,
  recordFailure,
  resetFailures,
  SIGN_MAX_ATTEMPTS,
  SIGN_BAN_MS,
} from "@/lib/auth";

export type SignatureActionState = { ok: boolean; error: string };

const MAX_SIGNATURE_CHARS = 400_000; // ~300 KB de base64, far above a real PNG

export async function submitSignatureAction(
  token: string,
  _prevState: SignatureActionState,
  formData: FormData
): Promise<SignatureActionState> {
  // Honeypot: real users never fill this; bots get a fake success.
  if (String(formData.get("website") || "").trim() !== "") {
    return { ok: true, error: "" };
  }

  const h = await headers();
  const ip = getClientIp(h);

  const limitKey = `sign:${ip}`;
  const rl = await checkFailureLimit(limitKey);
  if (!rl.allowed) {
    return {
      ok: false,
      error: "Trop de tentatives. Reessayez dans quelques minutes."
    };
  }

  const signerName = String(formData.get("signer_name") || "").trim();
  const signature = String(formData.get("signature") || "");

  if (signerName.length < 3 || signerName.length > 120) {
    await recordFailure(limitKey, {
      maxAttempts: SIGN_MAX_ATTEMPTS,
      banMs: SIGN_BAN_MS,
    });
    return { ok: false, error: "Nom incomplet." };
  }

  if (
    !signature.startsWith("data:image/png;base64,") ||
    signature.length > MAX_SIGNATURE_CHARS
  ) {
    await recordFailure(limitKey, {
      maxAttempts: SIGN_MAX_ATTEMPTS,
      banMs: SIGN_BAN_MS,
    });
    return {
      ok: false,
      error: "Signature invalide, veuillez recommencer."
    };
  }

  const consumed = await consumeSigningToken(token, {
    signer_name: signerName,
    signer_ip: ip,
    signature_data: signature,
  });

  if (!consumed) {
    return {
      ok: false,
      error: "Lien invalide, expire ou deja utilise."
    };
  }

  await resetFailures(limitKey);
  return { ok: true, error: "" };
}

