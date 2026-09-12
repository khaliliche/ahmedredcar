"use client";

import { useState, useTransition } from "react";
import { PenLine } from "lucide-react";
import { generateSigningLinkAction } from "@/app/admin/real/actions";

export default function SendSigningLinkButton({
  reservationId,
  signedAt,
}: {
  reservationId: number;
  signedAt: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleClick() {
    setFeedback(null);
    startTransition(async () => {
      const result = await generateSigningLinkAction(reservationId);
      if (!result.ok) {
        setFeedback(
          result.error === "cancelled"
            ? "Reservation annulee."
            : result.error === "alreadySigned"
              ? "Contrat deja signe."
              : "Reservation introuvable."
        );
        return;
      }
      if (result.waUrl) {
        window.open(result.waUrl, "_blank", "noopener,noreferrer");
        setFeedback("Discussion WhatsApp ouverte.");
      } else {
        try {
          await navigator.clipboard.writeText(result.signingUrl);
          setFeedback("Telephone invalide - lien copie, collez-le dans WhatsApp.");
        } catch {
          setFeedback(`Lien : ${result.signingUrl}`);
        }
      }
    });
  }

  if (signedAt) {
    return (
      <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        Contrat signe le {new Date(signedAt).toLocaleString("fr-FR")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black/80 disabled:opacity-50"
      >
        <PenLine className="h-3.5 w-3.5" />
        {pending ? "Generation..." : "Envoyer le lien de signature"}
      </button>
      {feedback && <span className="text-xs text-black/50">{feedback}</span>}
    </span>
  );
}
