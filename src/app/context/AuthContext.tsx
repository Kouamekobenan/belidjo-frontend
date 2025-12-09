"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../lib/globals.type";
import axios from "axios";
// ✅ Interface du contexte
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// ✅ Création du contexte
const AuthContext = createContext<AuthContextType | null>(null);
// ✅ Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // 🟢 LOGIN
  // ------------------------------------
  const login = async (phone: string, password: string): Promise<User> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          phone,
          password,
        }
      );

      const { access_token, refresh_token, user } = res.data;

      // Stocker les tokens dans localStorage (ou sessionStorage)
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setUser(user);
      setIsAuthenticated(true);

      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  };

  // ------------------------------------
  // 🔴 LOGOUT
  // ------------------------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // ------------------------------------
  // ♻️ REFRESH USER
  // ------------------------------------
  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.warn("Erreur lors du rafraîchissement de l'utilisateur :", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // 🚀 Chargement initial de l'utilisateur
  // ------------------------------------
  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook personnalisé pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
