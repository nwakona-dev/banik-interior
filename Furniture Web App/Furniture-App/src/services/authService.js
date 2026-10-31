import { apiRequest } from "./apiClient";

export function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

export function loginAdmin(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function setupAdmin(details) {
  return apiRequest("/api/auth/setup", {
    method: "POST",
    body: details,
  });
}

export function logoutAdmin() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}
