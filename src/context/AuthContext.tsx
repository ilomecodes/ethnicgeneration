"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  initials: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user — any credentials work; will be replaced by Supabase Auth
const MOCK_USER: AuthUser = {
  id: "u-001",
  name: "Amina Koné",
  email: "amina.kone@email.com",
  memberSince: "Janvier 2025",
  initials: "AK",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string) => {
    if (!email.trim()) return { ok: false, error: "Adresse e-mail requise." };
    // Mock: accept any credentials, derive initials from email local-part
    const name = MOCK_USER.email === email.trim().toLowerCase()
      ? MOCK_USER.name
      : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setUser({ ...MOCK_USER, name, email: email.trim().toLowerCase() });
    return { ok: true };
  };

  const signup = async (name: string, email: string, _password: string) => {
    if (!name.trim() || !email.trim()) return { ok: false, error: "Tous les champs sont requis." };
    const initials = name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    setUser({
      id: "u-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      memberSince: "Juin 2026",
      initials,
    });
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
