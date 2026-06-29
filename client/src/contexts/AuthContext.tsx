import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/api";
import type { AuthContextType, AuthUser } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      sessionStorage.removeItem("user");
      return null;
    }
  });

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    // Token is stored in httpOnly cookie by the server — not accessible here
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    await apiLogout();
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
