"use client";
import React, { useEffect, useState } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import { VendorRepository } from "../../infrastructure/api/vendor.api";
import { FindAllFeaturedUseCase } from "../../application/usecases/find-all-featured.usecase";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Store } from "lucide-react";
import Link from "next/link";

const vendorRepo = new VendorRepository();
const findAllFeaturedUseCase = new FindAllFeaturedUseCase(vendorRepo);

export default function Carrosel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const vendors = await findAllFeaturedUseCase.execute();
      console.log("featured vendors", vendors);
      setVendors(vendors);
    } catch (error) {
      console.error("Erreur lors du chargement des vendeurs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Auto-défilement toutes les 5 secondes
  useEffect(() => {
    if (vendors.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [vendors.length, currentIndex]);

  const handleNext = () => {
    if (isAnimating || vendors.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % vendors.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating || vendors.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + vendors.length) % vendors.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl w-72 mb-10"></div>
          <div className="h-[500px] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
          Vendeurs de la semaine
        </h2>
        <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Store className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">
            Aucun vendeur vedette disponible pour le moment.
          </p>
        </div>
      </div>
    );
  }

  const currentVendor = vendors[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl flex gap-2 md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
            <span>Les vendeurs  </span>
            <span className="block text-transparent bg-clip-text bg-teal-500 ">
                 en vedette
            </span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            Découvrez nos meilleurs partenaires commerciaux
          </p>
        </div>
        <Link
          href="/vendor/vendorform"
          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 md:px-8 py-4 md:py-5 rounded-2xl hover:from-teal-600 hover:to-teal-500 transition-all duration-500 shadow-xl shadow-slate-900/25 hover:shadow-teal-500/30 hover:scale-105 active:scale-100"
        >
          <Store className="w-5 h-5 text-teal-400 group-hover:text-white transition-colors" />
          <span className="font-bold whitespace-nowrap">
            Démarrer ma boutique
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      {/* Carrousel */}
      <div className="relative">
        {/* Carte principale */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
          {/* Arrière-plan décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-blue-50/30 to-purple-50/50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row md:items-center gap-0 md:gap-8">
            {/* Image du vendeur - Format bannière sur mobile */}
            <div className="relative w-full md:w-1/2">
              {/* Sur mobile: bannière pleine largeur */}
              <div className="relative w-full aspect-[16/9] md:aspect-square md:rounded-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-blue-600/10 to-purple-600/20 z-10"></div>
                <Image
                  src={currentVendor.site.logoUrl}
                  alt={currentVendor.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  priority
                />

                {/* Overlay gradient en bas pour mobile */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent md:hidden z-10"></div>
              </div>

              {/* Badge "Vendeur Vedette" */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg transform rotate-3 md:rotate-12 font-bold text-xs md:text-sm z-20 flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span>Vedette</span>
              </div>
            </div>

            {/* Informations du vendeur */}
            <div className="flex-1 p-6 md:p-12 text-center md:text-left space-y-6">
              <div className="space-y-4">
                {/* Badge compteur */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 rounded-full text-sm font-bold shadow-sm">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                  Vendeur {currentIndex + 1} sur {vendors.length}
                </div>

                {/* Nom du vendeur */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
                  {currentVendor.name}
                </h3>

                {/* Description du vendeur */}
                {currentVendor.site?.description && (
                  <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto md:mx-0">
                    {currentVendor.site.description}
                  </p>
                )}

                {/* Message d'accroche */}
                <div className="inline-block bg-gradient-to-r from-green-50 to-teal-50 border border-green-200/50 px-6 py-3 rounded-2xl shadow-sm">
                  <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed flex items-center gap-2">
                    <span className="text-green-500 text-xl">✨</span>
                    Découvrez une sélection unique de produits soigneusement
                    choisis pour vous.
                  </p>
                </div>
              </div>

              {/* Bouton d'action */}
              <Link
                href={`/products/ui/page/${currentVendor.id}`}
                className="inline-flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-teal-600 hover:to-teal-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-slate-900/25 hover:shadow-teal-500/40 group transform hover:-translate-y-1 active:scale-95 w-full md:w-auto"
              >
                <Store className="w-5 h-5" />
                <span>Visiter la boutique</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Boutons de navigation */}
        {vendors.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm hover:bg-teal-500 text-slate-900 hover:text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed z-30 hover:scale-110 active:scale-95 border border-slate-200"
              aria-label="Vendeur précédent"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm hover:bg-teal-500 text-slate-900 hover:text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed z-30 hover:scale-110 active:scale-95 border border-slate-200"
              aria-label="Vendeur suivant"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Indicateurs de pagination */}
      {vendors.length > 1 && (
        <div className="flex justify-center items-center gap-2 md:gap-3 mt-8">
          {vendors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-10 md:w-12 h-3 bg-gradient-to-r from-teal-500 via-teal-400 to-blue-500 shadow-lg shadow-teal-500/50"
                  : "w-3 h-3 bg-slate-300 hover:bg-slate-400 hover:scale-125"
              }`}
              aria-label={`Aller au vendeur ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Aperçu des autres vendeurs */}
      {vendors.length > 1 && (
        <div className="mt-12 md:mt-16">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 md:mb-8 text-center flex items-center justify-center gap-3">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-teal-500"></span>
            Autres vendeurs vedettes
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-teal-500"></span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {vendors.map(
              (vendor, index) =>
                index !== currentIndex && (
                  <button
                    key={vendor.id}
                    onClick={() => goToSlide(index)}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-teal-500"
                  >
                    <Image
                      src={vendor.site.logoUrl}
                      alt={vendor.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white font-bold text-sm md:text-base mb-1">
                          {vendor.name}
                        </p>
                        <div className="flex items-center gap-2 text-teal-400 text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span>Voir la boutique</span>
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
