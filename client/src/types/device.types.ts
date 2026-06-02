export type DeviceStatus =
  | "to_sort"
  | "diagnosing"
  | "repairing"
  | "quality_check"
  | "ready"
  | "attributed"
  | "unusable";

export type DeviceType = "laptop" | "desktop" | "tablet";

export interface Device {
  id: number;
  type: DeviceType;
  brand: string;
  model: string | null;
  status: DeviceStatus;
  received_at: string;
  serial_number: string | null;
  donor: string | null;
  general_condition: string | null;
  accessories: string | null;
  notes: string | null;
  added_by_user_id: number;
  assigned_to_user_id: number | null;
  created_at: string;
}
