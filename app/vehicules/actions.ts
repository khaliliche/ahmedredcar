"use server";

import { cookies, headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateReservationStatus,
  deleteReservation,
  confirmReservation,
  createSigningToken,
  createSigningToken2,
  updateReservationHandover,
  updateReservationContract,
  updateReservationContractChecked,
  setAdminSignature,
  getReservationById,
  getBlockingReservation,
  getVehicleById,
  type ReservationStatus,
  type DamageEntry,
  type EquipmentChecklist,
} from "@/lib/db";
import {
  checkPassword,
  getExpectedSessionToken,
  getClientIp,
  checkFailureLimit,
  recordFailure,
  resetFailures,
  timingSafeEqual,
  LOGIN_MAX_ATTEMPTS,
  LOGIN_BAN_MS,
} from "@/lib/auth";
import {
  EQUIPMENT_ITEMS,
  FUEL_LEVELS,
  FUEL_TYPES,
  joinName,
  ageFromBirthDate,
} from "@/lib/contract";
import { isValidPngDataUrl } from "@/lib/signature";

// Double-check the session cookie on every admin action, even though middleware guards the path.
async function requireAdmin() {
  const expectedToken = await getExpectedSessionToken();

  const store = await cookies();
  const cookie = store.get("admin_session")?.value;
  if (!expectedToken || !cookie || !timingSafeEqual(cookie, expectedToken)) {
    redirect("/admin/real/login");
  }
}

export async function loginAction(formData: FormData) {
  const h = await headers();
  const ip = getClientIp(h);

  // Persistent, server-side ban: survives redeploys and cookie deletion.
  const limitKey = `login:${ip}`;
  const rl = await checkFailureLimit(limitKey);
  if (!rl.allowed) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    redirect("/admin/real/login");
  }

  const password = formData.get("password") as string;

  const isValid = await checkPassword(password);
  if (!isValid) {
    await recordFailure(limitKey, {
      maxAttempts: LOGIN_MAX_ATTEMPTS,
      banMs: LOGIN_BAN_MS,
    });
    await new Promise((resolve) => setTimeout(resolve, 800));
    redirect("/admin/real/login?error=1");
  }
  await resetFailures(limitKey);

  const sessionToken = await getExpectedSessionToken();
  if (!sessionToken) {
    redirect("/admin/real/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin/real");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/real/login");
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const STORAGE_BUCKET = "vehicles";

// The browser's file.type is client-controlled — verify the actual bytes.
const MAGIC_CHECKS: Record<string, (b: Buffer) => boolean> = {
  "image/jpeg": (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b.length >= 8 &&
    b.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    ),
  "image/webp": (b) =>
    b.length >= 12 &&
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP",
  "image/gif": (b) =>
    b.length >= 6 &&
    (b.toString("ascii", 0, 6) === "GIF87a" ||
      b.toString("ascii", 0, 6) === "GIF89a"),
};

async function sniffImageType(file: File): Promise<string | null> {
  const head = Buffer.from(await file.slice(0, 16).arrayBuffer());
  for (const [type, matches] of Object.entries(MAGIC_CHECKS)) {
    if (matches(head)) return type;
  }
  return null;
}

async function uploadIfPresent(formData: FormData): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return null;

  const detectedType = await sniffImageType(file);
  if (!detectedType || !ALLOWED_IMAGE_TYPES.has(detectedType)) {
    throw new Error(
      "Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WEBP, GIF."
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Le fichier dépasse la taille maximale autorisée (5 Mo).");
  }

  const safeName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      contentType: detectedType, // verified by magic bytes, not client input
      upsert: false,
    });

  if (error) {
    throw new Error(`Échec de l'upload : ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

function revalidateAll() {
  revalidatePath("/admin/real");
  revalidatePath("/vehicules");
  revalidatePath("/");
}

export async function createVehicleAction(formData: FormData) {
  await requireAdmin();
  const uploadedUrl = await uploadIfPresent(formData);

  await createVehicle({
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    price_per_day: Number(formData.get("price_per_day")),
    description: (formData.get("description") as string) ?? "",
    image_url: uploadedUrl ?? "",
  });

  revalidateAll();
  redirect("/admin/real");
}

export async function updateVehicleAction(id: number, formData: FormData) {
  await requireAdmin();
  const uploadedUrl = await uploadIfPresent(formData);
  const existingUrl = (formData.get("existing_image_url") as string) ?? "";

  await updateVehicle(id, {
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    price_per_day: Number(formData.get("price_per_day")),
    description: (formData.get("description") as string) ?? "",
    image_url: uploadedUrl ?? existingUrl,
  });

  revalidateAll();
  redirect("/admin/real");
}

export async function deleteVehicleAction(id: number) {
  await requireAdmin();
  await deleteVehicle(id);
  revalidateAll();
}

export async function updateReservationStatusAction(id: number, status: ReservationStatus) {
  await requireAdmin();
  if (status === "confirmed") {
    const result = await confirmReservation(id);
    if (!result.ok) {
      revalidatePath("/admin/real/reservations");
      revalidatePath(`/admin/real/reservations/${id}`);
      return;
    }
  } else {
    await updateReservationStatus(id, status);
  }

  revalidatePath("/admin/real/reservations");
  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath("/vehicules");
}

export async function deleteReservationAction(id: number) {
  await requireAdmin();
  await deleteReservation(id);
  revalidatePath("/admin/real/reservations");
  revalidatePath("/vehicules");
}

/* -------------------------------------------------------------------------- */
/* HANDOVER (état des lieux)                                                  */
/* -------------------------------------------------------------------------- */

export async function saveHandoverAction(id: number, formData: FormData) {
  await requireAdmin();

  const text = (name: string) => String(formData.get(name) ?? "").trim();

  const equipment: EquipmentChecklist = {};
  for (const item of EQUIPMENT_ITEMS) {
    equipment[item.key] = formData.get(`equipment_${item.key}`) === "on";
  }

  let damages: DamageEntry[] = [];
  try {
    const parsed = JSON.parse(text("damages_json") || "[]");
    if (Array.isArray(parsed)) damages = parsed;
  } catch {
    damages = [];
  }

  await updateReservationHandover(id, {
    registration_plate: text("registration_plate"),
    mileage_start: text("mileage_start") ? Number(text("mileage_start")) : null,
    mileage_end: text("mileage_end") ? Number(text("mileage_end")) : null,
    damages,
    equipment,
    delivery_fee: Number(text("delivery_fee")) || 0,
    pickup_fee: Number(text("pickup_fee")) || 0,
  });

  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath(`/admin/real/reservations/${id}/contract`);
  revalidatePath("/admin/real/reservations");
}

/* -------------------------------------------------------------------------- */
/* SIGNING LINKS                                                              */
/* -------------------------------------------------------------------------- */

export async function sendSigningLinkAction(id: number) {
  await requireAdmin();
  await createSigningToken(id);
  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath(`/admin/real/reservations/${id}/contract`);
}

export async function sendSecondDriverLinkAction(id: number) {
  await requireAdmin();
  await createSigningToken2(id);
  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath(`/admin/real/reservations/${id}/contract`);
}

// The admin draws their own signature on the contract page. Stored like the
// client signature (PNG data URL) and rendered in the PDF.
export async function saveAdminSignatureAction(
  id: number,
  signature: string | null
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (signature !== null) {
    if (!isValidPngDataUrl(signature)) {
      return { ok: false, error: "Signature invalide." };
    }
  }
  await setAdminSignature(id, signature);
  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath(`/admin/real/reservations/${id}/contract`);
  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* LIVE AVAILABILITY CHECK (banner on the contract pages)                     */
/* -------------------------------------------------------------------------- */

export type AvailabilityResult =
  | { state: "free" }
  | { state: "reserved"; until: string }
  | { state: "unknown" };

export async function checkAvailabilityAction(
  vehicleId: number,
  startDate: string,
  endDate: string,
  excludeReservationId?: number
): Promise<AvailabilityResult> {
  await requireAdmin();

  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  if (
    !Number.isInteger(vehicleId) ||
    vehicleId <= 0 ||
    !isoDate.test(startDate) ||
    !isoDate.test(endDate) ||
    endDate < startDate
  ) {
    return { state: "unknown" };
  }

  const blocking = await getBlockingReservation(
    vehicleId,
    startDate,
    endDate,
    excludeReservationId
  );
  if (!blocking) return { state: "free" };
  return { state: "reserved", until: blocking.end_label };
}

/* -------------------------------------------------------------------------- */
/* SAVE CONTRACT (unified contract form, "Enregistrer")                       */
/* -------------------------------------------------------------------------- */

export type SaveContractResult = { ok: true } | { ok: false; error: string };

export async function saveContractAction(
  id: number,
  formData: FormData
): Promise<SaveContractResult> {
  await requireAdmin();

  const reservation = await getReservationById(id);
  if (!reservation) return { ok: false, error: "Reservation introuvable." };

  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const numberOrNull = (name: string) => {
    const value = text(name);
    if (value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };

  const startDate = text("start_date");
  const endDate = text("end_date");
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDate.test(startDate) || !isoDate.test(endDate)) {
    return { ok: false, error: "Renseignez les dates de location." };
  }
  if (endDate < startDate) {
    return { ok: false, error: "La date de fin est avant la date de debut." };
  }

  const vehicleIdRaw = Number(text("vehicle_id"));
  const vehicle =
    Number.isInteger(vehicleIdRaw) && vehicleIdRaw > 0
      ? await getVehicleById(vehicleIdRaw)
      : null;

  let damages: DamageEntry[] = [];
  try {
    const parsed = JSON.parse(text("damages_json") || "[]");
    if (Array.isArray(parsed)) damages = parsed;
  } catch {
    damages = [];
  }

  const dateOrNull = (name: string) => text(name) || null;
  // DATE columns come back from postgres.js as Date objects.
  const keepDate = (v: unknown) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? "");

  const firstName = text("first_name");
  const lastName = text("last_name");
  const secondFirst = text("second_driver_first_name");
  const secondLast = text("second_driver_last_name");

  const birthDate = text("birth_date");
  let age = reservation.age;
  if (birthDate) {
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime()) || birth > new Date()) {
      return { ok: false, error: "Date de naissance invalide." };
    }
    age = ageFromBirthDate(birthDate);
  }

  const fuelLevel = text("fuel_level");
  if (fuelLevel && !(FUEL_LEVELS as readonly string[]).includes(fuelLevel)) {
    return { ok: false, error: "Niveau de carburant invalide." };
  }
  const fuelType = text("fuel_type");
  if (fuelType && !FUEL_TYPES.some((t) => t.value === fuelType)) {
    return { ok: false, error: "Type de carburant invalide." };
  }

  const advance = Number(text("advance")) || 0;
  if (advance < 0) return { ok: false, error: "Avance invalide." };

  const saved = await updateReservationContractChecked(id, {
    vehicle_id: vehicle ? vehicle.id : null,
    vehicle_label: vehicle ? `${vehicle.brand} ${vehicle.model}` : text("vehicle_label"),
    registration_plate: text("registration_plate"),

    full_name: joinName(firstName, lastName) || reservation.full_name,
    first_name: firstName,
    last_name: lastName,
    birth_date: dateOrNull("birth_date"),
    age,
    cin_number: text("cin_number"),
    cin_issue_date: dateOrNull("cin_issue_date"),
    license_issue_date: text("license_issue_date") || keepDate(reservation.license_issue_date),
    driver_address: text("driver_address"),
    driver_phone: text("driver_phone"),
    driver_license_number: text("driver_license_number"),
    driver_passport_number: text("driver_passport_number"),
    passport_issue_date: dateOrNull("passport_issue_date"),

    has_second_driver: formData.get("has_second_driver") === "on",
    second_driver_full_name: joinName(secondFirst, secondLast),
    second_driver_first_name: secondFirst,
    second_driver_last_name: secondLast,
    second_driver_birth_date: dateOrNull("second_driver_birth_date"),
    second_driver_address: text("second_driver_address"),
    second_driver_phone: text("second_driver_phone"),
    second_driver_cin_number: text("second_driver_cin_number"),
    second_driver_cin_issue_date: dateOrNull("second_driver_cin_issue_date"),
    second_driver_license_number: text("second_driver_license_number"),
    second_driver_license_issue_date: dateOrNull("second_driver_license_issue_date"),
    second_driver_passport_number: text("second_driver_passport_number"),
    second_driver_passport_issue_date: dateOrNull("second_driver_passport_issue_date"),

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

  if (!saved.ok) {
    if (saved.reason === "signed") {
      return {
        ok: false,
        error: "Ce contrat a déjà été signé. La modification est verrouillée.",
      };
    }
    return {
      ok: false,
      error:
        saved.reason === "conflict"
          ? `Voiture reservee jusqu'au ${saved.endLabel}.`
          : "Reservation introuvable.",
    };
  }

  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath(`/admin/real/reservations/${id}/contract`);
  revalidatePath("/admin/real/reservations");

  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* GENERER LE CONTRAT                                                         */
/* -------------------------------------------------------------------------- */

export async function generateContractAction(id: number) {
  await requireAdmin();

  const reservation = await getReservationById(id);
  if (!reservation) notFound();

  if (!reservation.contract_number) {
    const result = await confirmReservation(id);
    if (!result.ok) {
      // Car got booked in the meantime: the contract page shows the red message.
      redirect(`/admin/real/reservations/${id}`);
    }
  }

  revalidatePath(`/admin/real/reservations/${id}`);
  revalidatePath("/admin/real/reservations");
  revalidatePath("/vehicules");
  redirect(`/admin/real/reservations/${id}/pdf`);
}