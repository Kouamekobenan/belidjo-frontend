"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";
import { FindAllCategoryUseCase } from "@/app/categories/application/usescases/get-all-usecase";
import {
  FolderTree,
  Search,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
  Package,
  X,
  AlertCircle,
} from "lucide-react";
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
        currentPage
      );
      setCategories(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalCategories(response.total || response.data?.length || 0);
    } catch (err: any) {
      setError("Impossible de charger les catégories.");
      toast.error("Erreur lors du chargement des catégories.");
    } finally {
      setLoading(false);
    }
  }, [vendorId, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filtrage en temps réel
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  // Nombre de catégories illustrées avec image
  const imageCategoriesCount = useMemo(() => {
    return categories.filter((c) => !!c.imageUrl).length;
  }, [categories]);

  if (loading && categories.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-full overflow-hidden">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-600 mb-3" />
        <p className="text-xs font-bold text-slate-500">Chargement de vos catégories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans max-w-full min-w-0 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 min-w-0">

        {/* ========================================================================= */}
        {/* EN-TÊTE DE PAGE ET STATISTIQUES */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 min-w-0">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/20 shrink-0">
                <FolderTree className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Mes Catégories
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Organisez vos produits par familles et rayons dans votre boutique
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2.5 rounded-2xl border border-green-200 text-xs font-bold shrink-0 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span>Arborescence Active</span>
          </div>
        </div>

        {/* Cartes de métriques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Catégories</span>
              <FolderTree className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalCategories}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Rayons utilisés</p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avec Visuels</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-blue-600">{imageCategoriesCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Catégories avec image HD</p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organisation</span>
              <Package className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">Optimum</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Classement des produits</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRE DE RECHERCHE ET FILTRES */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 min-w-0">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GRILLE DE CARTES CATÉGORIES (Responsive Mobile sans débordement) */}
        {/* ========================================================================= */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FolderTree className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Aucune catégorie trouvée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? "Aucun résultat ne correspond à votre recherche."
                : "Vos catégories s'afficheront ici une fois vos produits créés."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-w-0">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group min-w-0"
                >
                  <div>
                    {/* Image / Visuel */}
                    <div className="relative w-full h-40 rounded-2xl bg-slate-100 overflow-hidden mb-3 border border-slate-100">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                          <FolderTree className="w-10 h-10 mb-1" />
                          <span className="text-[10px] font-bold">Catégorie</span>
                        </div>
                      )}

                      <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                        Rayon
                      </span>
                    </div>

                    {/* Titre & Description */}
                    <h3 className="font-bold text-slate-900 text-sm truncate">{cat.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {cat.description || "Pas de description renseignée"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-green-600">Active</span>
                    
                    <Link
                      href="/admin/products"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-green-600 transition-colors"
                    >
                      <span>Voir produits</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 px-3">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
