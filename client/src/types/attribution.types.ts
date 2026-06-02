import type { DeviceType } from "./device.types";

export type CessionType = "donation" | "cession";

export interface Attribution {
  id: number;
  cession_type: CessionType;
  price: string;
  attributed_at: string;
  notes: string | null;
  brand: string;
  model: string;
  device_type: DeviceType;
  beneficiary_name: string;
  beneficiary_firstname: string | null;
  structure_type: string;
  attributed_by_firstname: string;
  attributed_by_lastname: string;
}
