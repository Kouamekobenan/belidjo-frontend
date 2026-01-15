import { MapPin, Store, ChevronRight, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
          className="relative w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 bg-slate-50 rounded-[20px] overflow-hidden border border-slate-100 group-hover:border-teal-100 transition-colors cursor-pointer"
          onClick={() => onClick(id, site?.domain)}
        >
          <img
            src={site.logoUrl ?? photoCouv}
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
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-teal-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-teal-500/20 group/btn"
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
const VendorFilters = ({ selectedCity, setSelectedCity, cityOptions }: any) => (
  <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-12 mb-12 shadow-2xl">
    {/* Décoration d'arrière-plan */}
    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>

    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          Explorer les <span className="text-teal-400">boutiques</span>
        </h2>
        <p className="text-slate-400 font-medium">
          Filtrez par ville pour trouver le vendeur le plus proche.
        </p>
      </div>

      <div className="relative w-full lg:max-w-md group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-teal-500 z-10" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full pl-14 pr-10 py-5 bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-lg appearance-none focus:bg-white focus:text-slate-900 transition-all outline-none cursor-pointer backdrop-blur-md"
        >
          <option value="all" className="text-slate-900">
            Toutes les localisations
          </option>
          {cityOptions.map((city: any) => (
            <option key={city.id} value={city.id} className="text-slate-900">
              {city.name}
            </option>
          ))}
        </select>
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-teal-500 rotate-90 pointer-events-none" />
      </div>
    </div>
  </div>
);
export function VendorList({ data, onVendorClick }: VendorListProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const cityOptions = useMemo(() => {
    const cityMap = new Map<string, City>();
    data.forEach(
      (v) => v.city && !cityMap.has(v.city.id) && cityMap.set(v.city.id, v.city)
    );
    return Array.from(cityMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [data]);

  const filteredVendors = useMemo(
    () =>
      data.filter((v) => selectedCity === "all" || v.city?.id === selectedCity),
    [data, selectedCity]
  );

  const handleVendorClick = useCallback(
    (id: string, dom?: string) => {
      onVendorClick
        ? onVendorClick(id)
        : dom && window.open(`https://${dom}`, "_blank");
    },
    [onVendorClick]
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
