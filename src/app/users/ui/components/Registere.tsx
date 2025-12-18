"use client";
import { useEffect, useState } from "react";
import { CreateUserUseCase } from "@/app/users/application/usecases/create-user.usecase";
import { UserMapper } from "@/app/users/domain/mappers/user.mapper";
import { UserRepository } from "@/app/users/infrastructure/user-repository.impl";
import { RegisterDto } from "@/app/users/application/dtos/registere.dto";
import { UserRole } from "@/app/users/domain/enums/role.enum";
import { ICity } from "@/app/city/domain/interface/city";
import { api } from "@/app/lib/api";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: UserRole.CUSTOMER,
    cityId: "",
  });
  // J'ai mis le LOGO_SRC ici pour la clarté, mais il peut rester en dehors.
  const LOGO_SRC = "/images/bj.png";

  const [city, setCity] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterDto, string>>
  >({});

  // Instanciation du Repository et UseCase (Gardé pour la fonctionnalité)
  const userRepo = new UserRepository(new UserMapper());
  const createUserUseCase = new CreateUserUseCase(userRepo);

  // Récupération des villes
  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoadingCities(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await api.get("/city");
        setCity(res.data.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
        toast.error("Impossible de charger les villes.");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCity();
  }, []);

  // Validation en temps réel (inchangée)
  const validateField = (name: keyof RegisterDto, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "Le nom doit contenir au moins 3 caractères";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Email invalide";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Le mot de passe doit contenir au moins 6 caractères";
        }
        break;
      case "phone":
        const phoneRegex = /^[0-9]{8,15}$/;
        if (value && !phoneRegex.test(value.replace(/\s/g, ""))) {
          error = "Numéro de téléphone invalide (8 à 15 chiffres)";
        }
        break;
      case "cityId":
        if (!value) {
          error = "Veuillez sélectionner une ville";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  // Gestion des changements de champs (inchangée)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message) {
      setMessage("");
      setMessageType("");
    }
    validateField(name as keyof RegisterDto, value);
  };

  // Soumission du formulaire (inchangée)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    const isNameValid = validateField("name", formData.name);
    const isEmailValid = validateField("email", formData.email);
    const isPasswordValid = validateField("password", formData.password);
    const isPhoneValid = validateField("phone", formData.phone || "");
    const isCityValid = validateField("cityId", formData.cityId || "");

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isPhoneValid ||
      !isCityValid
    ) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      setLoading(false);
      return;
    }

    try {
      const dto: RegisterDto = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone?.trim() ?? "",
        role: formData.role,
        // refreshToken: formData.refreshToken,
        cityId: formData.cityId,
      };
      const response = await createUserUseCase.execute(dto);
      if (response.token) {
        localStorage.setItem("accessToken", response.token.accessToken);
        localStorage.setItem("refreshToken", response.token.refreshToken);
      }

      // ✅ Utiliser formData au lieu de user
      toast.success(`Bienvenue ${formData.name} ! Votre compte est créé.`);
      setMessageType("success");

      setTimeout(() => {
        setMessage(
          `Bienvenue ${formData.name} ! Votre compte a été créé avec succès.`
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: UserRole.CUSTOMER,
          cityId: "",
        });
      }, 500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription";
      toast.error(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  // Classes de style (inchangées)
  const inputClass = (name: keyof RegisterDto) => `
    w-full pl-11 pr-4 text-gray-800 py-3 border rounded-xl 
    focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
    transition-all duration-300 ease-in-out
    ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 hover:border-teal-400"
    }
  `;

  const selectClass = (name: keyof RegisterDto) => `
    w-full pl-11 text-gray-800 pr-10 py-3 border rounded-xl 
    focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
    transition-all duration-300 ease-in-out appearance-none bg-white
    ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 hover:border-teal-400"
    }
    ${loadingCities ? "opacity-60 cursor-not-allowed" : ""}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-100 to-purple-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Modification : Rendre le max-w plus petit sur mobile (sm:max-w-md -> max-w-xs ou sm:max-w-sm) */}
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Conteneur principal (suppression du hover:scale pour le tactile) */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 transition-all duration-300 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-4">
            {/* LOGO AMÉLIORÉ et OPTIMISÉ pour le responsive */}
            <div className="inline-block mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 bg-white rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:rotate-2">
                <Image
                  src={LOGO_SRC}
                  width={80} // Taille maximale pour le conteneur w-20
                  height={80}
                  alt="Logo Belidjo - Retour à l'accueil"
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
              Inscription
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Créez votre compte client en quelques secondes
            </p>
          </div>
          {/* Formulaire : Réduction de l'espace vertical (space-y-3 au lieu de space-y-6) */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nom complet */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <User className="absolute left-3 top-[37px] w-5 h-5 text-gray-400 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={inputClass("name")}
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <Mail className="absolute left-3 top-[37px] w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClass("email")}
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <Phone className="absolute left-3 top-[37px] w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="+225 07 XX XX XX XX"
                value={formData.phone ?? ""}
                onChange={handleChange}
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>
            {/* Mot de passe */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <Lock className="absolute left-3 top-[37px] w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={inputClass("password") + " pr-12"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[37px] p-1 text-gray-500 hover:text-teal-600 transition-colors"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Ville */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <MapPin className="absolute left-3 top-[37px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <select
                name="cityId"
                value={formData.cityId ?? ""}
                onChange={handleChange}
                disabled={loadingCities || loading}
                className={selectClass("cityId")}
                required
              >
                <option value="" disabled>
                  {loadingCities
                    ? "Chargement des villes..."
                    : "Sélectionnez une ville"}
                </option>
                {city.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-[37px] w-5 h-5 text-gray-400 pointer-events-none" />
              {errors.cityId && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cityId}
                </p>
              )}
            </div>
            {/* Bouton de soumission (Simplification du dégradé pour la clarté) */}
            <button
              type="submit"
              disabled={loading || loadingCities}
              // Suppression du dégradé complexe, utilisation du teal-600 avec hover
              className="w-full bg-teal-600 cursor-pointer text-white py-3 rounded-xl font-semibold text-base sm:text-lg
                hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-300 
                shadow-lg shadow-teal-300/50 hover:shadow-xl hover:shadow-teal-400/60
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>
          {/* Message de retour */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-xl flex items-start gap-3 transition-all duration-500 animate-in fade-in slide-in-from-top-1 ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-400"
                  : "bg-red-50 text-red-800 border-l-4 border-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Lien de connexion */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/users/ui/login"
                // Couleur ajustée pour l'harmonie avec le Teal
                className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
        {/* Footer - Mentions Légales */}
        <p className="text-center text-xs text-gray-500 mt-4 max-w-sm mx-auto">
          En créant un compte, vous acceptez nos
          <a
            href="#"
            className="text-teal-600 hover:underline transition-colors"
          >
            Conditions d'utilisation
          </a>
          et notre
          <a
            href="#"
            className="text-teal-600 hover:underline transition-colors"
          >
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}
