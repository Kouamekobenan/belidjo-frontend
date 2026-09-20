import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { IProduct } from "../../domain/entities/product.entity";
import { GetProductsByVendorUseCase } from "../../application/usecases/get-product.usecase";
import { ProductRepository } from "../../infrastructure/product-repository";
import { ProductMapper } from "../../domain/mappers/product.mapper";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Layers,
  Tag,
  ShoppingCart,
} from "lucide-react";

const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);
const PRODUCT_DETAIL_BASE_PATH = "/products";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

export default function VendorProducts({ vendorId }: { vendorId: string }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres & Tri
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 1. Charger les produits
  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts
      .execute(vendorId, 30, pagination.page)
      .then((res) => {
        setProducts(res.data);
        setPagination({ page: res.page, totalPages: res.totalPages });
        setLoading(false);
      })
      .catch(() => {
        setError("Échec du chargement des produits.");
        setLoading(false);
      });
  }, [vendorId, pagination.page]);

  // 2. Grouper les produits par catégorie après filtrage/tri
  const groupedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (minPrice !== "")
      result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice !== "")
      result = result.filter((p) => p.price <= Number(maxPrice));

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

    const groups: Record<string, IProduct[]> = {};
    result.forEach((p) => {
      const key = p.categoryName || "Sans catégorie";
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    return groups;
  }, [products, searchQuery, minPrice, maxPrice, sortBy]);

  const hasResults = Object.keys(groupedProducts).length > 0;
  const totalFiltered = Object.values(groupedProducts).flat().length;
  const hasActiveFilters =
    searchQuery || minPrice || maxPrice || sortBy !== "default";

  const clearAllFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  };

  if (error) return <ErrorView />;
  if (!loading && products.length === 0) return <EmptyView />;

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* ── Header ── */}
        <div className="py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-1">
              E-Boutique Côte d'Ivoire
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Catalogue Articles
            </h2>
            {!loading && (
              <p className="text-sm text-slate-400 mt-1">
                {totalFiltered} article{totalFiltered > 1 ? "s" : ""} •{" "}
                {Object.keys(groupedProducts).length} catégorie
                {Object.keys(groupedProducts).length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Toggle vue */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 self-start">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que cherchez-vous ?"
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-4 rounded-2xl font-bold text-sm shadow-sm transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-green-600 text-white"
                  : "bg-white text-slate-600"
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {showFilters && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                    Budget (FCFA)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                    Trier les articles
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold text-slate-700"
                  >
                    <option value="default">Plus récents</option>
                    <option value="price-asc">Prix : Petit au Grand</option>
                    <option value="price-desc">Prix : Grand au Petit</option>
                    <option value="name-asc">Nom : A - Z</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full p-3 text-red-500 font-bold text-sm bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Catalogue groupé par catégories ── */}
        {loading ? (
          <div className="space-y-10">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-full mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-72 bg-slate-200 animate-pulse rounded-3xl"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !hasResults ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Layers className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-bold">
              Aucun article ne correspond à votre recherche.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-green-600 font-bold text-sm underline underline-offset-2"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedProducts).map(([category, items]) => (
              <section key={category}>
                {/* En-tête catégorie */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-green-600" />
                    <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                      {category}
                    </h3>
                    <span className="text-xs font-black bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-[11px] font-bold text-slate-400">
                      Glisser &rarr;
                    </span>
                    <div className="hidden md:block flex-1 h-px bg-slate-200 w-32" />
                  </div>
                </div>

                {/* Liste des produits : Défilement horizontal sur mobile (style Jumia) / Grille sur desktop */}
                <div
                  className={
                    viewMode === "grid"
                      ? "flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 overflow-x-auto md:overflow-visible pb-3 md:pb-0 snap-x snap-mandatory scrollbar-none"
                      : "space-y-4"
                  }
                >
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} viewMode={viewMode} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 hover:shadow-md transition-shadow"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 font-black text-slate-400">
              {pagination.page} / {pagination.totalPages}
            </div>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 hover:shadow-md transition-shadow"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Carte produit (Ultra-ergonomique Mobile & Desktop) ──
function ProductCard({
  product,
  viewMode,
}: {
  product: IProduct;
  viewMode: "grid" | "list";
}) {
  const isGrid = viewMode === "grid";
  const detailUrl = `${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${product.id}?action=order`;

  return (
    <Link
      href={detailUrl}
      className={`group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex ${
        isGrid
          ? "flex-col w-[150px] xs:w-[170px] sm:w-[190px] md:w-full shrink-0 snap-start"
          : "flex-row items-center p-2.5 w-full"
      }`}
    >
      {/* Image avec arrière-plan vert marque */}
      <div
        className={`relative bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-green-600/20 overflow-hidden flex-shrink-0 ${
          isGrid ? "aspect-square w-full p-2.5 md:p-4" : "w-20 h-20 md:w-24 md:h-24 p-1.5 rounded-xl"
        }`}
      >
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Infos produit */}
      <div
        className={`p-2.5 md:p-4 flex flex-col justify-between ${
          isGrid ? "flex-1" : "flex-1 ml-3"
        }`}
      >
        <div>
          <h3 className="font-semibold text-slate-800 text-xs md:text-sm line-clamp-2 leading-tight mb-1 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-1.5 flex items-baseline justify-between gap-1">
          <p className="text-green-600 font-black text-xs md:text-base tracking-tight">
            {product.price.toLocaleString()}{" "}
            <span className="text-[9px] md:text-xs font-bold text-slate-400">FCFA</span>
          </p>

          {/* Bouton visible uniquement sur écran desktop */}
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
            <ShoppingCart size={12} />
            Commander
          </span>
        </div>
      </div>
    </Link>
  );
}

function ErrorView() {
  return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold">
        Erreur de chargement. Vérifiez votre connexion.
      </p>
    </div>
  );
}

function EmptyView() {
  return (
    <div className="p-20 text-center">
      <ShoppingBag size={48} className="mx-auto mb-4 text-slate-200" />
      <p className="text-slate-400 font-bold">La boutique est vide.</p>
    </div>
  );
}

