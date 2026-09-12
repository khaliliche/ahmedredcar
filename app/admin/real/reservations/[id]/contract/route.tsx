import { renderToBuffer } from "@react-pdf/renderer";
import { getReservationById, getVehicleById } from "@/lib/db";
import { ContractDocument } from "@/lib/pdf/ContractDocument";

// react-pdf needs Node APIs (Buffer, fs for font handling), so this must
// run on the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reservation = await getReservationById(Number(id));

  if (!reservation) {
    return new Response("Réservation introuvable.", { status: 404 });
  }

  if (!reservation.contract_number) {
    return new Response(
      "Le contrat n'a pas encore été généré. Confirmez d'abord la réservation.",
      { status: 409 }
    );
  }

  const vehicle = reservation.vehicle_id ? await getVehicleById(reservation.vehicle_id) : null;

  const buffer = await renderToBuffer(
    <ContractDocument reservation={reservation} vehicle={vehicle} />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrat-${reservation.contract_number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
