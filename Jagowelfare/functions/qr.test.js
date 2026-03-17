const test = require("node:test");
const assert = require("node:assert/strict");

const { signQrPayload, verifyQrPayload } = require("./qr");

test("QR payload signs and verifies", () => {
  const secret = "test-secret";
  const payload = signQrPayload({ secret, eventId: "e1", ticketId: "t1", v: 1 });
  const parsed = verifyQrPayload({ secret, qrPayload: payload });
  assert.deepEqual(parsed, { v: 1, eventId: "e1", ticketId: "t1" });
});

test("QR payload rejects tampering", () => {
  const secret = "test-secret";
  const payload = signQrPayload({ secret, eventId: "e1", ticketId: "t1", v: 1 });
  const tampered = payload.replace("t1", "t2");
  const parsed = verifyQrPayload({ secret, qrPayload: tampered });
  assert.equal(parsed, null);
});

