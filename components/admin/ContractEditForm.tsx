"use client";

import { useState } from "react";
import { DAMAGE_ZONES, DAMAGE_TYPES, EQUIPMENT_ITEMS } from "@/lib/contract";
import type { DamageEntry, EquipmentChecklist } from "@/lib/db";

// postgres.js returns DATE columns as JS Date objects (not strings), so
// values coming from the DB can be either depending on the query path.
function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

type Initial = {
  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;

  has_second_driver: boolean;
  second_driver_full_name: string;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_license_number: string;
  second_driver_passport_number: string;

  vehicle_label: string;
  registration_plate: string;

  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;

  mileage_start: number | null;
  mileage_end: number | null;
  damages: DamageEntry[];
  equipment: EquipmentChecklist;
  delivery_fee: number;
  pickup_fee: number;

  fait_a: string;
  override_total_ht: number | null;
  override_tva: number | null;
  override_total_ttc: number | null;
};

type Calculated = {
  totalHT: number;
  tva: number;
  totalTTC: number;
};

export default function ContractEditForm({
  action,
  initial,
  calculated,
}: {
  action: (formData: FormData) => void;
  initial: Initial;
  calculated: Calculated;
}) {
  const [hasSecondDriver, setHasSecondDriver] = useState(initial.has_second_driver);
  const [damages, setDamages] = useState<DamageEntry[]>(initial.damages);

  function addDamage() {
    setDamages((d) => [...d, { zone: DAMAGE_ZONES[0], type: DAMAGE_TYPES[0].value, note: "" }]);
  }
  function removeDamage(index: number) {
    setDamages((d) => d.filter((_, i) => i !== index));
  }
  function updateDamage(index: number, patch: Partial<DamageEntry>) {
    setDamages((d) => d.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  }

  const inputClass = "rounded-lg border border-black/15 px-3 py-2 text-sm";
  const labelClass = "flex flex-col gap-1";
  const spanClass = "text-sm font-semibold";

  return (
    <form action={action} className="flex flex-col gap-8">
      <input type="hidden" name="damages_json" value={JSON.stringify(damages)} readOnly />

      {/* ---- Conducteur ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
          Conducteur
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            <span className={spanClass}>Nom &amp; Prenom</span>
            <input type="text" name="full_name" defaultValue={initial.full_name} className={inputClass} required />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Age</span>
            <input type="number" name="age" defaultValue={initial.age} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>N&deg; C.I.N</span>
            <input type="text" name="cin_number" defaultValue={initial.cin_number} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Permis obtenu le</span>
            <input type="date" name="license_issue_date" defaultValue={toDateInputValue(initial.license_issue_date)} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>N&deg; permis</span>
            <input type="text" name="driver_license_number" defaultValue={initial.driver_license_number} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>N&deg; passeport</span>
            <input type="text" name="driver_passport_number" defaultValue={initial.driver_passport_number} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Adresse</span>
            <input type="text" name="driver_address" defaultValue={initial.driver_address} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Telephone</span>
            <input type="text" name="driver_phone" defaultValue={initial.driver_phone} className={inputClass} />
          </label>
        </div>
      </section>

      {/* ---- Autre conducteur ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
            Autre conducteur
          </h2>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              name="has_second_driver"
              checked={hasSecondDriver}
              onChange={(e) => setHasSecondDriver(e.target.checked)}
              className="h-4 w-4 rounded border-black/25"
            />
            Present
          </label>
        </div>
        {hasSecondDriver && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span className={spanClass}>Nom &amp; Prenom</span>
              <input type="text" name="second_driver_full_name" defaultValue={initial.second_driver_full_name} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={spanClass}>N&deg; C.I.N</span>
              <input type="text" name="second_driver_cin_number" defaultValue={initial.second_driver_cin_number} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={spanClass}>N&deg; permis</span>
              <input type="text" name="second_driver_license_number" defaultValue={initial.second_driver_license_number} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={spanClass}>N&deg; passeport</span>
              <input type="text" name="second_driver_passport_number" defaultValue={initial.second_driver_passport_number} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={spanClass}>Adresse</span>
              <input type="text" name="second_driver_address" defaultValue={initial.second_driver_address} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={spanClass}>Telephone</span>
              <input type="text" name="second_driver_phone" defaultValue={initial.second_driver_phone} className={inputClass} />
            </label>
          </div>
        )}
      </section>

      {/* ---- Vehicule & periode ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
          Vehicule &amp; periode
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            <span className={spanClass}>Vehicule (libelle)</span>
            <input type="text" name="vehicle_label" defaultValue={initial.vehicle_label} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Immatriculation</span>
            <input type="text" name="registration_plate" defaultValue={initial.registration_plate} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Date depart</span>
            <input type="date" name="start_date" defaultValue={toDateInputValue(initial.start_date)} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Heure depart</span>
            <input type="time" name="start_time" defaultValue={initial.start_time} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Date retour</span>
            <input type="date" name="end_date" defaultValue={toDateInputValue(initial.end_date)} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Heure retour</span>
            <input type="time" name="end_time" defaultValue={initial.end_time} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Km depart</span>
            <input type="number" name="mileage_start" defaultValue={initial.mileage_start ?? ""} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Km retour</span>
            <input type="number" name="mileage_end" defaultValue={initial.mileage_end ?? ""} className={inputClass} />
          </label>
        </div>
      </section>

      {/* ---- Facturation ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
          Facturation
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            <span className={spanClass}>Frais de livraison (DH)</span>
            <input type="number" step="0.01" name="delivery_fee" defaultValue={initial.delivery_fee} className={inputClass} />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Frais de reprise (DH)</span>
            <input type="number" step="0.01" name="pickup_fee" defaultValue={initial.pickup_fee} className={inputClass} />
          </label>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-black/40">
          Override manuel (laisser vide = calcul automatique)
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            <span className={spanClass}>Total HT (calcule : {calculated.totalHT.toFixed(2)} DH)</span>
            <input
              type="number"
              step="0.01"
              name="override_total_ht"
              defaultValue={initial.override_total_ht ?? ""}
              placeholder={calculated.totalHT.toFixed(2)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>TVA 20% (calcule : {calculated.tva.toFixed(2)} DH)</span>
            <input
              type="number"
              step="0.01"
              name="override_tva"
              defaultValue={initial.override_tva ?? ""}
              placeholder={calculated.tva.toFixed(2)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Total TTC (calcule : {calculated.totalTTC.toFixed(2)} DH)</span>
            <input
              type="number"
              step="0.01"
              name="override_total_ttc"
              defaultValue={initial.override_total_ttc ?? ""}
              placeholder={calculated.totalTTC.toFixed(2)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* ---- Dommages ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
            Dommages
          </h2>
          <button
            type="button"
            onClick={addDamage}
            className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
          >
            + Ajouter
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {damages.length === 0 && <p className="text-sm text-black/40">Aucun dommage constate.</p>}
          {damages.map((d, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-black/10 p-3 sm:grid-cols-[1fr_1fr_2fr_auto]">
              <select value={d.zone} onChange={(e) => updateDamage(i, { zone: e.target.value })} className="rounded-lg border border-black/15 px-2 py-1.5 text-sm">
                {DAMAGE_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <select value={d.type} onChange={(e) => updateDamage(i, { type: e.target.value })} className="rounded-lg border border-black/15 px-2 py-1.5 text-sm">
                {DAMAGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.value} ({t.symbol})</option>)}
              </select>
              <input type="text" placeholder="Note" value={d.note} onChange={(e) => updateDamage(i, { note: e.target.value })} className="rounded-lg border border-black/15 px-2 py-1.5 text-sm" />
              <button type="button" onClick={() => removeDamage(i)} className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                Suppr.
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Equipement ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
          Equipement du vehicule
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {EQUIPMENT_ITEMS.map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={`equipment__${item.key}`}
                defaultChecked={Boolean(initial.equipment[item.key])}
                className="h-4 w-4 rounded border-black/25"
              />
              {item.label}
            </label>
          ))}
        </div>
      </section>

      {/* ---- Validation ---- */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-black/50">
          Validation du contrat
        </h2>
        <label className={`${labelClass} mt-4 sm:max-w-xs`}>
          <span className={spanClass}>Fait a</span>
          <input type="text" name="fait_a" defaultValue={initial.fait_a} className={inputClass} />
        </label>
      </section>

      <button
        type="submit"
        className="w-fit rounded-lg bg-[var(--color-red-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        Enregistrer le contrat
      </button>
    </form>
  );
}
