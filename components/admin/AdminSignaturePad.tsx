"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import SignaturePad from "signature_pad";
import { saveAdminSignatureAction } from "@/app/admin/real/actions";

export default function AdminSignaturePad({
  reservationId,
  existing,
}: {
  reservationId: number;
  existing: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [saved, setSaved] = useState<string | null>(existing);
  const [editing, setEditing] = useState(!existing);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!editing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);
    const pad = new SignaturePad(canvas, {
      penColor: "rgb(15, 23, 42)",
      minWidth: 1,
      maxWidth: 2.5,
    });
    padRef.current = pad;
    return () => pad.off();
  }, [editing]);

  function save() {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) {
      setFeedback("Dessinez la signature d'abord.");
      return;
    }
    const data = pad.toDataURL("image/png");
    setFeedback(null);
    startTransition(async () => {
      const res = await saveAdminSignatureAction(reservationId, data);
      if (res.ok) {
        setSaved(data);
        setEditing(false);
        setFeedback("Signature enregistrée.");
      } else {
        setFeedback(res.error ?? "Erreur.");
      }
    });
  }

  function remove() {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveAdminSignatureAction(reservationId, null);
      if (res.ok) {
        setSaved(null);
        setEditing(true);
        setFeedback("Signature supprimée.");
      } else {
        setFeedback(res.error ?? "Erreur.");
      }
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
        Signature de l&apos;agence
      </h2>

      {!editing && saved ? (
        <div className="mt-3 flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={saved}
            alt="Signature de l'agence"
            className="h-28 w-full max-w-sm rounded-lg border border-black/15 bg-white object-contain"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
            >
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex max-w-sm flex-col gap-2">
          <div className="overflow-hidden rounded-lg border border-black/15 bg-white">
            <canvas ref={canvasRef} className="h-36 w-full touch-none" />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => padRef.current?.clear()}
              className="text-xs font-semibold text-black/50 underline"
            >
              Effacer
            </button>
            <div className="flex gap-2">
              {saved && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
                >
                  Annuler
                </button>
              )}
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-black/80 disabled:opacity-40"
              >
                {pending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedback && <p className="mt-2 text-xs text-black/60">{feedback}</p>}
    </section>
  );
}