"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import { VendorRepository } from "../../infrastructure/api/vendor.api";
import { FindAllFeaturedUseCase } from "../../application/usecases/find-all-featured.usecase";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Store,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const vendorRepo = new VendorRepository();
const findAllFeaturedUseCase = new FindAllFeaturedUseCase(vendorRepo);

// ── ANIMATED CTA BUTTON ──────────────────────────────────────────────────────

const LINE_H = 24;
const phrases = [
  { text: "Vendre sur NoBoutik", bg: "from-orange-500 to-orange-600" },
  { text: "Ouvrir ma boutique", bg: "from-emerald-500 to-emerald-600" },
  { text: "Boostez vos revenus", bg: "from-indigo-600 to-blue-700" },
];

function AnimatedShopButton() {
  const [idx, setIdx] = useState(0);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliding(true);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % phrases.length);
        setSliding(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = (idx + 1) % phrases.length;

  return (
    <Link
      href="/vendor/vendorform"
      className={`
        relative group overflow-hidden
        flex w-full sm:inline-flex sm:w-auto items-center gap-3
        px-8 py-4 rounded-2xl
        transition-all duration-500 ease-out
        shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]
        hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.4)]
        hover:-translate-y-1 active:scale-95
        bg-gradient-to-r ${phrases[idx].bg}
      `}
      style={{ minWidth: 300 }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
        <Store className="w-4 h-4 text-white" />
      </div>

      <div
        className="relative z-10 flex-1 overflow-hidden pointer-events-none"
        style={{ height: LINE_H }}
      >
        <div
          className="flex flex-col"
          style={{
            transform: sliding ? `translateY(-${LINE_H}px)` : "translateY(0px)",
            transition: sliding
              ? "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)"
              : "none",
          }}
        >
          <span
            className="flex items-center gap-2 text-sm font-extrabold text-white tracking-wide uppercase whitespace-nowrap"
            style={{ height: LINE_H }}
          >
            {phrases[idx].text}
          </span>
          <span
            className="flex items-center gap-2 text-sm font-extrabold text-white tracking-wide uppercase whitespace-nowrap"
            style={{ height: LINE_H }}
          >
            {phrases[next].text}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300 ease-out" />
      </div>

      <Sparkles className="absolute right-2 top-2 w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
    </Link>
  );
}

// ── VENDOR TICKER (INFINITE SCROLL) ──────────────────────────────────────────
interface VendorTickerProps {
  otherVendors: Vendor[];
  vendors: Vendor[];
  goToSlide: (i: number) => void;
}

function VendorTicker({ otherVendors, vendors, goToSlide }: VendorTickerProps) {
  const tripleVendors = [...otherVendors, ...otherVendors, ...otherVendors];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Explorez d&apos;autres boutiques
        </h3>
      </div>

      <div className="relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 animate-infinite-scroll group-hover:pause-animation">
          {tripleVendors.map((vendor, idx) => {
            const originalIndex = vendors.findIndex((v) => v.id === vendor.id);
            return (
              <button
                key={`${vendor.id}-${idx}`}
                onClick={() => goToSlide(originalIndex)}
                className="flex-none w-56 md:w-64 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={vendor.site.logoUrl}
                    alt={vendor.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="text-white font-bold text-sm truncate uppercase tracking-wide">
                    {vendor.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-emerald-300 text-xs font-bold">
                    <span>Voir</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Carrosel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const result = await findAllFeaturedUseCase.execute();
      setVendors(result);
    } catch (error) {
      console.error("Erreur chargement vendeurs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (vendors.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % vendors.length);
      setTimeout(() => setIsAnimating(false), 600);
    }, 5000);
  }, [vendors.length]);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [resetAutoScroll, currentIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      resetAutoScroll();
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, currentIndex, resetAutoScroll],
  );

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % vendors.length);
  }, [currentIndex, vendors.length, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + vendors.length) % vendors.length);
  }, [currentIndex, vendors.length, goToSlide]);

  // Touch handlers for swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  if (loading || vendors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
        <div className="aspect-[21/9] md:aspect-[3/1] bg-slate-100 rounded-3xl" />
        <div className="h-6 bg-slate-200 rounded-lg w-1/4 mx-auto mt-4" />
      </div>
    );
  }

  const currentVendor = vendors[currentIndex];
  const otherVendors = vendors.filter((_, i) => i !== currentIndex);

  return (
    <section className="w-full py-12 md:py-20 space-y-16">
      {/* ── HEADER BANNER ── */}
      <div className="relative overflow-hidden shadow-2xl shadow-slate-900/30">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bannière-photo.jpeg"
            alt="Bannière Noboutik"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-emerald-900/70" />
        </div>

        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-10 md:py-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-widest uppercase text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Noboutik
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none">
              Vendeurs <span className="text-emerald-400">Vedettes</span>
            </h2>
            <p className="hidden sm:block text-slate-300 text-base md:text-lg max-w-md font-medium">
              Découvrez les boutiques les plus populaires du moment et lancez la
              vôtre dès aujourd&apos;hui.
            </p>
          </div>
          <div className="shrink-0 lg:self-center">
            <AnimatedShopButton />
          </div>
        </div>
      </div>

      {/* ── MAIN CAROUSEL ── */}
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div
          className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-2xl shadow-slate-200/50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* ── IMAGE EN HAUT (pleine largeur) ── */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            {vendors.map((vendor, i) => (
              <div
                key={vendor.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  i === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <Image
                  src={vendor.site.logoUrl}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 1280px"
                />
              </div>
            ))}

            {/* Gradient overlay en bas de l'image */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Badge Top Shop */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
              <span className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-wider">
                Top Shop
              </span>
            </div>

            {/* Compteur slides */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/50 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full">
              {currentIndex + 1} / {vendors.length}
            </div>

            {/* Flèches Desktop */}
            <button
              onClick={goPrev}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white backdrop-blur rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} className="text-slate-700" />
            </button>
            <button
              onClick={goNext}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white backdrop-blur rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
              aria-label="Suivant"
            >
              <ChevronRight size={20} className="text-slate-700" />
            </button>
          </div>

          {/* ── INFO EN BAS ── */}
          <div className="relative p-5 sm:p-8 md:p-10">
            <div
              key={`info-${currentIndex}`}
              className="animate-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8"
            >
              {/* Nom + description */}
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight truncate">
                  {currentVendor.name}
                </h3>
                {/* Description cachée sur mobile */}
                <p className="hidden sm:block text-slate-500 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
                  {currentVendor.site?.description ||
                    "Une expérience shopping unique à découvrir sur Noboutik."}
                </p>
              </div>

              {/* Bouton CTA */}
              <Link
                href={`/products/ui/page/${currentVendor.id}`}
                className="group/btn inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 shrink-0 text-sm sm:text-base"
              >
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Visiter la boutique</span>
                <span className="sm:hidden">Visiter</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
              {vendors.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Aller au vendeur ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-8 h-2.5 bg-emerald-500"
                      : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── TICKER SECTION ── */}
        {otherVendors.length > 0 && (
          <VendorTicker
            otherVendors={otherVendors}
            vendors={vendors}
            goToSlide={goToSlide}
          />
        )}
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 35s linear infinite;
          width: max-content;
          display: flex;
        }

        .pause-animation {
          animation-play-state: paused;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
