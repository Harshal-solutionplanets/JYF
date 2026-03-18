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


async function registerForEventMultipleCore({ db, uid, eventId, participants, now = admin.firestore.FieldValue.serverTimestamp() }) {
  const eventRef = db.collection("events").doc(String(eventId));
  const eventDoc = await eventRef.get();
  
  if (!eventDoc.exists) {
    const err = new Error("Event not found");
    err.status = 404;
    throw err;
  }
  
  const eventData = eventDoc.data();
  if (eventData?.status !== "published") {
    const err = new Error("Event not open");
    err.status = 400;
    throw err;
  }

  // Check for duplicate phone numbers across ALL tickets for this event
  const ticketsRef = eventRef.collection("tickets");
  
  // 1. Check for duplicates within the current participants list
  const participantPhones = participants.map(p => p.phoneNo);
  const uniquePhones = new Set(participantPhones);
  if (uniquePhones.size !== participantPhones.length) {
    const err = new Error("Duplicate phone numbers found in your registration list.");
    err.status = 400;
    throw err;
  }

  return await db.runTransaction(async (tx) => {
    // 2. Check against already registered numbers for this event
    for (const phone of participantPhones) {
      const snap = await ticketsRef.where("phoneNo", "==", phone).limit(1).get();
      if (!snap.empty) {
        throw new Error(`Phone number ${phone} is already registered for this event.`);
      }
    }

    // 3. Register each participant
    const results = [];
    for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        const ticketId = `${uid}_${Date.now()}_${i}`;
        const ticketRef = ticketsRef.doc(ticketId);
        
        tx.set(ticketRef, {
            uid: String(uid),
            name: p.name,
            email: p.email,
            phoneNo: p.phoneNo,
            kahaseHo: p.kahaseHo || "",
            location: p.location || "",
            eventId: String(eventId),
            issuedAt: now,
            status: "active",
            checkedInAt: null,
            checkedInBy: null,
            qrTokenVersion: 1
        });
        results.push({ ticketId });
    }
    
    return { eventId: String(eventId), results };
  });
}

module.exports = { registerForEventCore, registerForEventMultipleCore, adminScanCore };


