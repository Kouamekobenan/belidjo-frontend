"use client";
import React, { useEffect, useRef, useState } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import { VendorRepository } from "../../infrastructure/api/vendor.api";
import { FindAllFeaturedUseCase } from "../../application/usecases/find-all-featured.usecase";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Store, Sparkles } from "lucide-react";
import Link from "next/link";

const vendorRepo = new VendorRepository();
const findAllFeaturedUseCase = new FindAllFeaturedUseCase(vendorRepo);

export default function Carrosel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const vendors = await findAllFeaturedUseCase.execute();
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

  const resetAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (vendors.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [vendors.length, currentIndex]);

  const handleNext = () => {
    if (isAnimating || vendors.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % vendors.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating || vendors.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + vendors.length) % vendors.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    resetAutoScroll();
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-100 rounded-xl w-64"></div>
          <div className="h-[520px] bg-slate-50 rounded-3xl border border-slate-100"></div>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="text-center py-24 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
          <Store className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-400 font-medium">
            Aucun vendeur vedette disponible.
          </p>
        </div>
      </div>
    );
  }

  const currentVendor = vendors[currentIndex];
  const otherVendors = vendors.filter((_, i) => i !== currentIndex);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-20 space-y-16">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-2">
          {/* Label */}
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-teal-600">
            <span className="w-4 h-px bg-teal-500"></span>
            Sélection de la semaine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tight">
            Vendeurs
            <br />
            <span className="text-teal-500">en vedette</span>
          </h2>
        </div>

        <Link
          href="/vendor/vendorform"
          className="group self-start sm:self-auto inline-flex items-center gap-2.5 bg-slate-900 text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-teal-600 transition-colors duration-300"
        >
          <Store className="w-4 h-4" />
          Démarrer ma boutique
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── MAIN CARD ── */}
      <div className="relative group/card">
        <div
          key={currentIndex}
          className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/60"
          style={{ animation: "fadeSlide 0.5s ease both" }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="relative w-full lg:w-[55%] aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden bg-slate-100 flex-shrink-0">
              <Image
                src={currentVendor.site.logoUrl}
                alt={currentVendor.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
                priority
              />
              {/* Subtle dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 lg:to-white/30 pointer-events-none" />

              {/* Badge */}
              <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-amber-600 text-xs font-bold px-3.5 py-2 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Vedette
              </div>

              {/* Counter pill on mobile */}
              <div className="absolute bottom-5 right-5 lg:hidden bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {currentIndex + 1} / {vendors.length}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-8 md:p-12 lg:p-14">
              <div className="space-y-5">
                {/* Counter desktop */}
                <p className="hidden lg:block text-xs font-bold tracking-widest uppercase text-slate-400">
                  {String(currentIndex + 1).padStart(2, "0")} —{" "}
                  {String(vendors.length).padStart(2, "0")}
                </p>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  {currentVendor.name}
                </h3>

                {currentVendor.site?.description && (
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md">
                    {currentVendor.site.description}
                  </p>
                )}

                <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4 max-w-md">
                  <span className="text-teal-500 text-lg mt-0.5">✦</span>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Découvrez une sélection unique de produits soigneusement
                    choisis pour vous.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
                <Link
                  href={`/products/ui/page/${currentVendor.id}`}
                  className="group/btn inline-flex items-center gap-3 bg-slate-900 hover:bg-teal-600 text-white font-semibold text-sm px-7 py-4 rounded-xl transition-colors duration-300"
                >
                  <Store className="w-4 h-4" />
                  Visiter la boutique
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>

                {/* Pagination dots */}
                {vendors.length > 1 && (
                  <div className="flex items-center gap-2">
                    {vendors.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === currentIndex
                            ? "w-8 h-2.5 bg-teal-500"
                            : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-400"
                        }`}
                        aria-label={`Vendeur ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav arrows — appear on hover, positioned outside card on large screens */}
        {vendors.length > 1 && (
          <>
            <button
              onClick={() => {
                handlePrev();
                resetAutoScroll();
              }}
              disabled={isAnimating}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed opacity-0 group-hover/card:opacity-100 z-20"
              aria-label="Précédent"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                handleNext();
                resetAutoScroll();
              }}
              disabled={isAnimating}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed opacity-0 group-hover/card:opacity-100 z-20"
              aria-label="Suivant"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── AUTO-SCROLL TICKER ── */}
      {otherVendors.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Autres vendeurs vedettes
            </h3>
          </div>

          {/* Ticker wrapper — masks overflow and adds edge fades */}
          <div className="relative overflow-hidden">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Ticker track — duplicated for seamless loop */}
            <div className="flex gap-4 ticker-track">
              {[...otherVendors, ...otherVendors].map((vendor, idx) => {
                const originalIndex = vendors.findIndex(
                  (v) => v.id === vendor.id,
                );
                return (
                  <button
                    key={`${vendor.id}-${idx}`}
                    onClick={() => goToSlide(originalIndex)}
                    className="group/thumb flex-none w-52 md:w-60 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-teal-400 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={vendor.site.logoUrl}
                        alt={vendor.name}
                        fill
                        sizes="240px"
                        className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                      <p className="text-white font-bold text-sm leading-tight truncate">
                        {vendor.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-teal-300 text-xs font-semibold opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                        <span>Voir la boutique</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .ticker-track {
          animation: ticker 30s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
