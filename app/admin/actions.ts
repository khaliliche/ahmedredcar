"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { createVehicle, updateVehicle, deleteVehicle } from "@/lib/db";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", process.env.ADMIN_PASSWORD as string, {
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

async function uploadIfPresent(formData: FormData): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return null;

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
