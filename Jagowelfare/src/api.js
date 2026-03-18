import { supabase } from "./supabase";

function getApiBaseUrl() {
  const explicit = process.env.REACT_APP_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Default: Fallback or current origin
  return window.location.origin + "/api";
}

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = await getAccessToken();
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
