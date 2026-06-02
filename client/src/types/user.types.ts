export type UserRole = "admin" | "benevole";

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
