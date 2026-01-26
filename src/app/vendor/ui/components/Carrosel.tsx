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
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Vendeurs de la semaine
        </h2>
        <div className="text-center py-12 text-slate-500">
          Aucun vendeur vedette disponible pour le moment.
        </div>
      </div>
    );
  }

  const currentVendor = vendors[currentIndex];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 leading-tight">
            Les Ambassadeurs <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-600">
              de la semaine
            </span>
          </h2>
        </div>
        <Link
          href="/vendor/vendorform"
          className="group flex items-center text-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-teal-600 transition-all duration-500 shadow-2xl shadow-slate-900/20"
        >
          <Store className="w-5 h-5 text-center text-teal-400" />
          <span className="font-bold text-center">Demarer ma boutique</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
      {/* Carrousel */}
      <div className="relative">
        {/* Carte principale */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            {/* Image du vendeur */}
            <div className="relative w-full md:w-1/2 max-w-md">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 z-10"></div>
                <Image
                  src={currentVendor.site.logoUrl}
                  alt={currentVendor.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>

              {/* Badge "Vendeur Vedette" */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg transform rotate-12 font-bold text-sm">
                ⭐ Vedette
              </div>
            </div>

            {/* Informations du vendeur */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
                  Vendeur {currentIndex + 1} sur {vendors.length}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  {currentVendor.name}
                </h3>
                {/* Description du vendeur */}
                {currentVendor.site?.description && (
                  <p className="text-slate-700 text-lg font-medium mb-3 leading-relaxed">
                    {currentVendor.site.description}
                  </p>
                )}

                {/* Message d'accroche */}
                <p className="text-slate-600 text-base bg-green-50 p-1 rounded-xl leading-relaxed">
                  Découvrez une sélection unique de produits soigneusement
                  choisis pour vous.
                </p>
              </div>
              {/* Bouton d'action */}
              <Link
                href={`/products/ui/page/${currentVendor.id}`}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 hover:bg-teal-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-teal-500/30 group transform hover:-translate-y-1 active:scale-95"
              >
                Visiter la boutique
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white hover:bg-teal-500 text-slate-900 hover:text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed z-20 hover:scale-110 active:scale-95"
              aria-label="Vendeur précédent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white hover:bg-teal-500 text-slate-900 hover:text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed z-20 hover:scale-110 active:scale-95"
              aria-label="Vendeur suivant"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Indicateurs de pagination */}
      {vendors.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          {vendors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-12 h-3 bg-gradient-to-r from-teal-500 to-blue-500"
                  : "w-3 h-3 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Aller au vendeur ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Aperçu des autres vendeurs */}
      {vendors.length > 1 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
            Autres vendeurs vedettes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vendors.map(
              (vendor, index) =>
                index !== currentIndex && (
                  <button
                    key={vendor.id}
                    onClick={() => goToSlide(index)}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <Image
                      src={vendor.site.logoUrl}
                      alt={vendor.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold text-sm">
                          {vendor.name}
                        </p>
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
