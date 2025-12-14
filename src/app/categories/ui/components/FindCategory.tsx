"use client";
import { useEffect, useState, useRef } from "react";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";
import { FindAllCategoryUseCase } from "../../application/usescases/get-all-usecase";
import Image from "next/image";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Nombre de catégories par page
const CATEGORIES_PER_PAGE = 20; // Augmenté pour le scroll horizontal

export default function CategoriesList({ vendorId }: { vendorId: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Vérifier si le scroll est possible
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [categories]);

  // Fonctions de scroll
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Fonctions de navigation de page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  // --- RENDU DES ÉTATS ---

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 bg-gray-50 border-y border-gray-200">
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

  // --- RENDU PRINCIPAL (SCROLL HORIZONTAL) ---
  return (
    <div className="py-4 sm:py-6 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Explorer par Catégorie
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {totalCategories} catégorie{totalCategories > 1 ? "s" : ""}
          </p>
        </div>

        {/* Conteneur avec boutons de navigation */}
        <div className="relative group">
          {/* Bouton Scroll Gauche - Desktop */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Faire défiler vers la gauche"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Conteneur de scroll horizontal */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {categories.map((cat) => (
              <Link
                href={`/products/ui/category/${cat.id}`}
                key={cat.id}
                className="flex-shrink-0 snap-start group"
              >
                <div className="flex flex-col items-center justify-start p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 w-24 sm:w-28 md:w-32">
                  {/* Image de Catégorie */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3 relative overflow-hidden rounded-full">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-cover border-2 border-teal-100 transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  {/* Nom de Catégorie */}
                  <p className="text-xs sm:text-sm font-medium text-gray-700 text-center line-clamp-2 w-full">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bouton Scroll Droite - Desktop */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Faire défiler vers la droite"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Indicateurs de scroll - Mobile */}
          <div className="flex lg:hidden justify-center gap-1 mt-3 px-4">
            {canScrollLeft && (
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            )}
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            {canScrollRight && (
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            )}
          </div>
        </div>

        {/* PAGINATION - Seulement si plusieurs pages */}
        {totalPages > 1 && (
          <div className="mt-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              {/* Bouton Précédent */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              {/* Indicateur de page */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-lg border border-gray-300">
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} / {totalPages}
                </span>
              </div>

              {/* Bouton Suivant */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Style pour masquer la scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
