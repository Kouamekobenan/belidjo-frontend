import { MapPin, Store } from "lucide-react"; // Search a été retiré car le filtre par nom/desc est enlevé
import { useCallback, useMemo, useState } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import Link from "next/link";

// --- Interfaces de Données ---
/**
 * Interface pour les données de ville.
 */
interface City {
  id: string;
  name: string;
  country?: string;
}

/**
 * Propriétés du composant principal VendorList.
 */
interface VendorListProps {
  data: Vendor[];
  /**
   * Fonction de rappel appelée lors du clic sur un vendeur.
   * Si non fournie, le composant tentera d'ouvrir le domaine du site.
   */
  onVendorClick?: (vendorId: string) => void;
}

// --- Fonctions Utilitaires ---

/**
 * Filtre la liste des vendeurs en fonction de la ville sélectionnée.
 * @param vendors La liste complète des vendeurs.
 * @param selectedCity L'ID de la ville sélectionnée, ou 'all'.
 * @returns La liste filtrée des vendeurs.
 */
const filterVendors = (vendors: Vendor[], selectedCity: string): Vendor[] => {
  return vendors.filter((vendor) => {
    // 1. Filtre par ville (ID) UNIQUEMENT
    const matchesCity =
      selectedCity === "all" || vendor.city?.id === selectedCity;

    return matchesCity;
  });
};

// --- Composant : VendorListItem ---

interface VendorListItemProps {
  vendor: Vendor;
  onClick: (vendorId: string, domain?: string) => void;
}

const VendorListItem = ({ vendor, onClick }: VendorListItemProps) => {
  const { id, name, city, site } = vendor;
  const isValidLogoUrl = site?.logoUrl?.startsWith("http");

  return (
    // Structure pro avec espacement optimisé et flexbox
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4 rounded-2xl shadow-sm hover:drop-shadow-xl transition-all duration-300">
      <div
        className="flex items-start gap-4 flex-1 cursor-pointer"
        onClick={() => onClick(id, site?.domain)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick(id, site?.domain);
          }
        }}
      >
        {/* Responsive Logo : plus petit sur mobile, taille standard sur sm+ */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 border border-gray-100 rounded-xl overflow-hidden shadow-inner">
          {isValidLogoUrl ? (
            <img
              src={site.logoUrl!}
              alt={`Logo de ${name}`}
              className="w-full h-full object-contain p-1" // 'object-contain' pour éviter la déformation
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {/* Texte responsive : font-size ajusté sur les petites tailles */}
          <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 truncate mb-1">
            {name}
          </h3>
          {city && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0 text-teal-600" />
              <span className="truncate font-medium">{city.name}</span>
            </div>
          )}
          {site?.description && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {site.description}
            </p>
          )}
        </div>
      </div>
      {/* Bouton d'Action */}
      <Link
        href={`/products/ui/page/${id}`}
        className="mt-2 sm:mt-0 px-6 cursor-pointer py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-teal-500/50 text-center text-sm sm:text-base"
        aria-label={`Visiter les produits de ${name}`}
      >
        visitez la boutique
      </Link>
    </li>
  );
};

// --- Sous-Composant : Filtres de Recherche (Simplifié et mis en avant) ---

interface VendorFiltersProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cityOptions: City[];
  resultCount: number;
}

const VendorFilters = ({
  selectedCity,
  setSelectedCity,
  cityOptions,
  resultCount,
}: VendorFiltersProps) => (
  // Conteneur attirant et visible
  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl  p-6 md:p-8 space-y-5 border border-teal-200">
    <h2 className="text-2xl font-bold text-teal-800 flex items-center gap-2">
      <MapPin className="h-7 w-7 text-teal-600" />
      Trouvez un Vendeur Près de Chez Vous
    </h2>
    {/* 1. Filtre par ville (Grande taille et bien visible) */}
    <div className="relative max-w-lg">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <MapPin className="h-6 w-6 text-teal-500" aria-hidden="true" />
      </div>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        // Classes de taille et focus améliorées pour un look "pro" et grand
        className="w-full pl-12 pr-6 py-3.5 border-2 border-teal-300 rounded-xl text-lg font-medium text-gray-900 bg-white cursor-pointer appearance-none shadow-lg transition duration-200 hover:border-teal-500 focus:ring-4 focus:ring-teal-400/50 focus:border-teal-500 outline-none"
        aria-label="Filtre par ville"
      >
        <option value="all" className="text-gray-500">
          📍 Toutes les villes
        </option>
        {cityOptions.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {/* Flèche custom pour le select */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>

    {/* Compteur de résultats */}
    <p className="text-base text-gray-700 pt-3 border-t border-teal-100">
      <span className="font-extrabold text-xl text-teal-700 mr-1">
        {resultCount}
      </span>
      vendeur{resultCount > 1 ? "s" : ""} trouvé{resultCount > 1 ? "s" : ""}.
    </p>
  </div>
);

// --- Composant Principal : Liste des Vendeurs ---

export function VendorList({ data, onVendorClick }: VendorListProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");

  // La variable searchQuery n'est plus nécessaire mais on la laisse en commentaire si besoin futur
  // const [searchQuery, setSearchQuery] = useState("");

  // Extraction des options de ville
  const cityOptions = useMemo(() => {
    const cityMap = new Map<string, City>();
    data.forEach((vendor) => {
      if (vendor.city && !cityMap.has(vendor.city.id)) {
        cityMap.set(vendor.city.id, vendor.city);
      }
    });
    const cities = Array.from(cityMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return cities;
  }, [data]);

  // Vendeurs filtrés (Uniquement par ville)
  const filteredVendors = useMemo(() => {
    // Suppression du paramètre searchQuery
    return filterVendors(data, selectedCity);
  }, [data, selectedCity]);

  // Gestion du clic sur un vendeur
  const handleVendorClick = useCallback(
    (vendorId: string, domain?: string) => {
      if (onVendorClick) {
        onVendorClick(vendorId);
      } else if (domain) {
        window.open(`https://${domain}`, "_blank", "noopener,noreferrer");
      }
    },
    [onVendorClick]
  );

  // Affichage si aucune donnée n'est passée
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto mt-8">
        <Store className="mx-auto h-16 w-16 mb-4 opacity-70 text-gray-300" />
        <p className="text-xl font-semibold">
          Pas de vendeurs disponibles pour le moment
        </p>
        <p className="text-sm mt-1">Veuillez revenir plus tard.</p>
      </div>
    );
  }

  return (
    // Conteneur principal centré et avec un padding pro
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Retrait de la description inutile et mise en évidence du filtre */}
      <VendorFilters
        // searchQuery et setSearchQuery retirés
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cityOptions={cityOptions}
        resultCount={filteredVendors.length}
      />

      {filteredVendors.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg border border-gray-100 mt-8">
          <MapPin className="mx-auto h-12 w-12 mb-3 text-teal-400" />
          <p className="text-xl font-bold text-gray-800">
            Aucun résultat trouvé pour cette ville.
          </p>
          <p className="text-sm mt-1">
            Essayez de sélectionner **Toutes les villes** pour élargir la
            recherche.
          </p>
        </div>
      ) : (
        <ul className="space-y-5 mt-8">
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
