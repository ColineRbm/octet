export type StructureType = "family" | "school" | "association" | "other";

export interface Beneficiary {
  id: number;
  name: string;
  firstname: string | null;
  structure_type: StructureType;
  contact: string | null;
  address: string | null;
  created_at: string;
}
