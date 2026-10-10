import { sql, isVehicleAvailable, isOverlapError, isUniqueViolation, type DamageEntry, type EquipmentChecklist } from "@/lib/db";

export type ManualContractInput = {
  // Admin-chosen serial number for the printed contract. Blank/null falls
  // back to the auto-generated ARC-YYYY-NNNNN numbering.
  contract_number?: string | null;

  vehicle_id: number;
  vehicle_label: string;
  registration_plate: string;

  // Premier conducteur (full_name and age are derived by the caller)
  full_name: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  age: number;
  cin_number: string;
  cin_issue_date: string | null;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;
  passport_issue_date: string | null;

  // 2eme conducteur
  has_second_driver: boolean;
  second_driver_full_name: string;
  second_driver_first_name: string;
  second_driver_last_name: string;
  second_driver_birth_date: string | null;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_cin_issue_date: string | null;
  second_driver_license_number: string;
  second_driver_license_issue_date: string | null;
  second_driver_passport_number: string;
  second_driver_passport_issue_date: string | null;

  // Depart / retour
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  departure_place: string;
  return_place: string;

  // Facturation, prolongation, retour prevu
  advance: number;
  override_total_ttc: number | null;
  prolongation: string;
  expected_return_date: string | null;
  expected_return_time: string | null;

  // Carburant & dommages
  fuel_level: string;
  fuel_type: string;
  franchise_included: string;
  franchise_amount: number | null;
  damages: DamageEntry[];
  equipment: EquipmentChecklist;
};

// Admin-created contract: inserts the reservation already confirmed and
// assigns the ARC-YYYY-NNNNN number in one transaction. Only the admin
// action calls this - the public form keeps using createReservation().
export async function createManualContract(
  data: ManualContractInput
): Promise<
  | { ok: true; id: number; contract_number: string }
  | { ok: false; reason: "conflict" }
  | { ok: false; reason: "duplicateContractNumber" }
> {
  const available = await isVehicleAvailable(
    data.vehicle_id,
    data.start_date,
    data.end_date
  );
  if (!available) return { ok: false, reason: "conflict" };

  // The check above is only a friendly early answer. The real protection is
  // the database constraint (migrations/012): if another contract for the same
  // car and dates slipped in meanwhile, the INSERT fails and we report a conflict.
  let result: { id: number; contract_number: string };
  try {
    result = await sql.begin(async (tx) => {
    const rows = await tx<{ id: number }[]>`
      INSERT INTO reservations
        (vehicle_id, vehicle_label, registration_plate,
         full_name, first_name, last_name, birth_date, age,
         cin_number, cin_issue_date, license_issue_date,
         driver_address, driver_phone, driver_license_number,
         driver_passport_number, passport_issue_date,
         has_second_driver,
         second_driver_full_name, second_driver_first_name, second_driver_last_name,
         second_driver_birth_date, second_driver_address, second_driver_phone,
         second_driver_cin_number, second_driver_cin_issue_date,
         second_driver_license_number, second_driver_license_issue_date,
         second_driver_passport_number, second_driver_passport_issue_date,
         start_date, end_date, start_time, end_time,
         departure_place, return_place,
         advance, override_total_ttc, prolongation,
         expected_return_date, expected_return_time,
         fuel_level, fuel_type, franchise_included, franchise_amount,
         damages, equipment,
         status, source)
      VALUES
        (${data.vehicle_id}, ${data.vehicle_label}, ${data.registration_plate},
         ${data.full_name}, ${data.first_name}, ${data.last_name}, ${data.birth_date}, ${data.age},
         ${data.cin_number}, ${data.cin_issue_date}, ${data.license_issue_date},
         ${data.driver_address}, ${data.driver_phone}, ${data.driver_license_number},
         ${data.driver_passport_number}, ${data.passport_issue_date},
         ${data.has_second_driver},
         ${data.second_driver_full_name}, ${data.second_driver_first_name}, ${data.second_driver_last_name},
         ${data.second_driver_birth_date}, ${data.second_driver_address}, ${data.second_driver_phone},
         ${data.second_driver_cin_number}, ${data.second_driver_cin_issue_date},
         ${data.second_driver_license_number}, ${data.second_driver_license_issue_date},
         ${data.second_driver_passport_number}, ${data.second_driver_passport_issue_date},
         ${data.start_date}, ${data.end_date}, ${data.start_time}, ${data.end_time},
         ${data.departure_place}, ${data.return_place},
         ${data.advance}, ${data.override_total_ttc}, ${data.prolongation},
         ${data.expected_return_date}, ${data.expected_return_time},
         ${data.fuel_level}, ${data.fuel_type},
         ${data.franchise_included}, ${data.franchise_amount},
         ${tx.json(data.damages)}, ${tx.json(data.equipment)},
         'confirmed', 'walk_in')
      RETURNING id
    `;
    const id = rows[0].id;
    const upd = await tx<{ contract_number: string }[]>`
      UPDATE reservations
      SET contract_number = COALESCE(
            ${data.contract_number || null},
            'ARC-' || to_char(now(), 'YYYY') || '-' || lpad(id::text, 5, '0')
          ),
          contract_generated_at = now()
      WHERE id = ${id}
      RETURNING contract_number
    `;
    return { id, contract_number: upd[0].contract_number };
    });
  } catch (err) {
    if (isOverlapError(err)) return { ok: false, reason: "conflict" };
    if (isUniqueViolation(err, "reservations_contract_number_key")) {
      return { ok: false, reason: "duplicateContractNumber" };
    }
    throw err;
  }

  return { ok: true, ...result };
}