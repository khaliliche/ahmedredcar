"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getVehicleById, type DamageEntry, type EquipmentChecklist } from "@/lib/db";
import { createManualContract } from "@/lib/manual-contract";
import { getExpectedSessionToken, timingSafeEqual } from "@/lib/auth-token";
import { EQUIPMENT_ITEMS } from "@/lib/contract";

async function requireAdmin() {
  const expectedToken = await getExpectedSessionToken();
  const store = await cookies();
  const cookie = store.get("admin_session")?.value;
  if (!expectedToken || !cookie || !timingSafeEqual(cookie, expectedToken)) {
    redirect("/admin/real/login");
  }
}

export type CreateManualContractResult =
  | { ok: true; id: number; contractNumber: string; hasSecondDriver: boolean }
  | { ok: false; error: string };

export async function createManualContractAction(
  formData: FormData
): Promise<CreateManualContractResult> {
  await requireAdmin();

  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const numberOrNull = (name: string) => {
    const v = text(name);
    if (v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const vehicleId = Number(text("vehicle_id"));
  const vehicle = Number.isInteger(vehicleId) ? await getVehicleById(vehicleId) : null;
  if (!vehicle) return { ok: false, error: "Vehicule introuvable." };

  const fullName = text("full_name");
  const age = Number(text("age"));
  const cin = text("cin_number");
  const licenseIssueDate = text("license_issue_date");
  const phone = text("driver_phone");
  const startDate = text("start_date");
  const endDate = text("end_date");

  if (!fullName || !cin || !phone || !licenseIssueDate || !startDate || !endDate) {
    return { ok: false, error: "Remplissez nom, CIN, telephone, date de permis et dates de location." };
  }
  if (!Number.isFinite(age) || age <= 0) {
    return { ok: false, error: "Age invalide." };
  }
  if (endDate < startDate) {
    return { ok: false, error: "La date de fin est avant la date de debut." };
  }

  const hasSecondDriver = formData.get("has_second_driver") === "on";
  if (hasSecondDriver && !text("second_driver_full_name")) {
    return { ok: false, error: "Nom du 2e conducteur obligatoire." };
  }

  let damages: DamageEntry[] = [];
  try {
    const parsed = JSON.parse(text("damages_json") || "[]");
    if (Array.isArray(parsed)) damages = parsed;
  } catch {
    damages = [];
  }

  const equipment: EquipmentChecklist = {};
  for (const item of EQUIPMENT_ITEMS) {
    equipment[item.key] = formData.get(`equipment__${item.key}`) === "on";
  }

  const result = await createManualContract({
    vehicle_id: vehicle.id,
    vehicle_label: `${vehicle.brand} ${vehicle.model}`,

    full_name: fullName,
    age,
    cin_number: cin,
    license_issue_date: licenseIssueDate,
    driver_address: text("driver_address"),
    driver_phone: phone,
    driver_license_number: text("driver_license_number"),
    driver_passport_number: text("driver_passport_number"),

    has_second_driver: hasSecondDriver,
    second_driver_full_name: hasSecondDriver ? text("second_driver_full_name") : "",
    second_driver_address: hasSecondDriver ? text("second_driver_address") : "",
    second_driver_phone: hasSecondDriver ? text("second_driver_phone") : "",
    second_driver_cin_number: hasSecondDriver ? text("second_driver_cin_number") : "",
    second_driver_license_number: hasSecondDriver ? text("second_driver_license_number") : "",
    second_driver_passport_number: hasSecondDriver ? text("second_driver_passport_number") : "",

    start_date: startDate,
    end_date: endDate,
    start_time: text("start_time") || "10:00",
    end_time: text("end_time") || "10:00",

    registration_plate: text("registration_plate"),
    mileage_start: numberOrNull("mileage_start"),
    mileage_end: numberOrNull("mileage_end"),
    damages,
    equipment,
    delivery_fee: Number(text("delivery_fee")) || 0,
    pickup_fee: Number(text("pickup_fee")) || 0,

    fait_a: text("fait_a"),
    override_total_ht: numberOrNull("override_total_ht"),
    override_tva: numberOrNull("override_tva"),
    override_total_ttc: numberOrNull("override_total_ttc"),
  });

  if (!result.ok) {
    return { ok: false, error: "Ce vehicule est deja reserve (contrat confirme) sur ces dates." };
  }

  revalidatePath("/admin/real/reservations");
  revalidatePath("/vehicules");

  return {
    ok: true,
    id: result.id,
    contractNumber: result.contract_number,
    hasSecondDriver,
  };
}