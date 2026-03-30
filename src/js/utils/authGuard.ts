import { getAccessToken } from "./storage";

export function requireAuth(): void {
  const token = getAccessToken();

  // redirect visitor to login if no token exists
  if (!token) {
    window.location.href = "/login.html";
  }
}
