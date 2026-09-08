"use server";

import { createReservation, getVehicleById } from "@/lib/db";

type WhatsAppData = {
  vehicleLabel: string;
  fullName: string;
  age: number;
  cinNumber: string;
  licenseIssueDate: string;
  startDate: string;
  endDate: string;
};

type ActionResult =
  | { success: true; whatsappData: WhatsAppData }
  | { success: false; error: string };

export async function createReservationAction(
  formData: FormData
): Promise<ActionResult> {
  const vehicleId = Number(formData.get("vehicle_id"));
  const fullName = String(formData.get("full_name") || "").trim();
  const age = Number(formData.get("age"));
  const cinNumber = String(formData.get("cin_number") || "").trim();
  const licenseIssueDate = String(formData.get("license_issue_date") || "");
  const startDate = String(formData.get("start_date") || "");
  const endDate = String(formData.get("end_date") || "");

  if (!vehicleId || !fullName || !cinNumber || !licenseIssueDate || !startDate || !endDate) {
    return { success: false, error: "Veuillez remplir tous les champs." };
  }
  if (!Number.isFinite(age) || age < 18 || age > 99) {
    return { success: false, error: "L'âge doit être compris entre 18 et 99 ans." };
  }
  if (new Date(endDate) <= new Date(startDate)) {
    return { success: false, error: "La date de retour doit être après la date de départ." };
  }
  if (new Date(licenseIssueDate) > new Date()) {
    return { success: false, error: "La date d'obtention du permis ne peut pas être dans le futur." };
  }

  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    return { success: false, error: "Véhicule introuvable." };
  }

  const vehicleLabel = `${vehicle.brand} ${vehicle.model}`;

  await createReservation({
    vehicle_id: vehicle.id,
    vehicle_label: vehicleLabel,
    full_name: fullName,
    age,
    cin_number: cinNumber,
    license_issue_date: licenseIssueDate,
    start_date: startDate,
    end_date: endDate,
  });

  return {
    success: true,
    whatsappData: {
      vehicleLabel,
      fullName,
      age,
      cinNumber,
      licenseIssueDate,
      startDate,
      endDate,
    },
  };
}