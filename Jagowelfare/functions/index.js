const express = require("express");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { signQrPayload, verifyQrPayload } = require("./qr");
const { registerForEventCore, adminScanCore } = require("./core");

admin.initializeApp();

function requireAuth(req) {
  const authHeader = req.get("authorization") || "";
  const match = authHeader.match(/^Bearer (.+)$/i);
  if (!match) return null;
  return match[1];
}

async function verifyFirebaseIdToken(req) {
  const token = requireAuth(req);
  if (!token) return null;
  return admin.auth().verifyIdToken(token);
}

function assertRole(decodedToken, allowedRoles) {
  const isAdmin = !!decodedToken?.admin;
  const isStaff = !!decodedToken?.staff;
  const roles = {
    admin: isAdmin,
    staff: isStaff || isAdmin
  };

  for (const role of allowedRoles) {
    if (roles[role]) return;
  }
  const err = new Error("Forbidden");
  err.status = 403;
  throw err;
}

function getQrSecret() {
  const secret = process.env.JYF_QR_HMAC_SECRET;
  if (!secret) {
    const err = new Error(
      "Missing JYF_QR_HMAC_SECRET env var for QR signing."
    );
    err.status = 500;
    throw err;
  }
  return secret;
}

function signPayload({ eventId, ticketId }) {
  return signQrPayload({ secret: getQrSecret(), eventId, ticketId, v: 1 });
}

function verifyPayload(qrPayload) {
  return verifyQrPayload({ secret: getQrSecret(), qrPayload });
}

function sendJson(res, status, body) {
  res.status(status).set("content-type", "application/json").send(body);
}

function normalizeError(err) {
  const status = err?.status || 500;
  const message =
    status === 500 ? "Internal Server Error" : err?.message || "Error";
  return { status, message };
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/events", async (req, res) => {
  try {
    const snap = await admin
      .firestore()
      .collection("events")
      .where("status", "==", "published")
      .orderBy("startAt", "asc")
      .get();
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return sendJson(res, 200, { events });
  } catch (err) {
    logger.error(err);
    const { status, message } = normalizeError(err);
    return sendJson(res, status, { error: message });
  }
});

app.get("/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) return sendJson(res, 400, { error: "Missing eventId" });
    const ref = admin.firestore().collection("events").doc(String(eventId));
    const doc = await ref.get();
    if (!doc.exists) return sendJson(res, 404, { error: "Event not found" });
    const data = doc.data();
    if (data?.status !== "published") return sendJson(res, 404, { error: "Event not found" });
    return sendJson(res, 200, { event: { id: doc.id, ...data } });
  } catch (err) {
    logger.error(err);
    const { status, message } = normalizeError(err);
    return sendJson(res, status, { error: message });
  }
});

app.post("/events/:eventId/register", async (req, res) => {
  try {
    const decoded = await verifyFirebaseIdToken(req);
    if (!decoded) return sendJson(res, 401, { error: "Unauthorized" });

    const eventId = req.params.eventId;
    if (!eventId) return sendJson(res, 400, { error: "Missing eventId" });

    const db = admin.firestore();
    const { ticketId } = await registerForEventCore({
      db,
      uid: decoded.uid,
      eventId: String(eventId),
      now: admin.firestore.FieldValue.serverTimestamp()
    });

    const qrPayload = signPayload({ eventId: String(eventId), ticketId });
    return sendJson(res, 200, {
      ticket: { ticketId, eventId: String(eventId) },
      qrPayload
    });
  } catch (err) {
    logger.error(err);
    const { status, message } = normalizeError(err);
    return sendJson(res, status, { error: message });
  }
});

app.get("/my/tickets", async (req, res) => {
  try {
    const decoded = await verifyFirebaseIdToken(req);
    if (!decoded) return sendJson(res, 401, { error: "Unauthorized" });

    const db = admin.firestore();
    const eventsSnap = await db.collection("events").where("status", "==", "published").get();
    const tickets = [];

    // For speed-to-ship, we scan tickets under published events for this uid.
    // If this becomes slow, move tickets to a top-level collection with composite indexes.
    await Promise.all(
      eventsSnap.docs.map(async (eventDoc) => {
        const t = await eventDoc.ref.collection("tickets").doc(decoded.uid).get();
        if (t.exists) {
          const ticketId = t.id;
          tickets.push({
            eventId: eventDoc.id,
            event: { id: eventDoc.id, ...eventDoc.data() },
            ticket: { id: ticketId, ...t.data() },
            qrPayload: signPayload({ eventId: eventDoc.id, ticketId })
          });
        }
      })
    );

    return sendJson(res, 200, { tickets });
  } catch (err) {
    logger.error(err);
    const { status, message } = normalizeError(err);
    return sendJson(res, status, { error: message });
  }
});

app.post("/admin/scan", async (req, res) => {
  try {
    const decoded = await verifyFirebaseIdToken(req);
    if (!decoded) return sendJson(res, 401, { error: "Unauthorized" });
    assertRole(decoded, ["staff", "admin"]);

    const { eventId, qrPayload } = req.body || {};
    if (!eventId || !qrPayload) return sendJson(res, 400, { error: "Missing eventId or qrPayload" });

    const parsed = verifyPayload(qrPayload);
    if (!parsed) return sendJson(res, 400, { error: "Invalid QR" });
    if (String(parsed.eventId) !== String(eventId)) return sendJson(res, 400, { error: "QR does not match event" });

    const db = admin.firestore();
    const result = await adminScanCore({
      db,
      eventId: String(eventId),
      ticketId: String(parsed.ticketId),
      scannedBy: decoded.uid,
      now: admin.firestore.FieldValue.serverTimestamp()
    });

    return sendJson(res, 200, result);
  } catch (err) {
    logger.error(err);
    const { status, message } = normalizeError(err);
    return sendJson(res, status, { error: message });
  }
});

app.post("/admin/setUserRole", async (req, res) => {
  try {
    const decoded = await verifyFirebaseIdToken(req);
    if (!decoded) return sendJson(res, 401, { error: "Unauthorized" });

    // Either an existing admin, or a one-time bootstrap secret for first admin.
    const bootstrapSecret = process.env.JYF_BOOTSTRAP_SECRET;
    const providedSecret = req.get("x-bootstrap-secret") || "";
    const isBootstrapping =
      bootstrapSecret && providedSecret && providedSecret === bootstrapSecret;

    if (!isBootstrapping) {
      assertRole(decoded, ["admin"]);
    }

    const { uid, admin: makeAdmin, staff: makeStaff } = req.body || {};
    if (!uid) return sendJson(res, 400, { error: "Missing uid" });

    const claims = {
      admin: !!makeAdmin,
      staff: !!makeStaff
    };
    if (claims.admin) claims.staff = true;

    await admin.auth().setCustomUserClaims(String(uid), claims);
    return sendJson(res, 200, { ok: true, uid: String(uid), claims });
  } catch (err) {
    logger.error(err);
    const { status, message } = normalizeError(err);
    return sendJson(res, status, { error: message });
  }
});

exports.api = onRequest({ cors: true }, app);

