import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, tokenStore } from "../services/api";
import type { User, UserRole } from "../types/domain";

interface AuthContextValue {
  user: User | null;
  isBooting: boolean;
  login(email: string, password: string): Promise<void>;
  register(input: { name: string; email: string; password: string; role: UserRole }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!tokenStore.get()) {
        setIsBooting(false);
        return;
      }

      try {
        const response = await api.me();
        setUser(response.user);
      } catch {
        tokenStore.clear();
      } finally {
        setIsBooting(false);
      }
    };

    void loadUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isBooting,
      login: async (email, password) => {
        const response = await api.login({ email, password });
        tokenStore.set(response.token);
        setUser(response.user);
      },
      register: async (input) => {
        const response = await api.register(input);
        tokenStore.set(response.token);
        setUser(response.user);
      },
      logout: () => {
        tokenStore.clear();
        setUser(null);
      }
    }),
    [isBooting, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
