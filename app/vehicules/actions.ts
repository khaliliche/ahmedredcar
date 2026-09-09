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
  | { success: false; errorCode: string };

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
    return { success: false, errorCode: "missingFields" };
  }
  if (!Number.isFinite(age) || age < 18 || age > 99) {
    return { success: false, errorCode: "invalidAge" };
  }
  if (new Date(endDate) <= new Date(startDate)) {
    return { success: false, errorCode: "invalidDateRange" };
  }
  if (new Date(licenseIssueDate) > new Date()) {
    return { success: false, errorCode: "licenseDateInFuture" };
  }

  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    return { success: false, errorCode: "vehicleNotFound" };
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
