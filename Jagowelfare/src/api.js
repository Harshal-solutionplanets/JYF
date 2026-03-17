import { auth } from "./firebase";

function getApiBaseUrl() {
  const explicit = process.env.REACT_APP_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Default: Firebase Functions emulator URL for local dev.
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-jyf";
  const region = process.env.REACT_APP_FUNCTIONS_REGION || "us-central1";
  return `http://127.0.0.1:5001/${projectId}/${region}/api`;
}

async function getIdToken() {
  const u = auth.currentUser;
  if (!u) return null;
  return u.getIdToken();
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = await getIdToken();
  const headers = { "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

