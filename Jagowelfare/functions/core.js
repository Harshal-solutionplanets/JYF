const admin = require("firebase-admin");

async function registerForEventCore({ db, uid, eventId, now = admin.firestore.FieldValue.serverTimestamp() }) {
  const eventRef = db.collection("events").doc(String(eventId));
  const eventDoc = await eventRef.get();
  if (!eventDoc.exists) {
    const err = new Error("Event not found");
    err.status = 404;
    throw err;
  }
  if (eventDoc.data()?.status !== "published") {
    const err = new Error("Event not open");
    err.status = 400;
    throw err;
  }

  const ticketId = String(uid);
  const ticketRef = eventRef.collection("tickets").doc(ticketId);

  await db.runTransaction(async (tx) => {
    const existing = await tx.get(ticketRef);
    if (existing.exists) return;
    tx.set(ticketRef, {
      uid: String(uid),
      eventId: String(eventId),
      issuedAt: now,
      status: "active",
      checkedInAt: null,
      checkedInBy: null,
      qrTokenVersion: 1
    });
  });

  return { eventId: String(eventId), ticketId };
}

async function adminScanCore({ db, eventId, ticketId, scannedBy, now = admin.firestore.FieldValue.serverTimestamp() }) {
  const ticketRef = db
    .collection("events")
    .doc(String(eventId))
    .collection("tickets")
    .doc(String(ticketId));

  const checkinsRef = db
    .collection("events")
    .doc(String(eventId))
    .collection("checkins")
    .doc();

  return db.runTransaction(async (tx) => {
    const tDoc = await tx.get(ticketRef);
    if (!tDoc.exists) {
      tx.set(checkinsRef, {
        ticketId: String(ticketId),
        uid: null,
        scannedAt: now,
        scannedBy: String(scannedBy),
        result: "invalid"
      });
      return { ok: false, status: "invalid" };
    }

    const t = tDoc.data();
    if (t?.status !== "active") {
      tx.set(checkinsRef, {
        ticketId: tDoc.id,
        uid: t?.uid || null,
        scannedAt: now,
        scannedBy: String(scannedBy),
        result: "inactive"
      });
      return { ok: false, status: "inactive" };
    }

    if (t?.checkedInAt) {
      tx.set(checkinsRef, {
        ticketId: tDoc.id,
        uid: t?.uid || null,
        scannedAt: now,
        scannedBy: String(scannedBy),
        result: "duplicate"
      });
      return {
        ok: false,
        status: "duplicate",
        checkedInAt: t.checkedInAt,
        checkedInBy: t.checkedInBy
      };
    }

    tx.update(ticketRef, {
      checkedInAt: now,
      checkedInBy: String(scannedBy)
    });
    tx.set(checkinsRef, {
      ticketId: tDoc.id,
      uid: t?.uid || null,
      scannedAt: now,
      scannedBy: String(scannedBy),
      result: "success"
    });

    return { ok: true, status: "success", uid: t?.uid || null };
  });
}

module.exports = { registerForEventCore, adminScanCore };

