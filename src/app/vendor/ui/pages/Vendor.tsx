import { useEffect, useState, useCallback } from "react";
import { getVendorsUseCase } from "../../application/usecases/get-vendors.usecase";
import { VendorList } from "../components/Vendor-list";
import { Vendor } from "../../domain/entities/vendor.entity";
import { Store, AlertTriangle, RefreshCw } from "lucide-react"; // Ajout de RefreshCw pour le bouton de réessai
import Image from "next/image";
import Link from "next/link";

// --- Composant Squelette de Chargement (Optimisé Responsive) ---
const VendorListSkeleton = () => (
  // Conteneur général pour le squelette
  <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
    {/* Placeholder pour le filtre (Attractif et visible comme le vrai filtre) */}
    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl shadow-xl p-6 h-40 animate-pulse">
      <div className="h-6 bg-teal-200 rounded w-1/2 mb-4"></div>
      <div className="h-12 bg-white rounded-xl w-full max-w-lg shadow-inner"></div>
    </div>

    <ul className="space-y-5 mt-8">
      {[...Array(5)].map((_, index) => (
        <li
          key={index}
          // Structure Responsive imitant VendorListItem
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4 rounded-2xl shadow-lg animate-pulse"
        >
          {/* Placeholder Logo (taille ajustée pour le responsive) */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-300 rounded-xl flex-shrink-0"></div>

          <div className="flex-1 space-y-3 min-w-0">
            {/* Nom du vendeur */}
            <div className="h-6 bg-gray-300 rounded w-3/5"></div>
            {/* Ville/Domaine */}
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            {/* Description */}
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Bouton d'action */}
          <div className="h-10 w-full sm:w-36 bg-teal-300 rounded-lg sm:flex-shrink-0"></div>
        </li>
      ))}
    </ul>
  </div>
);

// --- Composant Principal de la Page (Structure Pro et Responsive) ---
export default function VendorPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const LOGO_SRC = "/images/bj.png"; // Assurez-vous que ce chemin est correct

  // Fonction pour charger les données
  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVendorsUseCase();
      setVendors(data);
    } catch (e) {
      console.error("Erreur lors du chargement des vendeurs:", e);
      setError(
        "Désolé, nous n'avons pas pu charger les données des partenaires. Veuillez vérifier votre connexion."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Gestion de la logique de rendu
  let content;

  if (isLoading) {
    content = <VendorListSkeleton />;
  } else if (error) {
    // État d'erreur amélioré
    content = (
      <div className="text-center max-w-md mx-auto p-8 bg-red-50 border border-red-300 rounded-2xl shadow-xl">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Erreur de Connexion
        </h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchVendors}
          className="mt-4 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto shadow-md"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Réessayer
        </button>
      </div>
    );
  } else {
    if (vendors.length === 0) {
      // État de liste vide amélioré
      content = (
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <Store className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            Aucun Partenaire Actif
          </h2>
          <p className="text-gray-600 mt-2">
            Notre réseau de partenaires est en cours de mise à jour. Veuillez
            revenir plus tard.
          </p>
        </div>
      );
    } else {
      // Le composant VendorList amélioré
      content = <VendorList data={vendors} onVendorClick={(id) => id} />;
    }
  }

  return (
    // Conteneur principal (max-w-7xl, centré, plus d'espace)
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-12 border-b border-gray-200 pb-8">
        {/* Conteneur du Logo: Responsive et Visuel */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 p-2 sm:p-3 bg-white rounded-xl shadow-lg border border-gray-100">
          <Link href="/">
            <Image
              src={LOGO_SRC}
              width={80}
              height={80}
              alt="Logo Belidjo - Retour à l'accueil"
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Titres et Description (Responsive) */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Catalogue de nos **Partenaires**
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mt-2">
            Découvrez les boutiques et services disponibles sur notre
            plateforme.
          </p>
        </div>
      </header>

      {/* Affichage conditionnel basé sur l'état */}
      <main className="mt-8">{content}</main>
    </div>
  );
}
