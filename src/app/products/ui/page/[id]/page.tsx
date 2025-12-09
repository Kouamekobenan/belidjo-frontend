// src/app/vendor/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import VendorProducts from "../../components/GetProduct";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import VendorNavBar from "@/app/components/layout/Vendor-NavBar";
import Image from "next/image";
import CategoriesList from "@/app/categories/ui/components/FindCategory";
import { VendorFooter } from "@/app/components/layout/Vendor-Footer";

interface Site {
  id: string;
  vendorId: string;
  domain: string;
  description: string;
  logoUrl: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cityName: string;
}

interface Vendor {
  id: string;
  userId: string;
  name: string;
  cityId: string;
  site: Site;
  user: User;
}

export default function VendorProductsPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/vendor/${id}`);
        setVendor(res.data.data);
      } catch (err) {
        setError("Impossible de charger les informations du vendeur");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <VendorNavBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
            {/* Banner Skeleton */}
            <div className="h-80 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
            {/* Content Skeleton */}
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-slate-200 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-32"></div>
                  <div className="h-10 bg-slate-200 rounded w-80"></div>
                  <div className="h-4 bg-slate-200 rounded w-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Error State
  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <VendorNavBar />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Vendeur introuvable
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              {error || "Ce vendeur n'existe pas ou a été supprimé"}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Destruction pour des variables plus propres
  const { name, id: vendorId, site } = vendor;
  const bannerImageUrl = site?.logoUrl || "/images/img.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <VendorNavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Vendor Header Card avec Design Premium */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-3xl">
          {/* BANNIÈRE DE COUVERTURE - Grande et Impactante */}
          <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <Image
              src={bannerImageUrl}
              alt={`Bannière ${name}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Overlay gradient pour meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            {/* Badge Premium en haut à droite */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-slate-800">
                  Boutique Vérifiée
                </span>
              </div>
            </div>
          </div>
          {/* Contenu Principal - Sous la bannière */}
          <div className="relative px-8 pb-8">
            {/* Logo flottant qui chevauche la bannière */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
              {/* Logo Container avec bordure blanche */}
              <div className="flex-shrink-0 bg-white p-2 rounded-3xl shadow-sm ring-4 ring-white">
                {site?.logoUrl ? (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden">
                    <Image
                      src={bannerImageUrl}
                      fill
                      alt={`Logo ${name}`}
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {/* Informations du vendeur */}
              <div className="flex-1 pt-12">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                    Boutique
                  </span>
                  {site?.domain && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      En ligne
                    </span>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 leading-tight">
                  {name}
                </h1>
                {/* Informations supplémentaires */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">
                      ID: {vendorId.slice(0, 8)}...
                    </span>
                  </div>
                  {site?.domain && (
                    <a
                      href={`https://${site.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm group"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                        <svg
                          className="w-4 h-4 text-teal-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-teal-600 group-hover:text-teal-700 group-hover:underline">
                        {site.domain}
                      </span>
                      <svg
                        className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
                {/* Description si disponible */}
                {site?.description && (
                  <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      {site.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Statistiques ou actions (optionnel) */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">4.8</p>
                    <p className="text-sm text-slate-600">Note moyenne</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">156</p>
                    <p className="text-sm text-slate-600">Produits</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">2.4k</p>
                    <p className="text-sm text-slate-600">Avis clients</p>
                  </div>
                </div>
                {/* Boutons d'action */}
                <div className="flex items-center gap-3">
                  <button className="px-6 cursor-pointer py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
                    Suivre
                  </button>
                  <button className="px-6 py-3 cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-95 transition-all duration-200">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products Section */}
        <CategoriesList vendorId={vendorId} />
        <VendorProducts vendorId={id as string} />
        <VendorFooter
          name={vendor.name}
          site={vendor.site}
          user={vendor.user}
        />
      </div>
    </div>
  );
}
