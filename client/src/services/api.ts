const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3310";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Generic fetch function with auth header
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  // Return null for 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth
export const login = (email: string, password: string) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Devices
export const getDevices = () => apiFetch("/api/devices");
export const getDevice = (id: number) => apiFetch(`/api/devices/${id}`);
export const createDevice = (device: object) =>
  apiFetch("/api/devices", {
    method: "POST",
    body: JSON.stringify(device),
  });
export const updateDeviceStatus = (
  id: number,
  status: string,
  assigned_to_user_id: number | null,
) =>
  apiFetch(`/api/devices/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, assigned_to_user_id }),
  });
export const deleteDevice = (id: number) =>
  apiFetch(`/api/devices/${id}`, { method: "DELETE" });

export const getMyDevices = () => apiFetch("/api/devices/my");

export const updateDeviceNotes = (id: number, notes: string) =>
  apiFetch(`/api/devices/${id}/notes`, {
    method: "PUT",
    body: JSON.stringify({ notes }),
  });

// Users
export const getUsers = () => apiFetch("/api/users");
export const getUser = (id: number) => apiFetch(`/api/users/${id}`);
export const createUser = (user: object) =>
  apiFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
export const updateUserStatus = (id: number, is_active: boolean) =>
  apiFetch(`/api/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ is_active }),
  });

// Beneficiaries
export const getBeneficiaries = () => apiFetch("/api/beneficiaries");
export const getBeneficiary = (id: number) =>
  apiFetch(`/api/beneficiaries/${id}`);
export const createBeneficiary = (beneficiary: object) =>
  apiFetch("/api/beneficiaries", {
    method: "POST",
    body: JSON.stringify(beneficiary),
  });

// Attributions
export const getAttributions = () => apiFetch("/api/attributions");
export const getAttribution = (id: number) =>
  apiFetch(`/api/attributions/${id}`);
export const createAttribution = (attribution: object) =>
  apiFetch("/api/attributions", {
    method: "POST",
    body: JSON.stringify(attribution),
  });
