"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterForm() {
  //  Ajout du router pour la redirection
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: UserRole.CUSTOMER,
    cityId: "",
  });
  const [city, setCity] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterDto, string>>
  >({});

  // Instanciation du Repository et UseCase
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

  // Validation en temps réel
  const validateField = (name: keyof RegisterDto, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "Le nom doit contenir au moins 3 caractères";
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

  // Gestion des changements de champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name as keyof RegisterDto, value);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        cityId: formData.cityId,
      };

      const response = await createUserUseCase.execute(dto);

      // Stockage des tokens si présents
      if (response.token) {
        localStorage.setItem("access_token", response.token.accessToken);
        localStorage.setItem("refresh_token", response.token.refreshToken);
      }

      //  Toast de bienvenue puis redirection vers /profile
      toast.success(`Bienvenue ${formData.name} ! Votre compte est créé.`);
      router.push("/profile");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Classes de style
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
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 transition-all duration-300 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-block mb-3">
              <div className="flex justify-center items-center pb-6">
                <Link
                  href="/vendor"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-100 hover:to-cyan-700 text-black font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Accueil</span>
                </Link>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
              Inscription
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Créez votre compte client en quelques secondes
            </p>
          </div>

          {/* Formulaire */}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Adresse email (optionnelle, mais recommandée pour la
                récupération de compte)
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass("email")} pl-10 w-full`}
                />
              </div>
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

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || loadingCities}
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

          {/* Lien de connexion */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/users/ui/login"
                className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4 max-w-sm mx-auto">
          En créant un compte, vous acceptez nos{" "}
          <a
            href="#"
            className="text-teal-600 hover:underline transition-colors"
          >
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
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
