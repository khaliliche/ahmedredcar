// Server-side validation of signature data URLs.
// The client only sends "data:image/png;base64,...", but that prefix is
// trivial to fake. We decode the payload and verify the PNG magic bytes
// and a sane decoded size before anything is stored or later rendered
// by react-pdf in the PDF route.

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_SIGNATURE_BYTES = 400 * 1024; // ~400 KB decoded, far above a real pad PNG

export function isValidPngDataUrl(dataUrl: string): boolean {
  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl);
  if (!match) return false;

  const clean = match[1].replace(/\s/g, "");
  let decoded: Buffer;
  try {
    decoded = Buffer.from(clean, "base64");
  } catch {
    return false;
  }

  if (decoded.length < PNG_MAGIC.length) return false;
  if (decoded.length > MAX_SIGNATURE_BYTES) return false;
  return decoded.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC);
}