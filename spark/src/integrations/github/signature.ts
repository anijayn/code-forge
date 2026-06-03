import { createHmac, timingSafeEqual } from "crypto";

export function validateSignature(
  payload: Buffer,
  signature: string | undefined,
  secret: string,
): boolean {
  if (!signature) {
    return false;
  }

  // Computes the HMAC SHA 256 digest of payload using secret
  // And formats it to sha256=<hex> that matches GitHub's header
  const expected = `sha256=${createHmac("sha256", secret)
    .update(payload)
    .digest("hex")}`;

  try {
    // Avoids leaking timing information while comparison
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
