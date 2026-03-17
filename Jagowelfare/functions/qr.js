const crypto = require("crypto");

function signQrPayload({ secret, eventId, ticketId, v = 1 }) {
  const msg = `${v}.${eventId}.${ticketId}`;
  const sig = crypto.createHmac("sha256", secret).update(msg).digest("base64url");
  return `${msg}.${sig}`;
}

function verifyQrPayload({ secret, qrPayload }) {
  const parts = String(qrPayload || "").split(".");
  if (parts.length !== 4) return null;
  const [v, eventId, ticketId, sig] = parts;
  if (!v || !eventId || !ticketId || !sig) return null;

  const msg = `${v}.${eventId}.${ticketId}`;
  const expected = crypto.createHmac("sha256", secret).update(msg).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  return { v: Number(v), eventId, ticketId };
}

module.exports = { signQrPayload, verifyQrPayload };

