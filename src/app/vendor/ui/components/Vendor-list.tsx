"use client";
import {
  MapPin,
  Store,
  ChevronRight,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import Link from "next/link";
import { photoCouv } from "@/app/lib/globals.type";

interface City {
  id: string;
  name: string;
}
interface VendorListProps {
  data: Vendor[];
  onVendorClick?: (vendorId: string) => void;
}

const VendorListItem = ({
  vendor,
  onClick,
}: {
  vendor: Vendor;
  onClick: (id: string, domain?: string) => void;
}) => {
  const { id, name, city, site } = vendor;

  return (
    <li className="group bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-500 ease-out active:scale-[0.98]">
      {/* Container Principal : Colonne sur mobile, Ligne sur SM+ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Logo Section : Centré sur mobile */}
        <div
          className="relative w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 bg-slate-50  overflow-hidden border border-slate-100 group-hover:border-teal-100 transition-colors cursor-pointer"
          onClick={() => onClick(id, site?.domain)}
        >
          <img
            src={site?.logoUrl ?? photoCouv}
            alt={name}
            // className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        {/* Info Section : Aligné à gauche */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-xl md:text-2xl text-slate-900 group-hover:text-teal-600 transition-colors truncate">
              {name}
            </h3>
            {city && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-teal-100">
                <MapPin className="h-3 w-3" />
                {city.name}
              </span>
            )}
          </div>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
            {site?.description ||
              "Découvrez une sélection exclusive de produits de qualité supérieure chez ce partenaire certifié."}
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Store size={14} className="text-teal-500" /> Boutique Vérifiée
            </span>
            <span className="hidden sm:block">•</span>
            <span className="hidden sm:block">Livraison Rapide</span>
          </div>
        </div>

        {/* Action Section : Pleine largeur sur mobile */}
        <div className="w-full sm:w-auto pt-2 sm:pt-0">
          <Link
            href={`/products/ui/page/${id}`}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-teal-600 text-white font-bold  transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-teal-500/20 group/btn"
          >
            Visiter
            <ArrowRight
              size={18}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </li>
  );
};

const VendorFilters = ({ selectedCity, setSelectedCity, cityOptions }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCityName =
    selectedCity === "all"
      ? "Toutes les localisations"
      : cityOptions?.find((city: any) => city?.id === selectedCity)?.name || "";

  const filteredCities =
    cityOptions?.filter((city: any) =>
      city?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }
    if (isOpen) {
      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          setSearchQuery("");
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredCities.length ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > -1 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex === -1) {
            setSelectedCity("all");
          } else if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredCities.length
          ) {
            setSelectedCity(filteredCities[highlightedIndex].id);
          }
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
          break;
      }
    }
  };

  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  return (
    /*
     * FIX: "overflow-hidden" retiré du wrapper principal.
     * Il coupait le dropdown desktop qui sort en dehors de la carte.
     * Les décorations d'arrière-plan (blobs) sont déplacées dans un div
     * enfant avec overflow-hidden pour ne pas affecter le combobox.
     */
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 md:p-12 mb-8 sm:mb-12 shadow-2xl border border-white/5">
      {/* Décorations — isolées dans leur propre overflow-hidden */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-[32px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-15%] w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 lg:gap-8">
        {/* Titre */}
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Explorer les{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              boutiques
            </span>
          </h2>
          <p className="text-slate-400 font-medium text-xs sm:text-sm md:text-base">
            Filtrez par ville pour trouver le vendeur le plus proche.
          </p>
        </div>

        {/* Combobox */}
        <div ref={comboboxRef} className="relative w-full lg:max-w-md">
          <div className="relative">
            <MapPin className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-teal-400 z-10 pointer-events-none" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                if (!isOpen) {
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 sm:pl-14 md:pl-16 pr-11 sm:pr-12 md:pr-14 py-3.5 sm:py-4 md:py-5 lg:py-6 bg-white/10 backdrop-blur-xl border-2 border-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl text-left hover:bg-white/15 hover:border-teal-400/50 focus:bg-white/15 focus:border-teal-400 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className="truncate block">{selectedCityName}</span>
            </button>

            <ChevronRight
              className={`absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-teal-400 pointer-events-none transition-transform duration-300 ${
                isOpen ? "rotate-[270deg]" : "rotate-90"
              }`}
            />
          </div>

          {/* Overlay mobile */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
            />
          )}

          {isOpen && (
            <>
              {/* ── MOBILE : bottom sheet ── */}
              <div className="fixed inset-x-0 bottom-0 lg:hidden bg-slate-900 rounded-t-3xl shadow-2xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
                <div className="flex-shrink-0 pt-3 pb-2 px-4">
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-black text-white text-center mb-1">
                    Choisir une ville
                  </h3>
                  <p className="text-xs text-slate-400 text-center">
                    {filteredCities.length + 1} localisation
                    {filteredCities.length > 0 ? "s" : ""} disponible
                    {filteredCities.length > 0 ? "s" : ""}
                  </p>
                </div>

                <div className="flex-shrink-0 p-4 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Rechercher une ville..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setHighlightedIndex(-1);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-12 pr-10 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/10 focus:border-teal-400/50 focus:outline-none transition-all text-base font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <button
                    type="button"
                    onClick={() => handleSelectCity("all")}
                    className={`w-full px-5 py-5 text-left font-bold text-base transition-all border-b border-white/5 ${selectedCity === "all" ? "bg-teal-500/20 text-teal-300 border-l-4 border-teal-400" : "text-white active:bg-white/10"}`}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0" />
                      <span className="flex-1">Toutes les localisations</span>
                      {selectedCity === "all" && (
                        <span className="text-teal-400 text-xl">✓</span>
                      )}
                    </span>
                  </button>
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city: any, index: number) => (
                      <button
                        key={city?.id || `city-${index}`}
                        type="button"
                        onClick={() => handleSelectCity(city?.id)}
                        className={`w-full px-5 py-5 text-left font-bold text-base transition-all border-b border-white/5 ${selectedCity === city?.id ? "bg-teal-500/20 text-teal-300 border-l-4 border-teal-400" : "text-white active:bg-white/10"}`}
                      >
                        <span className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0" />
                          <span className="flex-1">{city?.name}</span>
                          {selectedCity === city?.id && (
                            <span className="text-teal-400 text-xl">✓</span>
                          )}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-12 text-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-slate-400 text-base font-medium">
                        Aucune ville trouvée pour
                      </p>
                      <p className="text-white font-bold text-lg mt-1">
                        "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 p-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    Fermer
                  </button>
                </div>
              </div>

              {/* ── DESKTOP : dropdown ── */}
              <div className="hidden lg:block absolute top-full mt-3 w-full bg-slate-800/95 backdrop-blur-xl border-2 border-teal-400/30 rounded-3xl shadow-2xl shadow-teal-500/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-white/10 bg-slate-900/50">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Rechercher une ville..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setHighlightedIndex(-1);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/10 focus:border-teal-400/50 focus:outline-none transition-all text-base font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/30 scrollbar-track-transparent">
                  <button
                    type="button"
                    onClick={() => handleSelectCity("all")}
                    onMouseEnter={() => setHighlightedIndex(-1)}
                    className={`w-full px-6 py-5 text-left font-semibold text-base transition-all ${selectedCity === "all" ? "bg-teal-500/20 text-teal-300 border-l-4 border-teal-400" : highlightedIndex === -1 ? "bg-white/10 text-white" : "text-white hover:bg-white/5"}`}
                    role="option"
                    aria-selected={selectedCity === "all"}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0" />
                      Toutes les localisations
                    </span>
                  </button>

                  {filteredCities.length > 0 ? (
                    filteredCities.map((city: any, index: number) => (
                      <button
                        key={city?.id || `city-${index}`}
                        type="button"
                        onClick={() => handleSelectCity(city?.id)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full px-6 py-5 text-left font-semibold text-base transition-all ${selectedCity === city?.id ? "bg-teal-500/20 text-teal-300 border-l-4 border-teal-400" : highlightedIndex === index ? "bg-white/10 text-white" : "text-white hover:bg-white/5"}`}
                        role="option"
                        aria-selected={selectedCity === city?.id}
                      >
                        <span className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0" />
                          {city?.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-slate-400 text-base">
                      Aucune ville trouvée pour "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
// export default VendorFilters;
export function VendorList({ data, onVendorClick }: VendorListProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const cityOptions = useMemo(() => {
    const cityMap = new Map<string, City>();
    data.forEach(
      (v) =>
        v.city && !cityMap.has(v.city.id) && cityMap.set(v.city.id, v.city),
    );
    return Array.from(cityMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [data]);

  const filteredVendors = useMemo(
    () =>
      data.filter((v) => selectedCity === "all" || v.city?.id === selectedCity),
    [data, selectedCity],
  );

  const handleVendorClick = useCallback(
    (id: string, dom?: string) => {
      onVendorClick
        ? onVendorClick(id)
        : dom && window.open(`https://${dom}`, "_blank");
    },
    [onVendorClick],
  );

  if (!data?.length)
    return (
      <div className="max-w-xl mx-auto mt-20 text-center space-y-4 p-12 bg-white rounded-[40px] border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
          <Store size={40} className="text-slate-300" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Aucun vendeur</h3>
        <p className="text-slate-500">
          Revenez un peu plus tard pour découvrir nos partenaires.
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <VendorFilters
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cityOptions={cityOptions}
      />

      {filteredVendors.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
          <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-xl font-bold text-slate-900">
            Désolé, personne ici !
          </p>
          <button
            onClick={() => setSelectedCity("all")}
            className="mt-4 text-teal-600 font-bold hover:underline"
          >
            Voir partout
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorListItem
              key={vendor.id}
              vendor={vendor}
              onClick={handleVendorClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
