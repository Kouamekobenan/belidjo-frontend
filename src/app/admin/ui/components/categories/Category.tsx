"use client";
import { useEffect, useState, useCallback } from "react";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";
import Image from "next/image";
import { FolderTree, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { FindAllCategoryUseCase } from "@/app/categories/application/usescases/get-all-usecase";
import toast from "react-hot-toast";
const CATEGORIES_PER_PAGE = 12;
interface VendorCategoriesDashboardProps {
  vendorId: string;
}
const catRepo = new CategoryRepository(new CategoryMapper());
const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepo);

export default function VendorCategoriesDashboard({
  vendorId,
}: VendorCategoriesDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await findAllCategoryUseCase.execute(
        vendorId,
        CATEGORIES_PER_PAGE,
        currentPage,
      );
      setCategories(response.data);
      setTotalPages(response.totalPages || 1);
      setTotalCategories(response.total || 0);
    } catch (err: any) {
      setError("Impossible de charger les catégories.");
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [vendorId, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête simplifié */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mes Catégories</h2>
        <p className="text-gray-600 mt-1">
          {totalCategories} catégorie{totalCategories > 1 ? "s" : ""} utilisée
          {totalCategories > 1 ? "s" : ""} dans votre boutique
        </p>
      </div>
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher parmi vos catégories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none transition-all"
        />
      </div>
      {/* Grille de catégories (Lecture seule) */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FolderTree className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucune catégorie trouvée.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FolderTree className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-center truncate px-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 text-center line-clamp-1 mt-1">
                  {cat.description || "Pas de description"}
                </p>
              </div>
            ))}
          </div>
          {/* Pagination simplifiée */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-30"
              >
                <ChevronLeft />
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-30"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
