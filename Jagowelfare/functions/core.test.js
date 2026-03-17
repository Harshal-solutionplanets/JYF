const test = require("node:test");
const assert = require("node:assert/strict");

const { registerForEventCore, adminScanCore } = require("./core");

function createFakeDb() {
  const store = new Map(); // key -> data

  function key(path) {
    return path.join("/");
  }

  function makeDocRef(path) {
    return {
      id: path[path.length - 1],
      _path: path,
      async get() {
        return getDoc(this);
      },
      async set(data) {
        setDoc(this, data);
      },
      collection(name) {
        return makeColRef([...path, name]);
      }
    };
  }

  function makeColRef(path) {
    return {
      doc(id) {
        return makeDocRef([...path, id || `auto_${Math.random().toString(36).slice(2)}`]);
      }
    };
  }

  async function getDoc(docRef) {
    const k = key(docRef._path);
    const data = store.get(k);
    return {
      exists: data != null,
      id: docRef.id,
      data: () => data
    };
  }

  function setDoc(docRef, data) {
    store.set(key(docRef._path), { ...data });
  }

  function updateDoc(docRef, patch) {
    const k = key(docRef._path);
    const prev = store.get(k);
    if (!prev) throw new Error("Document does not exist");
    store.set(k, { ...prev, ...patch });
  }

  return {
    collection(name) {
      return makeColRef([name]);
    },
    async runTransaction(fn) {
      const tx = {
        get: (ref) => getDoc(ref),
        set: (ref, data) => setDoc(ref, data),
        update: (ref, patch) => updateDoc(ref, patch)
      };
      return fn(tx);
    },
    _debugGet(pathArr) {
      return store.get(key(pathArr));
    },
    _debugSet(pathArr, data) {
      store.set(key(pathArr), data);
    }
  };
}

test("register then scan prevents duplicate check-in", async () => {
  const db = createFakeDb();
  const eventId = "event_test_1";
  const uid = "user_1";
  const now = new Date("2026-01-01T10:00:00Z");

  db._debugSet(["events", eventId], { title: "Test Event", status: "published" });

  const { ticketId } = await registerForEventCore({ db, uid, eventId, now });
  assert.equal(ticketId, uid);

  const ticketDoc = db._debugGet(["events", eventId, "tickets", ticketId]);
  assert.equal(ticketDoc.status, "active");
  assert.equal(ticketDoc.checkedInAt, null);

  const first = await adminScanCore({ db, eventId, ticketId, scannedBy: "staff_1", now });
  assert.equal(first.ok, true);
  assert.equal(first.status, "success");

  const afterFirst = db._debugGet(["events", eventId, "tickets", ticketId]);
  assert.equal(afterFirst.checkedInBy, "staff_1");
  assert.equal(afterFirst.checkedInAt instanceof Date, true);

  const second = await adminScanCore({ db, eventId, ticketId, scannedBy: "staff_2", now });
  assert.equal(second.ok, false);
  assert.equal(second.status, "duplicate");
});

