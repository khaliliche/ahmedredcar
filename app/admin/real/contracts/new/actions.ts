"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getVehicleById, type DamageEntry } from "@/lib/db";
import { createManualContract } from "@/lib/manual-contract";
import { getExpectedSessionToken, timingSafeEqual } from "@/lib/auth-token";
import { FUEL_LEVELS, FUEL_TYPES, joinName, ageFromBirthDate } from "@/lib/contract";

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
  const dateOrNull = (name: string) => text(name) || null;

  const vehicleId = Number(text("vehicle_id"));
  const vehicle = Number.isInteger(vehicleId) ? await getVehicleById(vehicleId) : null;
  if (!vehicle) return { ok: false, error: "Vehicule introuvable." };

  const firstName = text("first_name");
  const lastName = text("last_name");
  const birthDate = text("birth_date");
  const cin = text("cin_number");
  const licenseIssueDate = text("license_issue_date");
  const phone = text("driver_phone");
  const startDate = text("start_date");
  const endDate = text("end_date");

  if (
    !firstName ||
    !lastName ||
    !birthDate ||
    !cin ||
    !phone ||
    !licenseIssueDate ||
    !startDate ||
    !endDate
  ) {
    return {
      ok: false,
      error:
        "Remplissez prenom, nom, date de naissance, CIN, telephone, date de permis et dates de location.",
    };
  }
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime()) || birth > new Date()) {
    return { ok: false, error: "Date de naissance invalide." };
  }
  const age = ageFromBirthDate(birthDate);
  if (age <= 0 || age > 120) {
    return { ok: false, error: "Date de naissance invalide." };
  }
  if (endDate < startDate) {
    return { ok: false, error: "La date de fin est avant la date de debut." };
  }

  const hasSecondDriver = formData.get("has_second_driver") === "on";
  const secondFirst = text("second_driver_first_name");
  const secondLast = text("second_driver_last_name");
  if (hasSecondDriver && (!secondFirst || !secondLast)) {
    return { ok: false, error: "Prenom et nom du 2e conducteur obligatoires." };
  }

  const fuelLevel = text("fuel_level");
  if (fuelLevel && !(FUEL_LEVELS as readonly string[]).includes(fuelLevel)) {
    return { ok: false, error: "Niveau de carburant invalide." };
  }
  const fuelType = text("fuel_type");
  if (fuelType && !FUEL_TYPES.some((t) => t.value === fuelType)) {
    return { ok: false, error: "Type de carburant invalide." };
  }

  let damages: DamageEntry[] = [];
  try {
    const parsed = JSON.parse(text("damages_json") || "[]");
    if (Array.isArray(parsed)) damages = parsed;
  } catch {
    damages = [];
  }

  const advance = Number(text("advance")) || 0;
  if (advance < 0) return { ok: false, error: "Avance invalide." };

  const result = await createManualContract({
    contract_number: text("contract_number") || null,

    vehicle_id: vehicle.id,
    vehicle_label: `${vehicle.brand} ${vehicle.model}`,
    registration_plate: text("registration_plate"),

    full_name: joinName(firstName, lastName),
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    age,
    cin_number: cin,
    cin_issue_date: dateOrNull("cin_issue_date"),
    license_issue_date: licenseIssueDate,
    driver_address: text("driver_address"),
    driver_phone: phone,
    driver_license_number: text("driver_license_number"),
    driver_passport_number: text("driver_passport_number"),
    passport_issue_date: dateOrNull("passport_issue_date"),

    has_second_driver: hasSecondDriver,
    second_driver_full_name: hasSecondDriver ? joinName(secondFirst, secondLast) : "",
    second_driver_first_name: hasSecondDriver ? secondFirst : "",
    second_driver_last_name: hasSecondDriver ? secondLast : "",
    second_driver_birth_date: hasSecondDriver ? dateOrNull("second_driver_birth_date") : null,
    second_driver_address: hasSecondDriver ? text("second_driver_address") : "",
    second_driver_phone: hasSecondDriver ? text("second_driver_phone") : "",
    second_driver_cin_number: hasSecondDriver ? text("second_driver_cin_number") : "",
    second_driver_cin_issue_date: hasSecondDriver ? dateOrNull("second_driver_cin_issue_date") : null,
    second_driver_license_number: hasSecondDriver ? text("second_driver_license_number") : "",
    second_driver_license_issue_date: hasSecondDriver
      ? dateOrNull("second_driver_license_issue_date")
      : null,
    second_driver_passport_number: hasSecondDriver ? text("second_driver_passport_number") : "",
    second_driver_passport_issue_date: hasSecondDriver
      ? dateOrNull("second_driver_passport_issue_date")
      : null,

    start_date: startDate,
    end_date: endDate,
    start_time: text("start_time") || "10:00",
    end_time: text("end_time") || "10:00",
    departure_place: text("departure_place"),
    return_place: text("return_place"),

    advance,
    override_total_ttc: numberOrNull("override_total_ttc"),
    prolongation: text("prolongation"),
    expected_return_date: dateOrNull("expected_return_date"),
    expected_return_time: dateOrNull("expected_return_time"),

    fuel_level: fuelLevel,
    fuel_type: fuelType,
    damages,
  });

  if (!result.ok) {
    if (result.reason === "duplicateContractNumber") {
      return { ok: false, error: "Ce numero de serie est deja utilise par un autre contrat." };
    }
    return { ok: false, error: "Ce vehicule est deja reserve (contrat confirme) sur ces dates." };
  }

  revalidatePath("/admin/real/reservations");
  revalidatePath("/admin/real/contracts");
  revalidatePath("/admin/real/contracts");
  revalidatePath("/vehicules");

  return {
    ok: true,
    id: result.id,
    contractNumber: result.contract_number,
    hasSecondDriver,
  };
}