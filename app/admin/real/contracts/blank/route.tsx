import { renderToBuffer } from "@react-pdf/renderer";
import { ContractDocument } from "@/lib/pdf/ContractDocument";
import { blankReservation } from "@/lib/pdf/blank-reservation";

// Guarded by middleware (/admin/real/:path*). Needs the Node.js runtime.
export const runtime = "nodejs";

// Blank contract with fillable PDF fields. Only the serial number is printed.
export async function GET(request: Request) {
  const serial = (new URL(request.url).searchParams.get("serial") ?? "")
    .trim()
    .slice(0, 40);

  if (!serial) {
    return new Response("Numéro de série requis.", { status: 400 });
  }

  const buffer = await renderToBuffer(
    <ContractDocument reservation={blankReservation(serial)} vehicle={null} fillable />
  );

  const safe = serial.replace(/[^A-Za-z0-9_-]/g, "_");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrat-${safe}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}