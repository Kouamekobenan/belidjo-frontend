import axios from "axios";
import { id } from "zod/locales";

export const api = axios.create({
  // baseURL: "http://127.0.0.1:3000",
  baseURL: "https://belidjo-production.up.railway.app",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ INTERCEPTEUR REQUEST : Ajoute automatiquement le token à chaque requête
api.interceptors.request.use(
  (config) => {
    // Protection SSR (Next.js)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTEUR RESPONSE : Gère automatiquement le refresh du token
api.interceptors.response.use(
  (response) => response, // Si tout va bien, on retourne la réponse
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marque pour éviter les boucles infinies

      try {
        // Protection SSR
        if (typeof window === "undefined") {
          return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          // Pas de refresh token, déconnexion
          localStorage.clear();
          window.location.href = "users/ui/login";
          return Promise.reject(error);
        }

        // ✅ Tentative de refresh du token
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh/${id}`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Sauvegarde des nouveaux tokens
        localStorage.setItem("access_token", access_token);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // ✅ Relance la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnexion
        console.error("Refresh token invalide:", refreshError);
        localStorage.clear();
        window.location.href = "/users/ui/login";
        return Promise.reject(refreshError);
      }
    }

    // Pour toutes les autres erreurs
    return Promise.reject(error);
  }
);
