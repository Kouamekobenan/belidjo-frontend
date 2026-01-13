"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { User } from "../lib/globals.type";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    phone: string,
    password: string
  ) => Promise<{ user: User; accessToken: string; refreshToken: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const isRefreshing = useRef(false);

  // Helper pour sauvegarder les tokens proprement
  const saveTokens = (
    accessToken: string,
    refreshToken: string,
    userId?: string
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      if (userId) localStorage.setItem("user_id", userId);
    }
  };

  const login = async (
    phone: string,
    password: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    try {
      const res = await api.post(`/auth/login`, { phone, password });

      console.log("📦 Réponse complète du backend:", res.data);

      // ✅ CORRECTION : Les tokens sont dans res.data.token
      const userData = res.data.user;
      const accessToken = res.data.token?.accessToken;
      const refreshToken = res.data.token?.refreshToken;

      console.log("👤 User extrait:", userData);
      console.log("🔑 Access Token extrait:", accessToken);
      console.log("🔑 Refresh Token extrait:", refreshToken);

      // ⚠️ Vérification de sécurité
      if (!accessToken || !refreshToken || !userData) {
        console.error("❌ Tokens ou user manquants dans la réponse!");
        throw new Error("Réponse de connexion invalide du serveur");
      }

      // 🔹 Sauvegarde locale
      saveTokens(accessToken, refreshToken, userData.id);

      // 🔹 Mets à jour le contexte global
      setUser(userData);
      setIsAuthenticated(true);

      // 🔹 Retourne tout ce qu'il faut au frontend
      return {
        user: userData,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error: any) {
      console.error("❌ Erreur lors du login:", error);
      console.error("❌ Réponse d'erreur:", error.response?.data);
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/auth/me`);
      if (isMounted.current) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      if (error.response?.status === 401 && !isRefreshing.current) {
        isRefreshing.current = true;

        const storedRefreshToken = localStorage.getItem("refresh_token");
        const userId = localStorage.getItem("user_id");
        if (storedRefreshToken && userId) {
          try {
            const refreshRes = await api.post(`/auth/refresh/${userId}`, {
              refreshToken: storedRefreshToken,
            });

            // Adapter selon la structure de votre réponse refresh
            const newAccessToken =
              refreshRes.data.token?.accessToken ||
              refreshRes.data.accessToken ||
              refreshRes.data.access_token;
            const newRefreshToken =
              refreshRes.data.token?.refreshToken ||
              refreshRes.data.refreshToken ||
              refreshRes.data.refresh_token;

            console.log("✅ Tokens rafraîchis avec succès.");

            if (newAccessToken && newRefreshToken) {
              saveTokens(newAccessToken, newRefreshToken);
              const retryRes = await api.get(`/auth/me`);
              if (isMounted.current) {
                setUser(retryRes.data);
                setIsAuthenticated(true);
                isRefreshing.current = false;
                return;
              }
            }
          } catch (refreshError) {
            console.error("❌ Refresh échoué : session expirée.");
          }
        }
        isRefreshing.current = false;
      }

      if (isMounted.current) logout();
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    refreshUser();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Chargement de votre session...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
