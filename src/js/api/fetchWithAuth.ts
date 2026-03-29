import { API_KEY, BASE_URL } from "./constants";
import { getAccessToken } from "../utils/storage";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No access token found.");
  }

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${token}`);

  if (API_KEY) {
    headers.set("X-Noroff-API-Key", API_KEY);
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
