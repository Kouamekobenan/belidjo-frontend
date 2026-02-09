"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// --- Architecture ---
import { CreateProductUseCase } from "@/app/products/application/usecases/create-product.usecase";
import { CreateProductDto } from "@/app/products/application/dtos/create-product.dto";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";
import { GetTreeCategorieUseCase } from "@/app/categories/application/usescases/getTreeCategorie-usecase";

// --- UI/Hooks ---
import { useAuth } from "@/app/context/AuthContext";
import ProductForm from "../../ui/components/products/FormProduct";
import toast from "react-hot-toast";

// --- Initialisation des Dépendances ---
const productRepo = new ProductRepository(new ProductMapper());
const productCreator = new CreateProductUseCase(productRepo);
const categoryRepo = new CategoryRepository(new CategoryMapper());
const categoryFinder = new GetTreeCategorieUseCase(categoryRepo);

export default function CreateProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // --- États ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // État pour l'autocomplétion (nom suggéré)
  const [suggestedName, setSuggestedName] = useState("");

  const vendorId = user?.vendorProfile?.id;

  // --- 1. Chargement de l'arbre des catégories ---
  useEffect(() => {
    const loadCategories = async () => {
      if (authLoading || !vendorId) return;

      setCategoriesLoading(true);
      try {
        const response = await categoryFinder.execute();
        setCategories(response);
      } catch (err: any) {
        setCategoriesError(err?.message || "Erreur de chargement");
        toast.error("Impossible de charger les catégories.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, [vendorId, authLoading]);

  // --- 2. Logique d'Autocomplétion ---
  // Cette fonction sera appelée par le formulaire quand une catégorie change
  const handleCategoryChange = useCallback((selectedCategory: Category) => {
    if (selectedCategory) {
      // On suggère un nom basé sur la catégorie (ex: "Bazin - ")
      setSuggestedName(`${selectedCategory.name} - `);
    }
  }, []);

  // --- 3. Gestionnaire d'erreurs (inchangé mais nécessaire) ---
  const getErrorMessage = (error: any): string => {
    const statusCode = error?.response?.status || error?.status;
    if (statusCode === 413) return "📦 Image trop lourde (max 2Mo).";
    if (statusCode === 401) return "🔐 Session expirée.";
    return error?.message || "❌ Une erreur est survenue.";
  };

  // --- 4. Soumission du formulaire ---
  const handleSubmit = async (data: CreateProductDto, file?: File | null) => {
    if (!vendorId) {
      toast.error("Profil vendeur introuvable.");
      return;
    }

    const loadingToast = toast.loading("⏳ Création du produit...");

    try {
      const dataWithVendor = { ...data, vendorId };
      await productCreator.execute(dataWithVendor, file);

      toast.dismiss(loadingToast);
      toast.success("✅ Produit créé !");
      router.replace("/admin/products");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(getErrorMessage(error));
    }
  };

  // --- 5. Rendu ---
  if (authLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ajouter un produit</h1>
        <p className="text-gray-500">
          Remplissez les détails pour publier sur Noboutik
        </p>
      </header>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        availableCategories={categories} // C'est l'arbre injecté
        onCategoryChange={handleCategoryChange} // Callback pour l'autocomplétion
        suggestedName={suggestedName} // Valeur suggérée à injecter dans le champ Name
      />
    </div>
  );
}
