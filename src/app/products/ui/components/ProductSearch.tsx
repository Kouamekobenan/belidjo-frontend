"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  PackageSearch,
  Sparkles,
  Flame,
  ChevronRight,
  TrendingUp,
  Footprints,
  ShoppingBag,
  Shirt,
  Smartphone,
  Watch,
} from "lucide-react";
import { useDebounce } from "@/app/hook/useDebounce";
import { IProduct } from "../../domain/entities/product.entity";
import { SearchProductsUseCase } from "../../application/usecases/search-products.usecase";
import { ProductRepository } from "../../infrastructure/product-repository";
import { ProductMapper } from "../../domain/mappers/product.mapper";

const repo = new ProductRepository(new ProductMapper());
const searchProducts = new SearchProductsUseCase(repo);

const POPULAR_TAGS = [
  { label: "Chaussures", icon: Footprints },
  { label: "Sacs & Accessoires", icon: ShoppingBag },
  { label: "Vêtements & Robes", icon: Shirt },
  { label: "Smartphones", icon: Smartphone },
  { label: "Montres", icon: Watch },
  { label: "Beauté & Parfums", icon: Sparkles },
];

export default function ProductSearch({
  triggerClassName,
  variant = "icon",
}: {
  triggerClassName?: string;
  variant?: "icon" | "bar";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!isOpen) return;
    const term = debouncedQuery.trim();
    if (term.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchProducts
      .execute(term, 1, 15)
      .then((res) => {
        if (cancelled) return;
        setResults(res.data);
        setSearched(true);
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setSearched(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  // Ferme le dropdown de la barre "inline" au clic à l'extérieur
  useEffect(() => {
    if (variant !== "bar") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  const handleSelect = (product: IProduct) => {
    setIsOpen(false);
    if (product.categoryId) {
      const params = new URLSearchParams();
      if (product.categoryName) params.set("name", product.categoryName);
      router.push(`/products/category/${product.categoryId}?${params.toString()}`);
    } else {
      router.push(`/products/ui/pages/page/${product.id}`);
    }
  };

  const handleQuickTagClick = (tagLabel: string) => {
    setQuery(tagLabel);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const resultsContent = (
    <div className="p-2 sm:p-3 bg-white">
      {/* Suggestions marketing quand la saisie est courte/vide */}
      {query.trim().length < 2 && (
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Recherches populaires & Tendances</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_TAGS.map((tag) => {
              const TagIcon = tag.icon;
              return (
                <button
                  key={tag.label}
                  onClick={() => handleQuickTagClick(tag.label)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100/80 hover:bg-green-50 hover:text-green-700 hover:border-green-300 border border-slate-200/70 text-xs font-semibold text-slate-700 transition-all duration-200 shadow-sm active:scale-95 group"
                >
                  <TagIcon className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-green-50 via-green-50 to-green-50 border border-green-200/60 text-xs text-green-800 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600 shrink-0" />
              <span>Trouvez en un instant les meilleures offres du moment.</span>
            </div>
          </div>
        </div>
      )}

      {/* État : Aucun résultat */}
      {searched && !loading && results.length === 0 && (
        <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <PackageSearch className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-800 font-extrabold text-base sm:text-lg mb-1">
            Aucun article trouvé pour « {query} »
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-4">
            Essayez de vérifier l'orthographe ou d'utiliser un mot-clé plus général.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_TAGS.slice(0, 3).map((tag) => {
              const TagIcon = tag.icon;
              return (
                <button
                  key={tag.label}
                  onClick={() => handleQuickTagClick(tag.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <TagIcon className="w-3.5 h-3.5 text-green-600" />
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des résultats */}
      {results.length > 0 && (
        <div className="space-y-1 bg-white">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{results.length} Produit{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}</span>
            <span className="text-green-600 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> Résultats instantanés
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="w-full group flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white hover:bg-slate-50 transition-all duration-200 text-left border border-transparent hover:border-green-500/20"
              >
                {/* Image miniature */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info Produit */}
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-green-600 transition-colors truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] sm:text-xs font-semibold text-slate-500 truncate">
                      {product.categoryName || "Général"}
                    </span>
                  </div>
                </div>

                {/* Prix & Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200/60 text-green-700 font-black text-sm sm:text-base shadow-sm">
                      {product.price.toLocaleString()}{" "}
                      <span className="text-[10px] font-bold text-green-600">
                        FCFA
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl text-slate-300 group-hover:text-green-600 group-hover:bg-green-50 transition-all">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Variant: BARRE D'ENTRÉE CLAIRE & MARKETING
  if (variant === "bar") {
    return (
      <div ref={containerRef} className={triggerClassName ?? "relative w-full max-w-xl mx-auto"}>
        {/* Champ de recherche haute visibilité */}
        <div
          className={`group relative flex items-center gap-2 sm:gap-3 bg-white rounded-2xl sm:rounded-3xl px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 transition-all duration-300 shadow-sm ${
            isOpen
              ? "border-green-500 ring-4 ring-green-500/15 shadow-xl shadow-green-500/10"
              : "border-slate-200/90 hover:border-green-400 hover:shadow-md"
          }`}
        >
          {/* Icône animée */}
          <div className="p-2 rounded-xl bg-green-50 text-green-600 group-focus-within:bg-green-500 group-focus-within:text-white transition-all duration-300 shrink-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Rechercher un produit, une marque..."
            className="flex-1 min-w-0 bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-400 text-slate-900"
          />

          {loading && (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-green-500 shrink-0" />
          )}

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
                inputRef.current?.focus();
              }}
              aria-label="Effacer la recherche"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Tag d'incitation marketing sur grand écran */}
          {!query && (
            <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 shrink-0 border border-slate-200/60 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>Offres & Produits</span>
            </div>
          )}
        </div>

        {/* Dropdown sous la barre */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2.5 bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden z-50 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-200">
            {resultsContent}
          </div>
        )}
      </div>
    );
  }

  // Variant: BOUTON DÉCLENCHEUR CLAIR
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Rechercher un article"
        className={
          triggerClassName ??
          "relative group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-green-50 border-2 border-slate-200/90 hover:border-green-400 text-slate-700 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
        }
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-bold text-xs sm:text-sm">Rechercher</span>
        <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-extrabold bg-green-50 text-green-700 rounded-md border border-green-200/60">
          PRODUITS
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
          {/* Overlay léger avec flou doux */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Carte modale 100% lumineuse/blanche */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[85vh]">
            {/* Header de la recherche */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-green-50 text-green-600 border border-green-100 shrink-0">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit, une marque, une catégorie..."
                className="flex-1 bg-transparent outline-none text-sm sm:text-base font-bold placeholder:text-slate-400 text-slate-900"
              />

              {loading && (
                <Loader2 className="w-5 h-5 animate-spin text-green-500 shrink-0" />
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu dynamique */}
            <div className="overflow-y-auto flex-1 bg-white">{resultsContent}</div>
          </div>
        </div>
      )}
    </>
  );
}


