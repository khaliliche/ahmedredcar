"use client";

import { useState, useTransition } from "react";
import type { Vehicle } from "@/lib/db";
import { createReservationAction } from "@/app/vehicules/actions";
import { buildWhatsAppLink, buildReservationWhatsAppMessage } from "@/lib/site-config";

export default function ReservationSection({ vehicle }: { vehicle: Vehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createReservationAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      const message = buildReservationWhatsAppMessage(result.whatsappData);
      const link = buildWhatsAppLink(message);
      setIsOpen(false);
      window.open(link, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden items-center justify-center bg-[var(--color-red-primary)] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)] sm:inline-flex"
      >
        Réserver ce véhicule
      </button>

      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-red-primary)] text-sm font-bold text-white transition-all active:scale-[0.98]"
        >
          Réserver - {vehicle.price_per_day} DH/j
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
                Réserver {vehicle.brand} {vehicle.model}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-black/40 hover:text-black"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <form action={handleSubmit} className="mt-4 flex flex-col gap-4">
              <input type="hidden" name="vehicle_id" value={vehicle.id} />

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Nom complet</span>
                <input
                  type="text"
                  name="full_name"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Âge</span>
                <input
                  type="number"
                  name="age"
                  min={18}
                  max={99}
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Numéro de carte nationale (CIN)</span>
                <input
                  type="text"
                  name="cin_number"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Date d&apos;obtention du permis</span>
                <input
                  type="date"
                  name="license_issue_date"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Du</span>
                  <input
                    type="date"
                    name="start_date"
                    required
                    className="rounded-lg border border-black/15 px-3 py-2"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Au</span>
                  <input
                    type="date"
                    name="end_date"
                    required
                    className="rounded-lg border border-black/15 px-3 py-2"
                  />
                </label>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 rounded-lg bg-[var(--color-red-primary)] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {isPending ? "Envoi..." : "Confirmer et envoyer sur WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}