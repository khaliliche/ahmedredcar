"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createReservation, getVehicleById } from "@/lib/db";
import { checkReservationLimit, getClientIp } from "@/lib/auth";
import {
  ageFromBirthDate,
  daysBetween,
  isRentalDurationValid,
  joinName,
  DEFAULT_MIN_RENTAL_DAYS,
} from "@/lib/contract";

// PUBLIC server action (website reservation form). It only ever creates a
// 'pending' reservation. Handover, billing and signature fields are set by
// the admin actions (app/admin/real/actions.ts) and must never be accepted here.

export type ReservationErrorCode =
  | "missingFields"
  | "invalidAge"
  | "invalidDateRange"
  | "licenseDateInFuture"
  | "vehicleNotFound"
  | "minRentalDays"
  | "rateLimited";

export type CreateReservationResult =
  | {
      success: true;
      whatsappData: {
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
        secondDriverFullName: string;
        secondDriverCinNumber: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
      };
    }
  | {
      success: false;
      errorCode: ReservationErrorCode;
      errorParams?: Record<string, string | number>;
    };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;
const MAX_TEXT = 200;

function fail(
  errorCode: ReservationErrorCode,
  errorParams?: Record<string, string | number>
): CreateReservationResult {
  return { success: false, errorCode, errorParams };
}

function isRealDate(value: string): boolean {
  return ISO_DATE.test(value) && !Number.isNaN(new Date(value).getTime());
}

export async function createReservationAction(
  formData: FormData
): Promise<CreateReservationResult> {
  // Honeypot: real users never fill this field.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return fail("missingFields");
  }

  // Per-IP budget (5 requests / hour) so the table cannot be flooded.
  const h = await headers();
  const allowed = await checkReservationLimit(`reserve:${getClientIp(h)}`);
  if (!allowed) return fail("rateLimited");

  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const dateOrNull = (name: string) => {
    const v = text(name);
    return v && isRealDate(v) ? v : null;
  };

  // ---- main driver ----
  const vehicleId = Number(text("vehicle_id"));
  const firstName = text("first_name");
  const lastName = text("last_name");
  const birthDate = text("birth_date");
  const cinNumber = text("cin_number");
  const cinIssueDate = text("cin_issue_date");
  const licenseNumber = text("driver_license_number");
  const licenseIssueDate = text("license_issue_date");
  const passportNumber = text("driver_passport_number");
  const address = text("driver_address");
  const phone = text("driver_phone");
  const startDate = text("start_date");
  const endDate = text("end_date");
  const startTime = TIME.test(text("start_time")) ? text("start_time") : "10:00";
  const endTime = TIME.test(text("end_time")) ? text("end_time") : "10:00";

  const hasSecondDriver = formData.get("has_second_driver") === "on";
  const secondFirst = text("second_driver_first_name");
  const secondLast = text("second_driver_last_name");
  const secondCin = text("second_driver_cin_number");

  const requiredOk =
    Number.isInteger(vehicleId) &&
    vehicleId > 0 &&
    firstName &&
    lastName &&
    // CIN (Moroccans) or passport (foreigners): at least one is required.
    (cinNumber || passportNumber) &&
    licenseNumber &&
    licenseIssueDate &&
    phone &&
    startDate &&
    endDate &&
    (!hasSecondDriver || (secondFirst && secondLast && secondCin));
  if (!requiredOk) return fail("missingFields");

  // Free-text fields: sane maximum length.
  const texts = [
    firstName, lastName, cinNumber, licenseNumber, passportNumber, address, phone,
    secondFirst, secondLast, secondCin,
    text("second_driver_address"), text("second_driver_phone"),
    text("second_driver_license_number"), text("second_driver_passport_number"),
  ];
  if (texts.some((t) => t.length > MAX_TEXT)) return fail("missingFields");

  // Dates must be real calendar dates.
  if (
    (birthDate && !isRealDate(birthDate)) ||
    (cinIssueDate && !isRealDate(cinIssueDate)) ||
    !isRealDate(licenseIssueDate) ||
    !isRealDate(startDate) ||
    !isRealDate(endDate)
  ) {
    return fail("missingFields");
  }

  // Birth date is optional. Without it the age cannot be verified: store 0
  // ("unknown") and let the agency check the ID at handover.
  let age = 0;
  if (birthDate) {
    age = ageFromBirthDate(birthDate);
    if (!Number.isFinite(age) || age < 18 || age > 99) return fail("invalidAge");
  }

  if (endDate <= startDate) return fail("invalidDateRange");

  const today = new Date().toISOString().slice(0, 10);
  if (licenseIssueDate > today) return fail("licenseDateInFuture");

  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) return fail("vehicleNotFound");

  const days = daysBetween(startDate, endDate);
  const minDays = vehicle.min_rental_days ?? DEFAULT_MIN_RENTAL_DAYS;
  if (!isRentalDurationValid(days, minDays)) {
    return fail("minRentalDays", { min: minDays, days });
  }

  const fullName = joinName(firstName, lastName);
  const secondFullName = hasSecondDriver ? joinName(secondFirst, secondLast) : "";

  await createReservation({
    vehicle_id: vehicle.id,

    full_name: fullName,
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate || null,
    age,
    cin_number: cinNumber,
    cin_issue_date: cinIssueDate || null,
    license_issue_date: licenseIssueDate,
    driver_address: address,
    driver_phone: phone,
    driver_license_number: licenseNumber,
    driver_passport_number: passportNumber,
    passport_issue_date: dateOrNull("passport_issue_date"),

    has_second_driver: hasSecondDriver,
    second_driver_full_name: secondFullName,
    second_driver_first_name: hasSecondDriver ? secondFirst : "",
    second_driver_last_name: hasSecondDriver ? secondLast : "",
    second_driver_birth_date: hasSecondDriver ? dateOrNull("second_driver_birth_date") : null,
    second_driver_address: hasSecondDriver ? text("second_driver_address") : "",
    second_driver_phone: hasSecondDriver ? text("second_driver_phone") : "",
    second_driver_cin_number: hasSecondDriver ? secondCin : "",
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
    start_time: startTime,
    end_time: endTime,
  });

  revalidatePath("/admin/real/reservations");

  return {
    success: true,
    whatsappData: {
      vehicleLabel: `${vehicle.brand} ${vehicle.model}`.trim(),
      fullName,
      age,
      cinNumber,
      licenseIssueDate,
      driverAddress: address,
      driverPhone: phone,
      driverLicenseNumber: licenseNumber,
      driverPassportNumber: passportNumber,
      hasSecondDriver,
      secondDriverFullName: secondFullName,
      secondDriverCinNumber: secondCin,
      startDate,
      endDate,
      startTime,
      endTime,
    },
  };
}