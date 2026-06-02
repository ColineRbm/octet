export type UserRole = "admin" | "benevole";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: string;
}

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
}
