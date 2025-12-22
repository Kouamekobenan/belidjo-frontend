import { useEffect, useState, useCallback } from "react";
import { getVendorsUseCase } from "../../application/usecases/get-vendors.usecase";
import { VendorList } from "../components/Vendor-list";
import { Vendor } from "../../domain/entities/vendor.entity";
import { Store, AlertTriangle, RefreshCw, Sparkles } from "lucide-react";

// =============================================================================
// COMPOSANTS DE CHARGEMENT (SKELETONS)
// =============================================================================

/**
 * Skeleton pour le filtre de recherche
 */
const FilterSkeleton = () => (
  <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 rounded-2xl shadow-xl p-6 animate-pulse">
    <div className="h-6 bg-teal-200 rounded-lg w-48 mb-4"></div>
    <div className="h-12 bg-white/80 rounded-xl w-full max-w-lg shadow-inner"></div>
  </div>
);

/**
 * Skeleton pour un élément de la liste de vendeurs
 */
const VendorItemSkeleton = () => (
  <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pulse">
    {/* Logo Placeholder */}
    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0"></div>

    {/* Informations du vendeur */}
    <div className="flex-1 space-y-3 min-w-0">
      <div className="h-7 bg-gray-300 rounded-lg w-3/5"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-2/5"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-3 bg-gray-100 rounded-lg w-4/5"></div>
    </div>

    {/* Bouton d'action */}
    <div className="h-11 w-full sm:w-40 bg-teal-300 rounded-lg sm:flex-shrink-0"></div>
  </li>
);

/**
 * Composant Squelette complet de la liste
 */
const VendorListSkeleton = () => (
  <div className="space-y-6 max-w-6xl mx-auto">
    <FilterSkeleton />

    <ul
      className="space-y-5 mt-8"
      role="list"
      aria-label="Chargement des partenaires"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <VendorItemSkeleton key={`skeleton-${index}`} />
      ))}
    </ul>
  </div>
);

// =============================================================================
// COMPOSANTS D'ÉTAT
// =============================================================================

/**
 * Composant affiché en cas d'erreur de chargement
 */
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div
    className="text-center max-w-md mx-auto p-8 bg-red-50 border-2 border-red-200 rounded-2xl shadow-xl"
    role="alert"
    aria-live="assertive"
  >
    <div className="mb-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-red-900 mb-3">
        Erreur de Connexion
      </h2>
      <p className="text-red-700 leading-relaxed">{message}</p>
    </div>

    <button
      onClick={onRetry}
      className="group inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      aria-label="Réessayer de charger les partenaires"
    >
      <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
      Réessayer
    </button>
  </div>
);

/**
 * Composant affiché quand la liste est vide
 */
const EmptyState = () => (
  <div className="text-center max-w-md mx-auto p-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
    <div className="mb-6">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full mb-4">
        <Store className="h-12 w-12 text-teal-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Aucun Partenaire Disponible
      </h2>
      <p className="text-gray-600 leading-relaxed">
        Notre réseau de partenaires est en cours de mise à jour.
        <br className="hidden sm:inline" />
        Revenez bientôt pour découvrir de nouvelles boutiques !
      </p>
    </div>

    <div className="flex items-center justify-center gap-2 text-sm text-teal-600 font-medium">
      <Sparkles className="h-4 w-4" />
      <span>De nouveaux partenaires arrivent prochainement</span>
    </div>
  </div>
);

// =============================================================================
// COMPOSANT D'EN-TÊTE
// =============================================================================

/**
 * En-tête de la page avec titre et description
 */
const PageHeader = () => (
  <header className="mb-12 pb-8 border-b border-gray-200">
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
          Catalogue de nos{" "}
          <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Partenaires
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
          Découvrez les boutiques et services disponibles sur notre plateforme
        </p>
      </div>
    </div>

    {/* Badge de statut */}
    <div className="mt-6 flex justify-center sm:justify-start">
      <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
        Partenaires actifs
      </span>
    </div>
  </header>
);

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

/**
 * Page principale d'affichage des vendeurs/partenaires
 */
export default function VendorPage() {
  // États
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fonction pour charger les données des vendeurs
   */
  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getVendorsUseCase();
      setVendors(data);
    } catch (e) {
      console.error("Erreur lors du chargement des vendeurs:", e);
      setError(
        "Impossible de charger les données des partenaires. Veuillez vérifier votre connexion internet et réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chargement initial des données
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  /**
   * Détermine le contenu à afficher selon l'état
   */
  const renderContent = () => {
    if (isLoading) {
      return <VendorListSkeleton />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={fetchVendors} />;
    }

    if (vendors.length === 0) {
      return <EmptyState />;
    }

    return (
      <VendorList
        data={vendors}
        onVendorClick={(id) => {
          console.log(`Vendeur sélectionné: ${id}`);
          return id;
        }}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <PageHeader />

      <main className="mt-8" role="main" aria-label="Liste des partenaires">
        {renderContent()}
      </main>
    </div>
  );
}
