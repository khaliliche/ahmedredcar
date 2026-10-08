"use server";

import { headers } from "next/headers";
import { createReservation, getVehicleById } from "@/lib/db";
import { getClientIp, checkReservationLimit } from "@/lib/auth";
import {
  daysBetween,
  isRentalDurationValid,
  DEFAULT_MIN_RENTAL_DAYS,
  joinName,
  ageFromBirthDate,
} from "@/lib/contract";
type WhatsAppData = {
  vehicleLabel: string;
  fullName: string;
  age: number;
  cinNumber: string;
  licenseIssueDate: string;
  driverAddress: string;
  driverPhone: string;
  driverLicenseNumber: string;
  driverPassportNumber: string;
  hasSecondDriver: boolean;
  secondDriverFullName?: string;
  secondDriverCinNumber?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

type ActionResult =
  | { success: true; whatsappData: WhatsAppData }
  | { success: false; errorCode: string; errorParams?: Record<string, string | number> };

export async function createReservationAction(
  formData: FormData
): Promise<ActionResult> {
  // Per-IP budget so this public endpoint can't flood the reservations table.
  const h = await headers();
  const allowed = await checkReservationLimit(`res:${getClientIp(h)}`);
  if (!allowed) {
    return { success: false, errorCode: "rateLimited" };
  }

  // Honeypot: real users never fill this field; bots that do get a fake
  // success so they move on without writing anything to the database.
  if (String(formData.get("website") || "").trim() !== "") {
    return {
      success: true,
      whatsappData: {
        vehicleLabel: "",
        fullName: "",
        age: 0,
        cinNumber: "",
        licenseIssueDate: "",
        driverAddress: "",
        driverPhone: "",
        driverLicenseNumber: "",
        driverPassportNumber: "",
        hasSecondDriver: false,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
      },
    };
  }

  const vehicleId = Number(formData.get("vehicle_id"));
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const fullName = joinName(firstName, lastName);
  const birthDate = String(formData.get("birth_date") || "");
  const cinNumber = String(formData.get("cin_number") || "").trim();
  const cinIssueDate = String(formData.get("cin_issue_date") || "");
  const licenseIssueDate = String(formData.get("license_issue_date") || "");
  const passportIssueDate = String(formData.get("passport_issue_date") || "");
  const driverAddress = String(formData.get("driver_address") || "").trim();
  const driverPhone = String(formData.get("driver_phone") || "").trim();
  const driverLicenseNumber = String(formData.get("driver_license_number") || "").trim();
  const driverPassportNumber = String(formData.get("driver_passport_number") || "").trim();
  const hasSecondDriver = formData.get("has_second_driver") === "on";
  const secondDriverFirstName = String(formData.get("second_driver_first_name") || "").trim();
  const secondDriverLastName = String(formData.get("second_driver_last_name") || "").trim();
  const secondDriverFullName = joinName(secondDriverFirstName, secondDriverLastName);
  const secondDriverBirthDate = String(formData.get("second_driver_birth_date") || "");
  const secondDriverCinIssueDate = String(formData.get("second_driver_cin_issue_date") || "");
  const secondDriverLicenseIssueDate = String(formData.get("second_driver_license_issue_date") || "");
  const secondDriverPassportIssueDate = String(formData.get("second_driver_passport_issue_date") || "");
  const secondDriverAddress = String(formData.get("second_driver_address") || "").trim();
  const secondDriverPhone = String(formData.get("second_driver_phone") || "").trim();
  const secondDriverCinNumber = String(formData.get("second_driver_cin_number") || "").trim();
  const secondDriverLicenseNumber = String(formData.get("second_driver_license_number") || "").trim();
  const secondDriverPassportNumber = String(formData.get("second_driver_passport_number") || "").trim();
  const startDate = String(formData.get("start_date") || "");
  const endDate = String(formData.get("end_date") || "");
  const startTime = String(formData.get("start_time") || "");
  const endTime = String(formData.get("end_time") || "");

  if (
    !vehicleId ||
    !firstName ||
    !lastName ||
    !birthDate ||
    !cinNumber ||
    !cinIssueDate ||
    !licenseIssueDate ||
    !driverPhone ||
    !driverLicenseNumber ||
    !startDate ||
    !endDate ||
    !startTime ||
    !endTime
  ) {
    return { success: false, errorCode: "missingFields" };
  }
  if (
    hasSecondDriver &&
    (!secondDriverFirstName || !secondDriverLastName || !secondDriverCinNumber)
  ) {
    return { success: false, errorCode: "missingFields" };
  }
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime()) || birth > new Date()) {
    return { success: false, errorCode: "invalidAge" };
  }
  const age = ageFromBirthDate(birthDate);
  if (age < 18 || age > 99) {
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

  const minDays = vehicle.min_rental_days ?? DEFAULT_MIN_RENTAL_DAYS;
  const requestedDays = daysBetween(startDate, endDate);
  if (!isRentalDurationValid(requestedDays, minDays)) {
    return {
      success: false,
      errorCode: "minRentalDays",
      errorParams: { min: minDays, days: requestedDays },
    };
  }

  const vehicleLabel = `${vehicle.brand} ${vehicle.model}`;

  await createReservation({
    vehicle_id: vehicle.id,
    vehicle_label: vehicleLabel,
    full_name: fullName,
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    cin_issue_date: cinIssueDate,
    passport_issue_date: passportIssueDate || null,
    age,
    cin_number: cinNumber,
    license_issue_date: licenseIssueDate,
    driver_address: driverAddress,
    driver_phone: driverPhone,
    driver_license_number: driverLicenseNumber,
    driver_passport_number: driverPassportNumber,
    has_second_driver: hasSecondDriver,
    second_driver_full_name: hasSecondDriver ? secondDriverFullName : "",
    second_driver_first_name: hasSecondDriver ? secondDriverFirstName : "",
    second_driver_last_name: hasSecondDriver ? secondDriverLastName : "",
    second_driver_birth_date: hasSecondDriver ? secondDriverBirthDate || null : null,
    second_driver_cin_issue_date: hasSecondDriver ? secondDriverCinIssueDate || null : null,
    second_driver_license_issue_date: hasSecondDriver ? secondDriverLicenseIssueDate || null : null,
    second_driver_passport_issue_date: hasSecondDriver ? secondDriverPassportIssueDate || null : null,
    second_driver_address: hasSecondDriver ? secondDriverAddress : "",
    second_driver_phone: hasSecondDriver ? secondDriverPhone : "",
    second_driver_cin_number: hasSecondDriver ? secondDriverCinNumber : "",
    second_driver_license_number: hasSecondDriver ? secondDriverLicenseNumber : "",
    second_driver_passport_number: hasSecondDriver ? secondDriverPassportNumber : "",
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
  });

  return {
    success: true,
    whatsappData: {
      vehicleLabel,
      fullName,
      age,
      cinNumber,
      licenseIssueDate,
      driverAddress,
      driverPhone,
      driverLicenseNumber,
      driverPassportNumber,
      hasSecondDriver,
      secondDriverFullName: hasSecondDriver ? secondDriverFullName : undefined,
      secondDriverCinNumber: hasSecondDriver ? secondDriverCinNumber : undefined,
      startDate,
      endDate,
      startTime,
      endTime,
    },
  };
}
