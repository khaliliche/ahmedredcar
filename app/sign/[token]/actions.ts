"use server";

import { headers } from "next/headers";
import { consumeSigningToken } from "@/lib/db";
import { checkLoginRateLimit, recordLoginFailure, resetLoginFailures } from "@/lib/db";

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
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rl = await checkLoginRateLimit(`sign:${ip}`);
  if (!rl.allowed) {
    return {
      ok: false,
      error: "Trop de tentatives. Reessayez dans quelques minutes."
    };
  }

  const signerName = String(formData.get("signer_name") || "").trim();
  const signature = String(formData.get("signature") || "");

  if (signerName.length < 3 || signerName.length > 120) {
    await recordLoginFailure(`sign:${ip}`);
    return { ok: false, error: "Nom incomplet." };
  }

  if (
    !signature.startsWith("data:image/png;base64,") ||
    signature.length > MAX_SIGNATURE_CHARS
  ) {
    await recordLoginFailure(`sign:${ip}`);
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

  await resetLoginFailures(`sign:${ip}`);
  return { ok: true, error: "" };
}

