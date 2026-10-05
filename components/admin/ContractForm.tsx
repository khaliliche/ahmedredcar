"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DAMAGE_ZONES, DAMAGE_TYPES, EQUIPMENT_ITEMS } from "@/lib/contract";
import type { DamageEntry, EquipmentChecklist } from "@/lib/db";
import AvailabilityBanner from "@/components/admin/AvailabilityBanner";

// postgres.js returns DATE columns as JS Date objects, so values coming
// from the DB can be either a string or a Date.
function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export type ContractInitial = {
  vehicle_id: number | null;
  vehicle_label: string;
  registration_plate: string;

  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string | Date;
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

  start_date: string | Date;
  end_date: string | Date;
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

export type VehicleOption = { id: number; label: string };

type Calculated = { totalHT: number; tva: number; totalTTC: number };

type SubmitResult = { ok: true; id?: number } | { ok: false; error: string };

const inputClass = "rounded-lg border border-black/15 px-3 py-2 text-sm";
const labelClass = "flex flex-col gap-1";
const spanClass = "text-sm font-semibold";
const sectionClass = "rounded-2xl border border-black/10 bg-white p-5";
const h2Class = "font-display text-sm font-bold uppercase tracking-wide text-black/50";

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  step,
  placeholder,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  step?: string;
  placeholder?: string;
  min?: number;
}) {
  return (
    <label className={labelClass}>
      <span className={spanClass}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        step={step}
        placeholder={placeholder}
        min={min}
        className={inputClass}
      />
    </label>
  );
}

export default function ContractForm({
  mode,
  reservationId,
  vehicles,
  initial,
  calculated,
  submit,
}: {
  mode: "create" | "edit";
  reservationId?: number;
  vehicles: VehicleOption[];
  initial: ContractInitial;
  calculated?: Calculated;
  submit: (formData: FormData) => Promise<SubmitResult>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [hasSecondDriver, setHasSecondDriver] = useState(initial.has_second_driver);
  const [damages, setDamages] = useState<DamageEntry[]>(initial.damages);
  const [vehicleId, setVehicleId] = useState<number | null>(initial.vehicle_id);
  const [startDate, setStartDate] = useState(toDateInputValue(initial.start_date));
  const [endDate, setEndDate] = useState(toDateInputValue(initial.end_date));

  const isCreate = mode === "create";

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
      const result = await submit(formData);
      if (!result.ok) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const id = result.id ?? reservationId;
      setSaved(true);
      router.push(`/admin/real/reservations/${id}?saved=1`);
      router.refresh();
    });
  }

  const calcLabel = (label: string, value?: number) =>
    value === undefined ? label : `${label} (calcule : ${value.toFixed(2)} DH)`;

  return (
    <form onSubmit={handleSubmit} onChange={() => setSaved(false)} className="flex flex-col gap-6">
      <input type="hidden" name="damages_json" value={JSON.stringify(damages)} readOnly />
      <input type="hidden" name="vehicle_label" value={initial.vehicle_label} readOnly />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <AvailabilityBanner
        vehicleId={vehicleId}
        startDate={startDate}
        endDate={endDate}
        excludeReservationId={reservationId}
      />

      {/* ---- Vehicule & periode ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Vehicule &amp; periode</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            <span className={spanClass}>
              Vehicule
              {isCreate && <span className="text-red-600"> *</span>}
            </span>
            <select
              name="vehicle_id"
              value={vehicleId ?? ""}
              onChange={(e) => setVehicleId(e.target.value ? Number(e.target.value) : null)}
              required={isCreate}
              className={inputClass}
            >
              <option value="">Choisir un vehicule</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Immatriculation" name="registration_plate" defaultValue={initial.registration_plate} />
          <label className={labelClass}>
            <span className={spanClass}>
              Date depart<span className="text-red-600"> *</span>
            </span>
            <input
              type="date"
              name="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={inputClass}
            />
          </label>
          <Field label="Heure depart" name="start_time" type="time" defaultValue={initial.start_time || "10:00"} />
          <label className={labelClass}>
            <span className={spanClass}>
              Date retour<span className="text-red-600"> *</span>
            </span>
            <input
              type="date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className={inputClass}
            />
          </label>
          <Field label="Heure retour" name="end_time" type="time" defaultValue={initial.end_time || "10:00"} />
          <Field label="Km depart" name="mileage_start" type="number" defaultValue={initial.mileage_start ?? ""} />
          <Field label="Km retour" name="mileage_end" type="number" defaultValue={initial.mileage_end ?? ""} />
        </div>
      </section>

      {/* ---- Conducteur ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Conducteur</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nom & Prenom" name="full_name" required={isCreate} defaultValue={initial.full_name} />
          <Field label="Age" name="age" type="number" min={1} required={isCreate} defaultValue={initial.age || ""} />
          <Field label="N&deg; C.I.N" name="cin_number" required={isCreate} defaultValue={initial.cin_number} />
          <Field label="Telephone" name="driver_phone" type="tel" required={isCreate} defaultValue={initial.driver_phone} />
          <Field label="Permis obtenu le" name="license_issue_date" type="date" required={isCreate} defaultValue={toDateInputValue(initial.license_issue_date)} />
          <Field label="N&deg; permis" name="driver_license_number" defaultValue={initial.driver_license_number} />
          <Field label="N&deg; passeport" name="driver_passport_number" defaultValue={initial.driver_passport_number} />
          <Field label="Adresse" name="driver_address" defaultValue={initial.driver_address} />
        </div>
      </section>

      {/* ---- Autre conducteur ---- */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className={h2Class}>Autre conducteur</h2>
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
            <Field label="Nom & Prenom" name="second_driver_full_name" required={isCreate} defaultValue={initial.second_driver_full_name} />
            <Field label="N&deg; C.I.N" name="second_driver_cin_number" defaultValue={initial.second_driver_cin_number} />
            <Field label="N&deg; permis" name="second_driver_license_number" defaultValue={initial.second_driver_license_number} />
            <Field label="N&deg; passeport" name="second_driver_passport_number" defaultValue={initial.second_driver_passport_number} />
            <Field label="Adresse" name="second_driver_address" defaultValue={initial.second_driver_address} />
            <Field label="Telephone" name="second_driver_phone" type="tel" defaultValue={initial.second_driver_phone} />
          </div>
        )}
      </section>

      {/* ---- Facturation ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Facturation</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Frais de livraison (DH)" name="delivery_fee" type="number" step="0.01" defaultValue={initial.delivery_fee} />
          <Field label="Frais de reprise (DH)" name="pickup_fee" type="number" step="0.01" defaultValue={initial.pickup_fee} />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-black/40">
          Override manuel (laisser vide = calcul automatique)
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label={calcLabel("Total HT", calculated?.totalHT)}
            name="override_total_ht"
            type="number"
            step="0.01"
            defaultValue={initial.override_total_ht ?? ""}
            placeholder={calculated ? calculated.totalHT.toFixed(2) : "auto"}
          />
          <Field
            label={calcLabel("TVA 20%", calculated?.tva)}
            name="override_tva"
            type="number"
            step="0.01"
            defaultValue={initial.override_tva ?? ""}
            placeholder={calculated ? calculated.tva.toFixed(2) : "auto"}
          />
          <Field
            label={calcLabel("Total TTC", calculated?.totalTTC)}
            name="override_total_ttc"
            type="number"
            step="0.01"
            defaultValue={initial.override_total_ttc ?? ""}
            placeholder={calculated ? calculated.totalTTC.toFixed(2) : "auto"}
          />
        </div>
      </section>

      {/* ---- Dommages ---- */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className={h2Class}>Dommages</h2>
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
      <section className={sectionClass}>
        <h2 className={h2Class}>Equipement du vehicule</h2>
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
      <section className={sectionClass}>
        <h2 className={h2Class}>Validation du contrat</h2>
        <div className="mt-4 sm:max-w-xs">
          <Field label="Fait a" name="fait_a" defaultValue={initial.fait_a} />
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-[var(--color-red-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : saved ? "Enregistr\u00e9" : "Enregistrer"}
      </button>
    </form>
  );
}