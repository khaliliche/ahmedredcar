"use server";

import { cookies } from "next/headers";
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
  updateReservationHandover,
  updateReservationContract,
  getReservationById,
  type ReservationStatus,
  type DamageEntry,
  type EquipmentChecklist,
} from "@/lib/db";
import { checkPassword, getExpectedSessionToken } from "@/lib/auth";
import { EQUIPMENT_ITEMS } from "@/lib/contract";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  const isValid = await checkPassword(password);
  if (!isValid) {
    redirect("/admin/login?error=1");
  }

  const sessionToken = await getExpectedSessionToken();
  if (!sessionToken) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const STORAGE_BUCKET = "vehicles";

async function uploadIfPresent(formData: FormData): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      `Type de fichier non autorisÃ© : ${file.type || "inconnu"}. Formats acceptÃ©s : JPEG, PNG, WEBP, GIF.`
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Le fichier dÃ©passe la taille maximale autorisÃ©e (5 Mo).");
  }

  const safeName = file.name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-zA-Z0-9._-]/g, "-");
const fileName = `${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Ã‰chec de l'upload : ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/vehicules");
  revalidatePath("/");
}

export async function createVehicleAction(formData: FormData) {
  const uploadedUrl = await uploadIfPresent(formData);

  await createVehicle({
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    price_per_day: Number(formData.get("price_per_day")),
    description: (formData.get("description") as string) ?? "",
    image_url: uploadedUrl ?? "",
  });

  revalidateAll();
  redirect("/admin");
}

export async function updateVehicleAction(id: number, formData: FormData) {
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
  redirect("/admin");
}

export async function deleteVehicleAction(id: number) {
  await deleteVehicle(id);
  revalidateAll();
}

export async function updateReservationStatusAction(id: number, status: ReservationStatus) {
  if (status === "confirmed") {
    const result = await confirmReservation(id);
    if (!result.ok) {
      revalidatePath("/admin/reservations");
      redirect(`/admin/reservations/${id}?error=${result.reason}`);
    }
  } else {
    await updateReservationStatus(id, status);
  }
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
}

export async function deleteReservationAction(id: number) {
  await deleteReservation(id);
  revalidatePath("/admin/reservations");
}

export async function updateReservationHandoverAction(id: number, formData: FormData) {
  const registrationPlate = String(formData.get("registration_plate") || "").trim();

  const mileageStartRaw = formData.get("mileage_start");
  const mileageEndRaw = formData.get("mileage_end");
  const mileageStart =
    mileageStartRaw && mileageStartRaw !== "" ? Number(mileageStartRaw) : null;
  const mileageEnd = mileageEndRaw && mileageEndRaw !== "" ? Number(mileageEndRaw) : null;

  const deliveryFee = Number(formData.get("delivery_fee") || 0);
  const pickupFee = Number(formData.get("pickup_fee") || 0);

  let damages: DamageEntry[] = [];
  try {
    const raw = String(formData.get("damages_json") || "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) damages = parsed;
  } catch {
    damages = [];
  }

  const equipment: EquipmentChecklist = {};
  for (const item of EQUIPMENT_ITEMS) {
    equipment[item.key] = formData.get(`equipment__${item.key}`) === "on";
  }

  await updateReservationHandover(id, {
    registration_plate: registrationPlate,
    mileage_start: mileageStart,
    mileage_end: mileageEnd,
    damages,
    equipment,
    delivery_fee: deliveryFee,
    pickup_fee: pickupFee,
  });

  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin/reservations");
}

// Feature 3 â€” full contract editing. One form, every editable section of
// the PDF, with an optional manual override for the three billing
// totals (left blank = keep using the calculated value).
export async function updateReservationContractAction(
  id: number,
  formData: FormData
) {
  const reservation = await getReservationById(id);

  if (!reservation) {
    notFound();
  }

  const text = (name: string) =>
    String(formData.get(name) ?? "").trim();

  const numberOrNull = (name: string) => {
    const value = String(formData.get(name) ?? "").trim();
    if (value === "") return null;

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  let damages: DamageEntry[] = [];

  try {
    const raw = String(formData.get("damages_json") ?? "[]");
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      damages = parsed;
    }
  } catch {
    damages = [];
  }

  const equipment: EquipmentChecklist = {};

  for (const item of EQUIPMENT_ITEMS) {
    equipment[item.key] =
      formData.get(`equipment__${item.key}`) === "on";
  }

  await updateReservationContract(id, {
    full_name: text("full_name"),
    age: Number(text("age")) || 0,
    cin_number: text("cin_number"),
    license_issue_date: text("license_issue_date"),
    driver_address: text("driver_address"),
    driver_phone: text("driver_phone"),
    driver_license_number: text("driver_license_number"),
    driver_passport_number: text("driver_passport_number"),

    has_second_driver:
      formData.get("has_second_driver") === "on",

    second_driver_full_name: text("second_driver_full_name"),
    second_driver_address: text("second_driver_address"),
    second_driver_phone: text("second_driver_phone"),
    second_driver_cin_number: text("second_driver_cin_number"),
    second_driver_license_number: text(
      "second_driver_license_number"
    ),
    second_driver_passport_number: text(
      "second_driver_passport_number"
    ),

    vehicle_label: text("vehicle_label"),
    registration_plate: text("registration_plate"),

    start_date: text("start_date"),
    end_date: text("end_date"),
    start_time: text("start_time"),
    end_time: text("end_time"),

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

  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath(`/admin/reservations/${id}/edit-contract`);
  revalidatePath(`/admin/reservations/${id}/contract`);
  revalidatePath("/admin/reservations");
  revalidatePath("/admin/contracts");

  redirect(`/admin/reservations/${id}`);
}