"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, PackageSearch } from "lucide-react";
import { useDebounce } from "@/app/hook/useDebounce";
import { IProduct } from "../../domain/entities/product.entity";
import { SearchProductsUseCase } from "../../application/usecases/search-products.usecase";
import { ProductRepository } from "../../infrastructure/product-repository";
import { ProductMapper } from "../../domain/mappers/product.mapper";

const repo = new ProductRepository(new ProductMapper());
const searchProducts = new SearchProductsUseCase(repo);

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

  const debouncedQuery = useDebounce(query, 400);

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

  const resultsContent = (
    <>
      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="p-6 text-center text-sm text-slate-400">
          Continuez à taper pour lancer la recherche...
        </p>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="p-10 text-center">
          <PackageSearch size={40} className="mx-auto mb-3 text-slate-200" />
          <p className="text-slate-500 font-semibold text-sm">
            Aucun article ne correspond à "{query}".
          </p>
        </div>
      )}

      {results.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {results.map((product) => (
            <li key={product.id}>
              <button
                onClick={() => handleSelect(product)}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {product.categoryName || "Sans catégorie"}
                  </p>
                </div>
                <p className="text-teal-600 font-black text-sm flex-shrink-0">
                  {product.price.toLocaleString()}{" "}
                  <span className="text-[10px] font-bold text-slate-400">
                    FCFA
                  </span>
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (variant === "bar") {
    return (
      <div ref={containerRef} className={triggerClassName ?? "relative w-full max-w-md"}>
        <div className="relative flex items-center gap-2 bg-slate-100 focus-within:bg-white rounded-xl px-4 py-2.5 border border-transparent focus-within:border-teal-200 focus-within:shadow-md transition-all">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Rechercher un article (ex: chaussure, sac...)"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-slate-400 text-slate-800"
          />
          {loading && (
            <Loader2 size={16} className="animate-spin text-teal-500 flex-shrink-0" />
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
              className="p-1 rounded-full hover:bg-slate-200 text-slate-400 flex-shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isOpen && query.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
            {resultsContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Rechercher un article"
        className={
          triggerClassName ??
          "p-2.5 rounded-xl text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
        }
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-16 sm:pt-24">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <Search size={20} className="text-teal-600 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article (ex: chaussure, sac...)"
                className="flex-1 outline-none text-sm sm:text-base placeholder:text-slate-400"
              />
              {loading && (
                <Loader2 size={18} className="animate-spin text-teal-500" />
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">{resultsContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
