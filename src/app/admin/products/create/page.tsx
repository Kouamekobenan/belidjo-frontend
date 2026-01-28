// /dashboard/vendor/products/create.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// --- Importations de l'Architecture (Domain, Application, Infrastructure) ---
import { CreateProductUseCase } from "@/app/products/application/usecases/create-product.usecase";
import { CreateProductDto } from "@/app/products/application/dtos/create-product.dto";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { FindAllCategoryUseCase } from "@/app/categories/application/usescases/get-all-usecase";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";

// --- Importations des Hooks/UI ---
import { useAuth } from "@/app/context/AuthContext";
import ProductForm from "../../ui/components/products/FormProduct";
import toast from "react-hot-toast";

// --- Initialisation des Dépendances Globales (Hors du composant) ---
const CATEGORIES_PER_PAGE = 100;

// Produit Service Layer
const productRepo = new ProductRepository(new ProductMapper());
const productCreator = new CreateProductUseCase(productRepo);
// Catégorie Service Layer
const categoryRepo = new CategoryRepository(new CategoryMapper());
const categoryFinder = new FindAllCategoryUseCase(categoryRepo);

// -------------------------------------------------------------------

export default function CreateProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // --- États de Données ---
  const [categories, setCategories] = useState<Category[]>([]);

  // --- États de Chargement et d'Erreur ---
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Variables dérivées
  const vendorId = user?.vendorProfile?.id;
  const currentPage = 1;

  // --- 1. Logique de Chargement des Catégories ---
  useEffect(() => {
    const loadCategories = async () => {
      if (authLoading || !vendorId) {
        return;
      }

      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const response = await categoryFinder.execute(
          vendorId,
          CATEGORIES_PER_PAGE,
          currentPage,
        );
        setCategories(response.data);
      } catch (err: any) {
        const errorMessage =
          err?.message || "Impossible de charger les catégories du vendeur.";
        setCategoriesError(errorMessage);
        console.error("Erreur de chargement des catégories:", err);
        toast.error(`Erreur: ${errorMessage}`);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [vendorId, authLoading]);

  // --- 2. Fonction pour extraire le code HTTP de l'erreur ---
  const getHttpStatusCode = (error: any): number | null => {
    // Axios : error.response.status
    if (error?.response?.status) {
      return error.response.status;
    }

    // Fetch : error.status
    if (error?.status) {
      return error.status;
    }

    // Parse depuis le message si présent (ex: "HTTP 413")
    if (error?.message) {
      const statusMatch = error.message.match(/\b(4\d{2}|5\d{2})\b/);
      if (statusMatch) {
        return parseInt(statusMatch[0]);
      }
    }

    return null;
  };

  // --- 3. Fonction pour déterminer le type d'erreur et retourner un message approprié ---
  const getErrorMessage = (error: any): string => {
    console.log("🔍 Analyse de l'erreur:", {
      message: error?.message,
      status: getHttpStatusCode(error),
      response: error?.response,
    });

    // PRIORITÉ 1 : Si le backend a envoyé un message spécifique, l'utiliser tel quel
    if (error?.message && typeof error.message === "string") {
      const message = error.message;

      // Si le message du backend est déjà détaillé et commence par un emoji ou contient
      // des informations spécifiques, le retourner directement
      if (
        message.match(/^[❌🔐🚫📦⚠️🌐📷]/u) || // Commence par un emoji
        message.includes("Limite atteinte") ||
        message.includes("trop volumineuse") ||
        message.includes("Format d'image") ||
        message.includes("Maximum autorisé") ||
        message.includes("supprimez") ||
        message.includes("catégorie")
      ) {
        return message; // ✅ Retourner le message du backend tel quel
      }
    }

    // PRIORITÉ 2 : Analyser le code HTTP
    const statusCode = getHttpStatusCode(error);

    if (statusCode) {
      switch (statusCode) {
        case 400:
          // Essayer d'extraire un message plus spécifique
          if (error?.message) {
            return `❌ ${error.message}`;
          }
          return "❌ Données invalides. Vérifiez tous les champs du formulaire.";

        case 401:
          return "🔐 Session expirée. Veuillez vous reconnecter.";

        case 403:
          return "🚫 Accès refusé. Vous n'avez pas les droits nécessaires.";

        case 404:
          return "❓ Ressource introuvable. La catégorie n'existe peut-être plus.";

        case 413:
          // Le backend devrait déjà fournir un bon message
          if (error?.message) {
            return `📦 ${error.message}`;
          }
          return "📦 Fichier trop volumineux. Réduisez la taille de l'image (max 2 Mo).";
        case 422:
          return "❌ Données invalides. Vérifiez le format de vos informations.";
        case 500:
          return "⚠️ Erreur serveur. Nos équipes ont été notifiées. Veuillez réessayer.";
        case 503:
          return "⏸️ Service temporairement indisponible. Réessayez dans quelques minutes.";

        default:
          return `❌ Erreur HTTP ${statusCode}. Veuillez réessayer.`;
      }
    }

    // PRIORITÉ 3 : Analyser le contenu du message pour des mots-clés
    if (error?.message) {
      const message = error.message.toLowerCase();

      // Erreurs réseau
      if (
        message.includes("network") ||
        message.includes("fetch failed") ||
        message.includes("réseau") ||
        message.includes("connection")
      ) {
        return "🌐 Erreur de connexion. Vérifiez votre connexion Internet et réessayez.";
      }

      // Erreurs d'authentification
      if (
        message.includes("unauthorized") ||
        message.includes("non autorisé") ||
        message.includes("authentication")
      ) {
        return "🔐 Session expirée. Veuillez vous reconnecter.";
      }

      // Erreurs de permission
      if (
        message.includes("forbidden") ||
        message.includes("interdit") ||
        message.includes("permission")
      ) {
        return "🚫 Vous n'avez pas la permission d'effectuer cette action.";
      }

      // Si on a un message mais pas de catégorie spécifique, le retourner avec un préfixe
      return `❌ ${error.message}`;
    }

    // PRIORITÉ 4 : Message générique si aucune information n'est disponible
    return "❌ Une erreur inattendue s'est produite. Veuillez réessayer.";
  };

  // --- 4. Logique de Soumission du Produit avec Gestion d'Erreurs Détaillée ---
  const handleSubmit = async (data: CreateProductDto, file?: File | null) => {
    try {
      // SÉCURITÉ: Vérification de vendorId avant soumission
      if (!vendorId) {
        toast.error(
          "🔐 Erreur d'autorisation: Profil vendeur introuvable. Reconnectez-vous.",
        );
        router.push("/login");
        return;
      }

      // Validation côté client avant envoi
      if (!file && !data.imageUrl) {
        toast.error("📷 L'image du produit est obligatoire.");
        return;
      }

      // Vérification de la taille du fichier (2 Mo max)
      if (file && file.size > 2 * 1024 * 1024) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        toast.error(
          `📦 Image trop volumineuse (${fileSizeInMB} Mo). Maximum autorisé: 2 Mo.`,
        );
        return;
      }

      // Vérification du type de fichier
      if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          toast.error(
            `❌ Format d'image non supporté (${file.type}). Utilisez JPG, JPEG ou PNG.`,
          );
          return;
        }
      }

      // Injection de vendorId dans le DTO
      const dataWithVendor = { ...data, vendorId: vendorId };

      // Afficher un toast de chargement
      const loadingToast = toast.loading("⏳ Création du produit en cours...");

      try {
        await productCreator.execute(dataWithVendor, file);

        // Supprimer le toast de chargement et afficher le succès
        toast.dismiss(loadingToast);
        toast.success("✅ Produit créé avec succès !", { duration: 4000 });

        // Redirection après succès
        setTimeout(() => {
          router.replace("/admin/products");
        }, 1000);
      } catch (executionError: any) {
        // Supprimer le toast de chargement
        toast.dismiss(loadingToast);
        throw executionError; // Propager l'erreur pour la gestion globale
      }
    } catch (error: any) {
      console.error("❌ Erreur de création du produit:", error);

      // Obtenir un message d'erreur approprié
      const errorMessage = getErrorMessage(error);

      // Afficher l'erreur avec toast
      toast.error(errorMessage, {
        duration: 6000,
        icon: "❌",
        style: {
          maxWidth: "500px",
        },
      });

      // Logger détaillé pour le débogage
      console.error("📋 Détails de l'erreur:", {
        message: error?.message,
        status: getHttpStatusCode(error),
        response: error?.response,
        stack: error?.stack,
      });
    }
  };

  // --- 5. Rendu Conditionnel et Affichage des Statuts ---
  const isTotalLoading = authLoading || categoriesLoading;

  if (isTotalLoading) {
    return (
      <div className="flex justify-center items-center p-16 bg-gray-50 min-h-screen">
        <div className="p-8 rounded-xl shadow-lg bg-white text-center text-cyan-700">
          <svg
            className="animate-spin h-8 w-8 mr-3 inline text-cyan-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="font-semibold text-lg mt-3">
            Chargement des ressources...
          </p>
          <p className="text-sm text-gray-500 mt-1">Veuillez patienter</p>
        </div>
      </div>
    );
  }
  if (!vendorId) {
    return (
      <div className="p-10 text-center bg-red-100 border-2 border-red-300 text-red-800 rounded-xl max-w-lg mx-auto mt-10 shadow-lg">
        <div className="text-5xl mb-4">🚫</div>
        <h3 className="font-bold text-xl mb-2">Accès Refusé</h3>
        <p className="mb-4">
          Votre profil vendeur n'a pas pu être trouvé ou l'authentification a
          échoué.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Se reconnecter
        </button>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="p-10 text-center bg-yellow-50 border-2 border-yellow-300 text-yellow-900 rounded-xl max-w-lg mx-auto mt-10 shadow-lg">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-bold text-xl mb-2">Erreur de Chargement</h3>
        <p className="mb-2">{categoriesError}</p>
        <p className="text-sm mt-3 text-yellow-700">
          Impossible de charger les catégories. Le produit ne pourra pas être
          créé sans catégorie valide.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8">
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        availableCategories={categories}
      />
    </div>
  );
}
