"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { createVehicle, updateVehicle, deleteVehicle, updateReservationStatus, deleteReservation, type ReservationStatus } from "@/lib/db";
import { checkPassword, getExpectedSessionToken } from "@/lib/auth";

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

async function uploadIfPresent(formData: FormData): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      `Type de fichier non autorisé : ${file.type || "inconnu"}. Formats acceptés : JPEG, PNG, WEBP, GIF.`
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Le fichier dépasse la taille maximale autorisée (5 Mo).");
  }

  const blob = await put(`vehicles/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return blob.url;
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
  await updateReservationStatus(id, status);
  revalidatePath("/admin/reservations");
}

export async function deleteReservationAction(id: number) {
  await deleteReservation(id);
  revalidatePath("/admin/reservations");
}