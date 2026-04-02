// src/services/api.js
const API = import.meta.env.VITE_API_URL || ""; // Pakai relative path karena Vite Proxy aktif

async function request(endpoint, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  login: (credentials) =>
    request("/api/auth/login", { method: "POST", body: credentials }),
  register: (userData) =>
    request("/api/auth/register", { method: "POST", body: userData }),
  getProfile: () => request("/api/auth/profile", { method: "GET" }),
  logout: () => {
    localStorage.removeItem("token");
  },
};
