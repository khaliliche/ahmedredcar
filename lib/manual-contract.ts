import {
  sql,
  isVehicleAvailable,
  type DamageEntry,
  type EquipmentChecklist,
} from "@/lib/db";

export type ManualContractInput = {
  vehicle_id: number;
  vehicle_label: string;

  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;

  has_second_driver: boolean;
  second_driver_full_name: string;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_license_number: string;
  second_driver_passport_number: string;

  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;

  registration_plate: string;
  mileage_start: number | null;
  mileage_end: number | null;
  damages: DamageEntry[];
  equipment: EquipmentChecklist;
  delivery_fee: number;
  pickup_fee: number;

  fait_a: string;
  override_total_ht: number | null;
  override_tva: number | null;
  override_total_ttc: number | null;
};

// Admin-created contract: inserts the reservation already confirmed and
// assigns the ARC-YYYY-NNNNN number in one transaction. Only the admin
// action calls this - the public form keeps using createReservation().
export async function createManualContract(
  data: ManualContractInput
): Promise<
  | { ok: true; id: number; contract_number: string }
  | { ok: false; reason: "conflict" }
> {
  const available = await isVehicleAvailable(
    data.vehicle_id,
    data.start_date,
    data.end_date
  );
  if (!available) return { ok: false, reason: "conflict" };

  const result = await sql.begin(async (tx) => {
    const rows = await tx<{ id: number }[]>`
      INSERT INTO reservations
        (vehicle_id, vehicle_label,
         full_name, age, cin_number, license_issue_date,
         driver_address, driver_phone, driver_license_number, driver_passport_number,
         has_second_driver,
         second_driver_full_name, second_driver_address, second_driver_phone,
         second_driver_cin_number, second_driver_license_number, second_driver_passport_number,
         start_date, end_date, start_time, end_time,
         registration_plate, mileage_start, mileage_end,
         damages, equipment, delivery_fee, pickup_fee,
         fait_a, override_total_ht, override_tva, override_total_ttc,
         status, source)
      VALUES
        (${data.vehicle_id}, ${data.vehicle_label},
         ${data.full_name}, ${data.age}, ${data.cin_number}, ${data.license_issue_date},
         ${data.driver_address}, ${data.driver_phone}, ${data.driver_license_number}, ${data.driver_passport_number},
         ${data.has_second_driver},
         ${data.second_driver_full_name}, ${data.second_driver_address}, ${data.second_driver_phone},
         ${data.second_driver_cin_number}, ${data.second_driver_license_number}, ${data.second_driver_passport_number},
         ${data.start_date}, ${data.end_date}, ${data.start_time}, ${data.end_time},
         ${data.registration_plate}, ${data.mileage_start}, ${data.mileage_end},
         ${tx.json(data.damages)}, ${tx.json(data.equipment)}, ${data.delivery_fee}, ${data.pickup_fee},
         ${data.fait_a}, ${data.override_total_ht}, ${data.override_tva}, ${data.override_total_ttc},
         'confirmed', 'walk_in')
      RETURNING id
    `;
    const id = rows[0].id;
    const upd = await tx<{ contract_number: string }[]>`
      UPDATE reservations
      SET contract_number = 'ARC-' || to_char(now(), 'YYYY') || '-' || lpad(id::text, 5, '0'),
          contract_generated_at = now()
      WHERE id = ${id}
      RETURNING contract_number
    `;
    return { id, contract_number: upd[0].contract_number };
  });

  return { ok: true, ...result };
}