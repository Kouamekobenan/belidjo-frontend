"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../lib/globals.type";
import { api } from "../lib/api"; // ✅ importer ton instance axios

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (phone: string, password: string): Promise<User> => {
    try {
      const res = await api.post(`/auth/login`, { phone, password });
      const { access_token, refresh_token, user } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/auth/me`); // ✅ utilise l’instance api
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.warn("Erreur lors du rafraîchissement de l'utilisateur :", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Attendre un petit délai avant refreshUser pour éviter le race condition
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshUser();
    }, 100); // léger délai
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
