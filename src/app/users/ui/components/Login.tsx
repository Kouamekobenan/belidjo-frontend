"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Phone, Lock, ArrowRight, UserPlus } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cityName } from "@/app/lib/globals.type";

// Simuler les types et hooks (à remplacer par vos imports réels)
interface LoginDto {
  phone: string;
  password: string;
}

// Hook simulé - remplacez par votre vrai hook

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
  const LOGO_SRC = "/images/bj.png";
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
  // const router=useRouter()
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors({ phone: "", password: "", general: "" });
    try {
      const loggedUser = await login(formData.phone, formData.password);
      switch (loggedUser.role) {
        case "VENDEUR":
          toast.success("Vous êtes connectez avec succès! en tant que admin");
          router.push("/admin/ui");
          break;
        case "CUSTOMER":
          toast.success("Vous êtes connectez avec succès!");
          router.push("/");
          break;
        case "ADMIN":
          toast.success("Vous êtes connectez avec succès!");
          router.push("/super-admin");
          break;
        default:
          router.push("/vendor");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
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
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-block mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 bg-white rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:rotate-2">
              <Image
                src={LOGO_SRC}
                width={80}
                height={80}
                alt="Logo Belidjo - Retour à l'accueil"
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Bienvenue sur
          </h1>
          <h2 className="text-2xl font-serif md:text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
            {cityName}
          </h2>
        </div>
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Connectez-vous
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Accédez à votre compte
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
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Vous n'avez pas de compte ?
              </p>
              <Link href="/users/ui/register">
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="inline-flex cursor-pointer items-center space-x-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
                  disabled={isLoading}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Créer un compte</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © 2024 Belidjo Connect. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
