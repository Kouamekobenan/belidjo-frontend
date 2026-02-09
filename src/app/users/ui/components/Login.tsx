"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  ArrowRight,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestDeviceToken } from "@/app/lib/firebase";
import { api } from "@/app/lib/api";

interface LoginDto {
  phone: string;
  password: string;
}

export default function LoginUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginDto>({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    general: "",
  });

  const router = useRouter();
  const { login } = useAuth();

  const validateForm = (): boolean => {
    const newErrors = { phone: "", password: "", general: "" };
    let isValid = true;

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
      isValid = false;
    } else if (formData.phone.length < 8) {
      newErrors.phone = "Numéro de téléphone invalide";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors({ phone: "", password: "", general: "" });
    try {
      const loggedUser = await login(formData.phone, formData.password);
      try {
        const token = await requestDeviceToken();
        if (token) {
          const response = await api.patch(
            "/users/device-token",
            { deviceToken: token },
            {
              headers: {
                Authorization: `Bearer ${loggedUser.accessToken}`,
              },
            },
          );
          console.log(
            "✅ Device token envoyé au backend avec succès!",
            response.data,
          );
        } else {
          console.warn("⚠️ Aucun device token obtenu");
        }
      } catch (err: any) {
        console.error("❌ Erreur lors de l'envoi du device token:", err);
        console.error(
          "Détails de l'erreur:",
          err.response?.data || err.message,
        );
        // Ne pas bloquer la connexion si l'envoi du token échoue
      }
      // 3️⃣ Afficher le toast et rediriger selon le rôle
      switch (loggedUser.user.role) {
        case "VENDEUR":
          toast.success("Vous êtes connecté avec succès en tant que vendeur !");
          router.push("/admin/ui");
          break;
        case "CUSTOMER":
          toast.success("Vous êtes connecté avec succès !");
          router.push("/vendor");
          break;
        case "ADMIN":
          toast.success(
            "Vous êtes connecté avec succès en tant qu'administrateur !",
          );
          router.push("/super-admin");
          break;
        default:
          toast.success("Connexion réussie !");
          router.push("/vendor");
      }
    } catch (err: any) {
      console.error("❌ Erreur de connexion:", err);
      setErrors((prev) => ({
        ...prev,
        general: "Identifiants incorrects. Veuillez réessayer.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center pb-6">
          <Link
            href="/vendor"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-50 hover:bg-teal-100 text-black font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Accueil</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-3">
              <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Connexion sécurisée
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Error général */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          <div className="space-y-5">
            {/* Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.phone
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  } dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Votre numéro de téléphone"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  } dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
          {/* Sign Up Link */}
          <div className="flex flex-col pt-4 items-center space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-px w-8 bg-gray-200 dark:bg-gray-700"></span>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nouveau sur Noboutik ?
              </p>
              <span className="h-px w-8 bg-gray-200 dark:bg-gray-700"></span>
            </div>
            <Link href="/users/ui/register" className="w-full">
              <button
                type="button"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 font-bold rounded-xl hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Créer mon compte gratuitement</span>
                {/* Petit effet de brillance au survol (optionnel) */}
                <div className="absolute inset-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              </button>
            </Link>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Rejoignez notre communauté de vendeurs en quelques secondes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © 2026 Noboutik Connect. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
