"use client";
import { useEffect, useState } from "react";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";
import { FindAllCategoryUseCase } from "../../application/usescases/get-all-usecase";
import Image from "next/image";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Nombre de catégories par page
const CATEGORIES_PER_PAGE = 10;

export default function CategoriesList({ vendorId }: { vendorId: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Instanciation du Repository + UseCase
  const catRepo = new CategoryRepository(new CategoryMapper());
  const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepo);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await findAllCategoryUseCase.execute(
          vendorId,
          CATEGORIES_PER_PAGE,
          currentPage
        );
        setCategories(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCategories(response.total || 0);
      } catch (err: any) {
        setError("Impossible de charger les catégories du vendeur.");
        console.error("Erreur de chargement des catégories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [vendorId, currentPage]);

  // Fonctions de navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // --- RENDU DES ÉTATS ---

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center py-3 bg-gray-50 border-y border-gray-200">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500 mr-2" />
        <p className="text-gray-600">Chargement des catégories...</p>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mx-4 sm:mx-6 lg:mx-8 my-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // Si aucune catégorie
  if (categories.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 mx-4 sm:mx-6 lg:mx-8 my-4">
        <p className="text-sm">
          Le vendeur n'a pas encore associé de catégories de produits.
        </p>
      </div>
    );
  }
  // --- RENDU PRINCIPAL (GRILLE AVEC PAGINATION) ---
  return (
    <div className="py-4 sm:py-6 lg:py-6 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Explorer par Catégorie
          </h2>
          <p className="text-sm text-gray-500">
            {totalCategories} catégorie{totalCategories > 1 ? "s" : ""}
          </p>
        </div>
        {/* GRILLE DE CATÉGORIES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {categories.map((cat) => (
            <Link
              href={`/products/ui/category/${cat.id}`}
              key={cat.id}
              className="group relative flex flex-col items-center justify-start p-4 bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {/* Image de Catégorie */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 relative overflow-hidden rounded-full">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover border-2 border-teal-100 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              {/* Nom de Catégorie (toujours visible) */}
              <p className="text-sm sm:text-base font-medium text-gray-700 text-center line-clamp-2">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Bouton Précédent */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            {/* Numéros de page */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Afficher uniquement les pages pertinentes (optimisation pour grand nombre de pages)
                  const shouldShow =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!shouldShow && page === currentPage - 2) {
                    return (
                      <span key={page} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  if (!shouldShow) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-teal-500 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}
            </div>

            {/* Bouton Suivant */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Indicateur de page */}
        {totalPages > 1 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Page {currentPage} sur {totalPages}
          </p>
        )}
      </div>
    </div>
  );
}
