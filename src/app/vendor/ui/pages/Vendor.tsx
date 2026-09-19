import { useEffect, useState, useCallback } from "react";
import { getVendorsUseCase } from "../../application/usecases/get-vendors.usecase";
import { VendorList } from "../components/Vendor-list";
import { Vendor } from "../../domain/entities/vendor.entity";
import { Store, AlertTriangle, RefreshCw, Sparkles } from "lucide-react";

const FilterSkeleton = () => (
  <div className="bg-gradient-to-r from-green-50 via-green-50 to-green-50 rounded-2xl shadow-xl p-6 animate-pulse">
    <div className="h-6 bg-green-200 rounded-lg w-48 mb-4"></div>
    <div className="h-12 bg-white/80 rounded-xl w-full max-w-lg shadow-inner"></div>
  </div>
);

/**
 * Skeleton pour un élément de la liste de vendeurs
 */
const VendorItemSkeleton = () => (
  <li className="flex flex-col items-center gap-2.5 animate-pulse">
    {/* Circle placeholder */}
    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-[3px] border-slate-100" />
    {/* Text placeholders */}
    <div className="flex flex-col items-center gap-1">
      <div className="h-3 sm:h-3.5 bg-slate-200 rounded-full w-16 sm:w-20" />
      <div className="h-2.5 bg-slate-100 rounded-full w-12 sm:w-14" />
    </div>
  </li>
);

/**
 * Composant Squelette complet de la liste
 */
const VendorListSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <FilterSkeleton />
    <ul
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6 mt-8"
      role="list"
      aria-label="Chargement des partenaires"
    >
      {Array.from({ length: 14 }, (_, index) => (
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
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-100 rounded-full mb-4 p-4">
        <img src="/images/shop.png" alt="Shop" className="w-full h-full object-contain" />
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

    <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
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
          <span className="bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
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
      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
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
      // console.log("Vendeurs chargés 11:", data);
      setVendors(data);
    } catch (e) {
      console.error("Erreur lors du chargement des vendeurs:", e);
      setError(
        "Impossible de charger les données des partenaires. Veuillez vérifier votre connexion internet et réessayer.",
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
          return id;
        }}
      />
    );
  };
//  py-2 sm:py-5 px-2 sm:px-3 lg:px-8
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <PageHeader />

      <main className="mt-8" role="main" aria-label="Liste des partenaires">
        {renderContent()}
      </main>
    </div>
  );
}
