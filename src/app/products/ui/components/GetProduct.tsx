import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { IProduct } from "../../domain/entities/product.entity";
import { GetProductsByVendorUseCase } from "../../application/usecases/get-product.usecase";
import { ProductRepository } from "../../infrastructure/product-repository";
import { ProductMapper } from "../../domain/mappers/product.mapper";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  TrendingDown,
  TrendingUp,
  LayoutGrid,
  List,
} from "lucide-react";

const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);
const PRODUCT_DETAIL_BASE_PATH = "/products";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

export default function VendorProducts({ vendorId }: { vendorId: string }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts
      .execute(vendorId, 10, pagination.page)
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setPagination({ page: res.page, totalPages: res.totalPages });
        setLoading(false);
      })
      .catch(() => {
        setError("Échec du chargement des produits.");
        setLoading(false);
      });
  }, [vendorId, pagination.page]);

  // Apply filters & search
  const applyFilters = useCallback(() => {
    let result = [...products];

    // Search by name
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by price range
    if (minPrice !== "") {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery || minPrice || maxPrice || sortBy !== "default";

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-3xl border border-red-100 text-red-500 max-w-xl mx-auto mt-20">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
          <Info className="w-8 h-8" />
        </div>
        <p className="text-lg font-bold mb-1">Oups, une erreur est survenue</p>
        <p className="text-sm text-red-400 mb-5">
          Échec du chargement des produits.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );

  if (!loading && products.length === 0)
    return (
      <div className="text-center py-24 bg-white rounded-[32px] shadow-sm border border-gray-100 max-w-4xl mx-auto mt-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-3">
          Boutique vide
        </h3>
        <p className="text-slate-400 max-w-xs mx-auto text-sm">
          Ce vendeur n'a pas encore exposé ses articles. Revenez bientôt !
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-4 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* ── Header ── */}
        <div className="py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500 mb-1">
              Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              Nos Articles
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              {filteredProducts.length} article
              {filteredProducts.length !== 1 ? "s" : ""} disponible
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* ── Search & Filters Bar ── */}
        <div className="mb-8 space-y-3">
          {/* Main search row */}
          <div className="flex gap-3 items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article par nom…"
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border font-semibold text-sm transition-all shadow-sm whitespace-nowrap ${
                showFilters || hasActiveFilters
                  ? "bg-teal-500 text-white border-teal-500 shadow-teal-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtres</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full opacity-90" />
              )}
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Price range */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Tag size={11} className="inline mr-1.5 mb-0.5" />
                    Fourchette de prix (FCFA)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <TrendingDown
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        min={0}
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <span className="text-slate-300 font-bold">—</span>
                    <div className="relative flex-1">
                      <TrendingUp
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        min={0}
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <ArrowUpDown size={11} className="inline mr-1.5 mb-0.5" />
                    Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="default">Par défaut</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name-asc">Nom (A → Z)</option>
                  </select>
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    <X size={14} />
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active filters badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-1">
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-semibold">
                  <Search size={11} />
                  &quot;{searchQuery}&quot;
                  <button
                    onClick={clearSearch}
                    className="ml-1 hover:text-teal-900"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-semibold">
                  <Tag size={11} />
                  {minPrice || "0"} – {maxPrice || "∞"} FCFA
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="ml-1 hover:text-violet-900"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {sortBy !== "default" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                  <ArrowUpDown size={11} />
                  {sortBy === "price-asc"
                    ? "Prix ↑"
                    : sortBy === "price-desc"
                      ? "Prix ↓"
                      : "Nom A→Z"}
                  <button
                    onClick={() => setSortBy("default")}
                    className="ml-1 hover:text-amber-900"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Products ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-[360px] animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* No results */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-5">
              Aucun article ne correspond à votre recherche. Essayez d'autres
              termes ou réinitialisez les filtres.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-teal-500 transition-colors"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group relative bg-white rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 border border-transparent hover:border-teal-100 flex flex-col h-full overflow-hidden"
              >
                {/* Image */}
                <Link
                  href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                  className="relative aspect-[4/5] overflow-hidden bg-slate-100 block"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Discount badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      -17%
                    </span>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-3 md:p-4 flex flex-col flex-grow">
                  <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors mb-3">
                    {p.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 line-through decoration-red-300">
                        {(p.price * 1.2).toLocaleString()} FCFA
                      </p>
                      <p className="text-base md:text-lg font-black text-teal-600 leading-none">
                        {p.price.toLocaleString()}
                        <span className="text-[10px] font-bold ml-1 text-teal-500">
                          FCFA
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                      className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-teal-500 transition-all hover:scale-105 shadow-md shadow-slate-200"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-2xl border border-transparent hover:border-teal-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex items-center gap-4 p-3"
              >
                <Link
                  href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 block"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[11px] text-slate-400 line-through font-medium">
                      {(p.price * 1.2).toLocaleString()} FCFA
                    </span>
                    <span className="text-xs bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded-full">
                      -17%
                    </span>
                  </div>
                  <p className="text-base font-black text-teal-600 mt-0.5">
                    {p.price.toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-teal-500">
                      FCFA
                    </span>
                  </p>
                </div>
                <Link
                  href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-teal-500 transition-all shadow-sm"
                >
                  <span className="hidden sm:inline">Voir</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-16 flex flex-col items-center gap-5">
            <div className="flex items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2.5 rounded-xl disabled:opacity-25 hover:bg-slate-50 transition-colors text-slate-600"
              >
                <ChevronLeft size={18} />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const n = i + 1;
                const active = n === pagination.page;
                // Show limited page numbers
                if (
                  pagination.totalPages <= 7 ||
                  n === 1 ||
                  n === pagination.totalPages ||
                  Math.abs(n - pagination.page) <= 1
                ) {
                  return (
                    <button
                      key={n}
                      onClick={() => handlePageChange(n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        active
                          ? "bg-teal-500 text-white shadow-lg shadow-teal-200 scale-110"
                          : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {n}
                    </button>
                  );
                } else if (
                  (n === pagination.page - 2 && pagination.page > 4) ||
                  (n === pagination.page + 2 &&
                    pagination.page < pagination.totalPages - 3)
                ) {
                  return (
                    <span
                      key={n}
                      className="w-10 h-10 flex items-end justify-center pb-2.5 text-slate-300 font-bold text-lg"
                    >
                      ···
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2.5 rounded-xl disabled:opacity-25 hover:bg-slate-50 transition-colors text-slate-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.18em]">
              Page {pagination.page}{" "}
              <span className="mx-2 text-slate-200">|</span>{" "}
              {pagination.totalPages} au total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
