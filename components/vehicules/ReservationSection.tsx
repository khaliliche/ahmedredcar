"use client";

import { useEffect, useState, useTransition } from "react";
import type { Vehicle } from "@/lib/db";
import { createReservationAction } from "@/app/vehicules/actions";
import { buildWhatsAppLink, buildReservationWhatsAppMessage } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function Star() {
  return (
    <span className="text-red-600" aria-hidden="true">
      *
    </span>
  );
}

export default function ReservationSection({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSecondDriver, setHasSecondDriver] = useState(false);
  // CIN (Moroccans) or passport (foreigners): at least one of the two is required.
  const [cinValue, setCinValue] = useState("");
  const [passportValue, setPassportValue] = useState("");
  const [isPending, startTransition] = useTransition();

  // Arriving from a card's "Reserver en ligne" button: open the form right away.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("reserver") === "1") {
      queueMicrotask(() => setIsOpen(true));
    }
  }, []);

  function closeForm() {
    setIsOpen(false);
    setCinValue("");
    setPassportValue("");
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createReservationAction(formData);
      if (!result.success) {
        setError(t(`reservationErrors.${result.errorCode}`, result.errorParams));
        return;
      }
      const message = buildReservationWhatsAppMessage(result.whatsappData);
      const link = buildWhatsAppLink(message);
      closeForm();
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
                onClick={closeForm}
                className="text-black/40 hover:text-black"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <form action={handleSubmit} className="mt-4 flex flex-col gap-4">
              <p className="text-xs text-black/60">
                <Star /> champs obligatoires
              </p>
              <input type="hidden" name="vehicle_id" value={vehicle.id} />

              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
              />

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Prénom <Star /></span>
                <input
                  type="text"
                  name="first_name"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Nom <Star /></span>
                <input
                  type="text"
                  name="last_name"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">
                  Date de naissance <span className="font-normal text-black/50">(optionnel)</span>
                </span>
                <input
                  type="date"
                  name="birth_date"
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Numéro de carte nationale (CIN)</span>
                <input
                  type="text"
                  name="cin_number"
                  value={cinValue}
                  onChange={(e) => setCinValue(e.target.value)}
                  required={!passportValue.trim()}
                  placeholder="(pour les Marocains)"
                  className="rounded-lg border border-black/15 px-3 py-2 placeholder:text-black/35"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">
                  CIN délivrée le <span className="font-normal text-black/50">(optionnel)</span>
                </span>
                <input
                  type="date"
                  name="cin_issue_date"
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Numéro de permis de conduire <Star /></span>
                <input
                  type="text"
                  name="driver_license_number"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Date d&apos;obtention du permis <Star /></span>
                <input
                  type="date"
                  name="license_issue_date"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Numéro de passeport</span>
                <input
                  type="text"
                  name="driver_passport_number"
                  value={passportValue}
                  onChange={(e) => setPassportValue(e.target.value)}
                  required={!cinValue.trim()}
                  placeholder="Optionnel (pour les étrangers)"
                  className="rounded-lg border border-black/15 px-3 py-2 placeholder:text-black/35"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Passeport délivré le</span>
                <input
                  type="date"
                  name="passport_issue_date"
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Adresse</span>
                <input
                  type="text"
                  name="driver_address"
                  placeholder="(optionnel)"
                  className="rounded-lg border border-black/15 px-3 py-2 placeholder:text-black/35"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Téléphone <Star /></span>
                <input
                  type="tel"
                  name="driver_phone"
                  required
                  className="rounded-lg border border-black/15 px-3 py-2"
                />
              </label>

              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="has_second_driver"
                  checked={hasSecondDriver}
                  onChange={(e) => setHasSecondDriver(e.target.checked)}
                  className="h-4 w-4 rounded border-black/25"
                />
                <span className="text-sm font-semibold">Ajouter un 2e conducteur</span>
              </label>

              {hasSecondDriver && (
                <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Prénom (2e conducteur) <Star /></span>
                    <input
                      type="text"
                      name="second_driver_first_name"
                      required={hasSecondDriver}
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Nom (2e conducteur) <Star /></span>
                    <input
                      type="text"
                      name="second_driver_last_name"
                      required={hasSecondDriver}
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Date de naissance (2e conducteur)</span>
                    <input
                      type="date"
                      name="second_driver_birth_date"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">CIN (2e conducteur) <Star /></span>
                    <input
                      type="text"
                      name="second_driver_cin_number"
                      required={hasSecondDriver}
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">CIN délivrée le (2e conducteur)</span>
                    <input
                      type="date"
                      name="second_driver_cin_issue_date"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Téléphone (2e conducteur)</span>
                    <input
                      type="tel"
                      name="second_driver_phone"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Adresse (2e conducteur)</span>
                    <input
                      type="text"
                      name="second_driver_address"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Numéro de permis (2e conducteur)</span>
                    <input
                      type="text"
                      name="second_driver_license_number"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Permis délivré le (2e conducteur)</span>
                    <input
                      type="date"
                      name="second_driver_license_issue_date"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Numéro de passeport (2e conducteur)</span>
                    <input
                      type="text"
                      name="second_driver_passport_number"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Passeport délivré le (2e conducteur)</span>
                    <input
                      type="date"
                      name="second_driver_passport_issue_date"
                      className="rounded-lg border border-black/15 bg-white px-3 py-2"
                    />
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Du <Star /></span>
                  <input
                    type="date"
                    name="start_date"
                    required
                    className="rounded-lg border border-black/15 px-3 py-2"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Au <Star /></span>
                  <input
                    type="date"
                    name="end_date"
                    required
                    className="rounded-lg border border-black/15 px-3 py-2"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Heure de prise en charge <Star /></span>
                  <input
                    type="time"
                    name="start_time"
                    defaultValue="10:00"
                    required
                    className="rounded-lg border border-black/15 px-3 py-2"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Heure de retour <Star /></span>
                  <input
                    type="time"
                    name="end_time"
                    defaultValue="10:00"
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