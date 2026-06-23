import type { AuthUser, Device } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3310";

const getToken = () => localStorage.getItem("token");

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

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth
export const login = (
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Devices
export const getDevices = () => apiFetch("/api/devices");
export const getDevice = (id: number) => apiFetch(`/api/devices/${id}`);
export const getMyDevices = () => apiFetch("/api/devices/my");

export const createDevice = (
  device: Omit<
    Device,
    "id" | "created_at" | "added_by_user_id" | "assigned_to_user_id"
  >,
) =>
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

export const updateDeviceNotes = (id: number, notes: string) =>
  apiFetch(`/api/devices/${id}/notes`, {
    method: "PUT",
    body: JSON.stringify({ notes }),
  });

export const deleteDevice = (id: number) =>
  apiFetch(`/api/devices/${id}`, { method: "DELETE" });

// Users
export const getUsers = () => apiFetch("/api/users");

export const createUser = (user: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) =>
  apiFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const updateUserStatus = (id: number, is_active: boolean) =>
  apiFetch(`/api/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ is_active }),
  });

export const resetUserPassword = (id: number, newPassword: string) =>
  apiFetch(`/api/users/${id}/password`, {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  });

// Beneficiaries
export const getBeneficiaries = () => apiFetch("/api/beneficiaries");

export const createBeneficiary = (beneficiary: {
  name: string;
  firstname: string | null;
  structure_type: string;
  contact: string | null;
  address: string | null;
}) =>
  apiFetch("/api/beneficiaries", {
    method: "POST",
    body: JSON.stringify(beneficiary),
  });

// Attributions
export const getAttributions = () => apiFetch("/api/attributions");

export const createAttribution = (attribution: {
  device_id: number;
  beneficiary_id: number;
  cession_type: "donation" | "cession";
  price?: number;
  notes?: string | null;
}) =>
  apiFetch("/api/attributions", {
    method: "POST",
    body: JSON.stringify(attribution),
  });

export const getMyActions = () => apiFetch("/api/devices/my-actions");
