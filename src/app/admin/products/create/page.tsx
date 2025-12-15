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

// --- Initialisation des Dépendances Globales (Hors du composant) ---
const CATEGORIES_PER_PAGE = 100;

// Produit Service Layer
const productRepo = new ProductRepository(new ProductMapper());
const productCreator = new CreateProductUseCase(productRepo); // Renommé pour plus de clarté
// Catégorie Service Layer
const categoryRepo = new CategoryRepository(new CategoryMapper());
const categoryFinder = new FindAllCategoryUseCase(categoryRepo); // Renommé pour plus de clarté

// -------------------------------------------------------------------

export default function CreateProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // --- États de Données ---
  const [categories, setCategories] = useState<Category[]>([]);

  // --- États de Chargement et d'Erreur ---
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Ajout pour gérer l'état de soumission

  // Variables dérivées
  const vendorId = user?.vendorProfile?.id;
  const currentPage = 1;

  // --- 1. Logique de Chargement des Catégories ---
  useEffect(() => {
    const loadCategories = async () => {
      // Empêche l'exécution si l'authentification est en cours ou si l'ID est inconnu
      if (authLoading || !vendorId) {
        return;
      }

      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const response = await categoryFinder.execute(
          vendorId,
          CATEGORIES_PER_PAGE,
          currentPage
        );
        setCategories(response.data);
      } catch (err) {
        setCategoriesError("Impossible de charger les catégories du vendeur.");
        console.error("Erreur de chargement des catégories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [vendorId, authLoading]); // Dépend de vendorId et authLoading

  // --- 2. Logique de Soumission du Produit ---
  const handleSubmit = async (data: CreateProductDto, file?: File | null) => {
    setIsSubmitting(true);
    try {
      // SÉCURITÉ: Injection de vendorId dans le DTO pour l'autorisation backend
      if (!vendorId) {
        throw new Error("Erreur d'autorisation: ID vendeur manquant.");
      }
      const dataWithVendor = { ...data, vendorId: vendorId };

      await productCreator.execute(dataWithVendor, file);
      alert("Produit créé avec succès !");
      router.replace("/admin/products");
    } catch (error: any) {
      console.error("Erreur de création:", error);
      // Si l'erreur vient du backend (ex: 400 validation), on affiche le message
      alert(`Échec de la création: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Rendu Conditionnel et Affichage des Statuts ---
  const isTotalLoading = authLoading || categoriesLoading;

  if (isTotalLoading) {
    return (
      <div className="flex justify-center items-center p-16 bg-gray-50 min-h-screen">
        <div className="p-8 rounded-xl shadow-lg bg-white text-center text-cyan-700">
          <svg
            className="animate-spin h-6 w-6 mr-3 inline text-cyan-500"
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
          <p className="font-medium">Chargement des ressources...</p>
        </div>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="p-10 text-center bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-lg mx-auto mt-10">
        <h3 className="font-bold">Accès Refusé</h3>
        <p>
          Votre profil vendeur n'a pas pu être trouvé ou l'authentification a
          échoué.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
        >
          Se reconnecter
        </button>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="p-10 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg max-w-lg mx-auto mt-10">
        <h3 className="font-bold">⚠️ Erreur de Catégories</h3>
        <p>{categoriesError}</p>
        <p className="text-sm mt-2">
          Le produit peut ne pas être sauvegardé correctement sans catégorie
          valide.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <ProductForm
        // Passer l'état de soumission
        // isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        availableCategories={categories}
      />
    </div>
  );
}
