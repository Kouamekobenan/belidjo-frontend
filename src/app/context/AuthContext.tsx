// "use client";
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useRef,
// } from "react";
// import { User } from "../lib/globals.type";
// import { api } from "../lib/api";

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (phone: string, password: string) => Promise<User>;
//   logout: () => void;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const isMounted = useRef(true);

//   const login = async (phone: string, password: string): Promise<User> => {
//     try {
//       const res = await api.post(`/auth/login`, { phone, password });
//       const { access_token, refresh_token, user } = res.data;

//       // ✅ Vérification que le code s'exécute côté client
//       if (typeof window !== "undefined") {
//         localStorage.setItem("access_token", access_token);
//         localStorage.setItem("refresh_token", refresh_token);
//         localStorage.setItem("user_id", user.id);
//       }

//       setUser(user);
//       setIsAuthenticated(true);
//       return user;
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || "Erreur de connexion");
//     }
//   };

//   const logout = () => {
//     if (typeof window !== "undefined") {
//       localStorage.clear();
//     }
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const refreshUser = async () => {
//     // ✅ Protection SSR
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await api.get(`/auth/me`);

//       // ✅ Vérification que le composant est toujours monté
//       if (isMounted.current) {
//         setUser(res.data);
//         setIsAuthenticated(true);
//       }
//     } catch (error: any) {
//       console.warn("Session invalide:", error.message);

//       // ✅ Si 401, essayer de refresh le token
//       if (error.response?.status === 401) {
//         const refreshToken = localStorage.getItem("refresh_token");
//         if (refreshToken) {
//           try {
//             const res = await api.post(`/auth/refresh`, {
//               refresh_token: refreshToken,
//             });
//             localStorage.setItem("access_token", res.data.access_token);
//             // Retry refreshUser
//             await refreshUser();
//             return;
//           } catch (refreshError) {
//             console.error("Refresh token invalide");
//           }
//         }
//       }

//       if (isMounted.current) {
//         logout();
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     isMounted.current = true;
//     refreshUser();

//     // ✅ Cleanup pour éviter les memory leaks
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated, loading, login, logout, refreshUser }}
//     >
//       {!loading ? (
//         children
//       ) : (
//         <div className="flex h-screen items-center justify-center">
//           Chargement...
//         </div>
//       )}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context)
//     throw new Error("useAuth doit être utilisé dans un AuthProvider");
//   return context;
// };

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
  login: (phone: string, password: string) => Promise<User>;
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

  const login = async (phone: string, password: string): Promise<User> => {
    try {
      const res = await api.post(`/auth/login`, { phone, password });

      // On extrait selon ce que ton back renvoie au login
      // Si ton back renvoie accessToken/refreshToken (camelCase), adapte ici
      const { access_token, refresh_token, user } = res.data;

      saveTokens(access_token, refresh_token, user.id);

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
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
            // URL avec l'ID comme vu dans tes logs (PATCH/POST /auth/refresh/:id)
            const refreshRes = await api.post(`/auth/refresh/${userId}`, {
              refreshToken: storedRefreshToken, // Clé exacte attendue par @Body('refreshToken')
            });

            // On récupère les nouveaux tokens (ton back doit les renvoyer dans cet objet)
            const { access_token, refresh_token } = refreshRes.data;
            console.log(
              "Tokens rafraîchis avec succès.",
              access_token,
              refresh_token
            );

            if (access_token && refresh_token) {
              saveTokens(access_token, refresh_token);

              // On retente de récupérer le user avec le nouvel access_token
              const retryRes = await api.get(`/auth/me`);
              if (isMounted.current) {
                setUser(retryRes.data);
                setIsAuthenticated(true);
                isRefreshing.current = false;
                return;
              }
            }
          } catch (refreshError) {
            console.error("Refresh échoué : session expirée.");
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
