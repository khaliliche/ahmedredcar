"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DAMAGE_ZONES, DAMAGE_TYPES, FUEL_LEVELS, FUEL_TYPES } from "@/lib/contract";
import type { DamageEntry } from "@/lib/db";
import AvailabilityBanner from "@/components/admin/AvailabilityBanner";

// postgres.js returns DATE columns as JS Date objects, so values coming
// from the DB can be either a string or a Date.
type DateLike = string | Date | null | undefined;

function toDateInputValue(value: DateLike) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toTimeInputValue(value: string | null | undefined) {
  return value ? String(value).slice(0, 5) : "";
}

export type ContractInitial = {
  vehicle_id: number | null;
  vehicle_label: string;
  registration_plate: string;

  // Premier conducteur
  first_name: string;
  last_name: string;
  birth_date: DateLike;
  cin_number: string;
  cin_issue_date: DateLike;
  license_issue_date: DateLike;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;
  passport_issue_date: DateLike;

  // 2eme conducteur
  has_second_driver: boolean;
  second_driver_first_name: string;
  second_driver_last_name: string;
  second_driver_birth_date: DateLike;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_cin_issue_date: DateLike;
  second_driver_license_number: string;
  second_driver_license_issue_date: DateLike;
  second_driver_passport_number: string;
  second_driver_passport_issue_date: DateLike;

  // Depart / retour
  start_date: DateLike;
  end_date: DateLike;
  start_time: string;
  end_time: string;
  departure_place: string;
  return_place: string;

  // Facturation, prolongation, retour prevu
  advance: number;
  override_total_ttc: number | null;
  prolongation: string;
  expected_return_date: DateLike;
  expected_return_time: string | null;

  // Carburant & dommages
  fuel_level: string;
  fuel_type: string;
  damages: DamageEntry[];
};

export type VehicleOption = { id: number; label: string };

type Calculated = { totalTTC: number; days: number; dailyRate: number };

type SubmitResult = { ok: true; id?: number } | { ok: false; error: string };

const inputClass = "rounded-lg border border-black/15 px-3 py-2 text-sm";
const labelClass = "flex flex-col gap-1";
const spanClass = "text-sm font-semibold";
const sectionClass = "rounded-2xl border border-black/10 bg-white p-5";
const h2Class = "font-display text-sm font-bold uppercase tracking-wide text-black/50";
const gridClass = "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2";

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
  const [advance, setAdvance] = useState(initial.advance ? String(initial.advance) : "");
  const [overrideTTC, setOverrideTTC] = useState(
    initial.override_total_ttc != null ? String(initial.override_total_ttc) : ""
  );

  const isCreate = mode === "create";

  // Live "Reste a payer" (edit mode only: the calculated total needs a saved vehicle).
  const totalTTC =
    overrideTTC !== "" && Number.isFinite(Number(overrideTTC))
      ? Number(overrideTTC)
      : calculated?.totalTTC;
  const remaining =
    totalTTC !== undefined ? Math.max(totalTTC - (Number(advance) || 0), 0) : undefined;

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

      {/* ---- Vehicule, depart & retour ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Vehicule, depart &amp; retour</h2>
        <div className={gridClass}>
          <label className={labelClass}>
            <span className={spanClass}>
              Type de vehicule
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
          <Field label="Matricule" name="registration_plate" defaultValue={initial.registration_plate} />

          <label className={labelClass}>
            <span className={spanClass}>
              Depart : le<span className="text-red-600"> *</span>
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
          <Field label="Depart : heure" name="start_time" type="time" defaultValue={initial.start_time || "10:00"} />
          <Field label="Depart : lieu de livraison" name="departure_place" defaultValue={initial.departure_place} />
          <div className="hidden sm:block" />

          <label className={labelClass}>
            <span className={spanClass}>
              Retour : le<span className="text-red-600"> *</span>
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
          <Field label="Retour : heure" name="end_time" type="time" defaultValue={initial.end_time || "10:00"} />
          <Field label="Retour : lieu de livraison" name="return_place" defaultValue={initial.return_place} />
        </div>
      </section>

      {/* ---- Premier conducteur ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Premier conducteur</h2>
        <div className={gridClass}>
          <Field label="Prenom" name="first_name" required={isCreate} defaultValue={initial.first_name} />
          <Field label="Nom" name="last_name" required={isCreate} defaultValue={initial.last_name} />
          <Field label="N° C.I.N" name="cin_number" required={isCreate} defaultValue={initial.cin_number} />
          <Field label="C.I.N delivree le" name="cin_issue_date" type="date" defaultValue={toDateInputValue(initial.cin_issue_date)} />
          <Field label="Date de naissance" name="birth_date" type="date" required={isCreate} defaultValue={toDateInputValue(initial.birth_date)} />
          <Field label="N° permis de conduire" name="driver_license_number" defaultValue={initial.driver_license_number} />
          <Field label="Permis delivre le" name="license_issue_date" type="date" required={isCreate} defaultValue={toDateInputValue(initial.license_issue_date)} />
          <Field label="Adresse au Maroc" name="driver_address" defaultValue={initial.driver_address} />
          <Field label="Tel" name="driver_phone" type="tel" required={isCreate} defaultValue={initial.driver_phone} />
          <Field label="N° passeport" name="driver_passport_number" defaultValue={initial.driver_passport_number} />
          <Field label="Passeport delivre le" name="passport_issue_date" type="date" defaultValue={toDateInputValue(initial.passport_issue_date)} />
        </div>
      </section>

      {/* ---- 2eme conducteur ---- */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className={h2Class}>2eme conducteur</h2>
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
          <div className={gridClass}>
            <Field label="Prenom" name="second_driver_first_name" required={isCreate} defaultValue={initial.second_driver_first_name} />
            <Field label="Nom" name="second_driver_last_name" required={isCreate} defaultValue={initial.second_driver_last_name} />
            <Field label="N° C.I.N" name="second_driver_cin_number" defaultValue={initial.second_driver_cin_number} />
            <Field label="C.I.N delivree le" name="second_driver_cin_issue_date" type="date" defaultValue={toDateInputValue(initial.second_driver_cin_issue_date)} />
            <Field label="Date de naissance" name="second_driver_birth_date" type="date" defaultValue={toDateInputValue(initial.second_driver_birth_date)} />
            <Field label="N° permis de conduire" name="second_driver_license_number" defaultValue={initial.second_driver_license_number} />
            <Field label="Permis delivre le" name="second_driver_license_issue_date" type="date" defaultValue={toDateInputValue(initial.second_driver_license_issue_date)} />
            <Field label="Adresse au Maroc" name="second_driver_address" defaultValue={initial.second_driver_address} />
            <Field label="Tel" name="second_driver_phone" type="tel" defaultValue={initial.second_driver_phone} />
            <Field label="N° passeport" name="second_driver_passport_number" defaultValue={initial.second_driver_passport_number} />
            <Field label="Passeport delivre le" name="second_driver_passport_issue_date" type="date" defaultValue={toDateInputValue(initial.second_driver_passport_issue_date)} />
          </div>
        )}
      </section>

      {/* ---- Facturation ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Facturation</h2>
        {calculated && (
          <p className="mt-3 text-sm text-black/60">
            {calculated.days} jour(s) x {calculated.dailyRate.toFixed(2)} DH/jour : total TTC
            calcule {calculated.totalTTC.toFixed(2)} DH
          </p>
        )}
        <div className={gridClass}>
          <label className={labelClass}>
            <span className={spanClass}>Total TTC (laisser vide = calcul automatique)</span>
            <input
              type="number"
              name="override_total_ttc"
              step="0.01"
              min={0}
              value={overrideTTC}
              onChange={(e) => setOverrideTTC(e.target.value)}
              placeholder={calculated ? calculated.totalTTC.toFixed(2) : "auto"}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Avance (DH)</span>
            <input
              type="number"
              name="advance"
              step="0.01"
              min={0}
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
        {remaining !== undefined && (
          <p className="mt-3 text-sm font-semibold">
            Reste a payer : {remaining.toFixed(2)} DH
          </p>
        )}
        <div className={gridClass}>
          <Field label="Prolongation" name="prolongation" defaultValue={initial.prolongation} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Retour prevu le" name="expected_return_date" type="date" defaultValue={toDateInputValue(initial.expected_return_date)} />
            <Field label="a (heure)" name="expected_return_time" type="time" defaultValue={toTimeInputValue(initial.expected_return_time)} />
          </div>
        </div>
      </section>

      {/* ---- Carburant ---- */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Carburant</h2>
        <div className={gridClass}>
          <label className={labelClass}>
            <span className={spanClass}>Niveau de carburant</span>
            <select name="fuel_level" defaultValue={initial.fuel_level} className={inputClass}>
              <option value="">Non renseigne</option>
              {FUEL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            <span className={spanClass}>Type de carburant</span>
            <select name="fuel_type" defaultValue={initial.fuel_type} className={inputClass}>
              <option value="">Non renseigne</option>
              {FUEL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
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