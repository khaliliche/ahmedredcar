"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DAMAGE_ZONES, DAMAGE_TYPES, EQUIPMENT_ITEMS } from "@/lib/contract";
import type { DamageEntry } from "@/lib/db";
import {
  createManualContractAction,
  type CreateManualContractResult,
} from "@/app/admin/real/contracts/new/actions";
import SendSigningLinkButton from "@/components/admin/SendSigningLinkButton";

const INPUT = "rounded-lg border border-black/15 px-3 py-2";

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  step?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        step={step}
        className={INPUT}
      />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-black/10 pb-2 font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function NewContractForm({
  vehicles,
}: {
  vehicles: { id: number; label: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Extract<CreateManualContractResult, { ok: true }> | null>(null);
  const [hasSecondDriver, setHasSecondDriver] = useState(false);
  const [damages, setDamages] = useState<DamageEntry[]>([]);

  function addDamage() {
    setDamages((d) => [...d, { zone: DAMAGE_ZONES[0], type: DAMAGE_TYPES[0].value, note: "" }]);
  }
  function removeDamage(index: number) {
    setDamages((d) => d.filter((_, i) => i !== index));
  }
  function updateDamage(index: number, patch: Partial<DamageEntry>) {
    setDamages((d) => d.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createManualContractAction(formData);
      if (!result.ok) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setDone(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-display text-lg font-bold text-emerald-800">
            Contrat {done.contractNumber} cree
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Signez le contrat pour l&apos;agence, puis envoyez le lien de signature au client.
          </p>
        </div>

        <div>
          <Link
            href={`/admin/real/reservations/${done.id}/agency-sign`}
            className="inline-block rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-black/80"
          >
            Signer le contrat (agence)
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SendSigningLinkButton reservationId={done.id} signedAt={null} />
          {done.hasSecondDriver && (
            <SendSigningLinkButton
              reservationId={done.id}
              signedAt={null}
              driver="second"
              label="Envoyer au 2e conducteur"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <a
            href={`/admin/real/reservations/${done.id}/contract`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-black/15 px-3 py-2 hover:bg-black/5"
          >
            Voir le PDF
          </a>
          <a
            href={`/admin/real/reservations/${done.id}/edit-contract`}
            className="rounded-lg border border-black/15 px-3 py-2 hover:bg-black/5"
          >
            Modifier le contrat
          </a>
          <Link
            href="/admin/real/contracts"
            className="rounded-lg border border-black/15 px-3 py-2 hover:bg-black/5"
          >
            Retour aux contrats
          </Link>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setHasSecondDriver(false);
              setDamages([]);
            }}
            className="rounded-lg bg-[var(--color-red-primary)] px-3 py-2 text-white"
          >
            Nouveau contrat
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <input type="hidden" name="damages_json" value={JSON.stringify(damages)} readOnly />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <Section title="Vehicule et periode">
        <label className="flex flex-col gap-1 sm:max-w-md">
          <span className="text-sm font-semibold">
            Vehicule <span className="text-red-600">*</span>
          </span>
          <select name="vehicle_id" required defaultValue="" className={INPUT}>
            <option value="" disabled>
              Choisir un vehicule
            </option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date de debut" name="start_date" type="date" required />
          <Field label="Heure de debut" name="start_time" type="time" defaultValue="10:00" />
          <Field label="Date de fin" name="end_date" type="date" required />
          <Field label="Heure de fin" name="end_time" type="time" defaultValue="10:00" />
        </div>
      </Section>

      <Section title="Conducteur principal">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nom complet" name="full_name" required />
          <Field label="Age" name="age" type="number" required />
          <Field label="N° CIN" name="cin_number" required />
          <Field label="Telephone" name="driver_phone" type="tel" required />
          <Field label="N° permis" name="driver_license_number" />
          <Field label="Permis obtenu le" name="license_issue_date" type="date" required />
          <Field label="N° passeport" name="driver_passport_number" />
          <Field label="Adresse" name="driver_address" />
        </div>
      </Section>

      <Section title="Deuxieme conducteur">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="has_second_driver"
            checked={hasSecondDriver}
            onChange={(e) => setHasSecondDriver(e.target.checked)}
            className="h-4 w-4 rounded border-black/25"
          />
          Ajouter un 2e conducteur
        </label>
        {hasSecondDriver && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nom complet" name="second_driver_full_name" required />
            <Field label="Telephone" name="second_driver_phone" type="tel" />
            <Field label="N° CIN" name="second_driver_cin_number" />
            <Field label="N° permis" name="second_driver_license_number" />
            <Field label="N° passeport" name="second_driver_passport_number" />
            <Field label="Adresse" name="second_driver_address" />
          </div>
        )}
      </Section>

      <Section title="Remise du vehicule">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Immatriculation" name="registration_plate" />
          <Field label="Fait a" name="fait_a" />
          <Field label="Km depart" name="mileage_start" type="number" />
          <Field label="Km retour" name="mileage_end" type="number" />
          <Field label="Frais de livraison (DH)" name="delivery_fee" type="number" step="0.01" defaultValue="0" />
          <Field label="Frais de reprise (DH)" name="pickup_fee" type="number" step="0.01" defaultValue="0" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Dommages constates</span>
            <button
              type="button"
              onClick={addDamage}
              className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
            >
              + Ajouter
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            {damages.length === 0 && (
              <p className="text-sm text-black/40">Aucun dommage constate.</p>
            )}
            {damages.map((d, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 rounded-lg border border-black/10 p-3 sm:grid-cols-[1fr_1fr_2fr_auto]"
              >
                <select
                  value={d.zone}
                  onChange={(e) => updateDamage(i, { zone: e.target.value })}
                  className="rounded-lg border border-black/15 px-2 py-1.5 text-sm"
                >
                  {DAMAGE_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
                <select
                  value={d.type}
                  onChange={(e) => updateDamage(i, { type: e.target.value })}
                  className="rounded-lg border border-black/15 px-2 py-1.5 text-sm"
                >
                  {DAMAGE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.value} ({t.symbol})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Note"
                  value={d.note}
                  onChange={(e) => updateDamage(i, { note: e.target.value })}
                  className="rounded-lg border border-black/15 px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeDamage(i)}
                  className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Suppr.
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold">Equipement fourni</span>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EQUIPMENT_ITEMS.map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={`equipment__${item.key}`}
                  className="h-4 w-4 rounded border-black/25"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Montants (optionnel)">
        <p className="text-sm text-black/50">
          Laissez vide pour utiliser le calcul automatique selon le tarif du vehicule.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Total HT (DH)" name="override_total_ht" type="number" step="0.01" />
          <Field label="TVA (DH)" name="override_tva" type="number" step="0.01" />
          <Field label="Total TTC (DH)" name="override_total_ttc" type="number" step="0.01" />
        </div>
      </Section>

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-[var(--color-red-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {pending ? "Creation..." : "Creer le contrat"}
      </button>
    </form>
  );
}