"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import { VendorRepository } from "../../infrastructure/api/vendor.api";
import { FindAllFeaturedUseCase } from "../../application/usecases/find-all-featured.usecase";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Store, Sparkles } from "lucide-react";
import Link from "next/link";

const vendorRepo = new VendorRepository();
const findAllFeaturedUseCase = new FindAllFeaturedUseCase(vendorRepo);

// ── ANIMATED CTA BUTTON ──────────────────────────────────────────────────────

const LINE_H = 24; // Hauteur de ligne précise
const phrases = [
  { text: "Vendre sur NoBoutik", bg: "from-orange-500 to-orange-600" },
  { text: "Ouvrir ma boutique", bg: "from-teal-500 to-teal-600" },
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
      {/* Effet de reflet "Glossy" (Style Jumia/Premium) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icône de gauche avec pulsation légère */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
        <Store className="w-4 h-4 text-white" />
      </div>

      {/* Zone de texte coulissante */}
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

      {/* Flèche animée avec éclat */}
      <div className="relative z-10">
        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300 ease-out" />
      </div>

      {/* Animation d'étincelles discrète au survol */}
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
  // On triple les éléments pour garantir qu'il n'y ait jamais de vide visuel
  const tripleVendors = [...otherVendors, ...otherVendors, ...otherVendors];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Explorez d'autres boutiques
        </h3>
      </div>

      <div className="relative overflow-hidden group">
        {/* Gradients de fondu sur les bords */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-600 via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-gray-600 via-white/80 to-transparent z-10 pointer-events-none" />
        {/* Le conteneur qui défile sans fin */}
        <div className="flex gap-5 animate-infinite-scroll group-hover:pause-animation">
          {tripleVendors.map((vendor, idx) => {
            const originalIndex = vendors.findIndex((v) => v.id === vendor.id);
            return (
              <button
                key={`${vendor.id}-${idx}`}
                onClick={() => goToSlide(originalIndex)}
                className="flex-none w-56 md:w-64 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-teal-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
                  <div className="flex items-center gap-1 mt-1 text-teal-300 text-xs font-bold">
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
    }, 6000);
  }, [vendors.length]);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [resetAutoScroll, currentIndex]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    resetAutoScroll();
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (loading || vendors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3 mb-8" />
        <div className="h-96 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  const currentVendor = vendors[currentIndex];
  const otherVendors = vendors.filter((_, i) => i !== currentIndex);

  return (
    <section className="w-full py-16 md:py-24 space-y-20">
      {/* Header - full bleed, sans marge gauche/droite */}
      <div className="relative overflow-hidden shadow-2xl shadow-slate-900/30">
        {/* Photo de fond */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bannière-photo.jpeg"
            alt="Bannière Noboutik"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-teal-900/70" />
        </div>

        {/* Glows décoratifs (cohérents avec la bannière du site) */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-12 md:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-widest uppercase text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Noboutik
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-none whitespace-nowrap">
              Vendeurs <span className="text-teal-400">Vedettes</span>
            </h2>
            <p className="hidden sm:block text-slate-300 text-base md:text-lg max-w-md font-medium">
              Découvrez les boutiques les plus populaires du moment et lancez la vôtre dès aujourd'hui.
            </p>
          </div>
          <div className="shrink-0 lg:self-center">
            <AnimatedShopButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-20">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div
            key={currentIndex}
            className="flex flex-col lg:flex-row animate-fade-in"
          >
            <div className="relative w-full lg:w-3/5 aspect-video lg:aspect-auto lg:min-h-[520px] overflow-hidden">
              <Image
                src={currentVendor.site.logoUrl}
                alt={currentVendor.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-xl">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Top Shop
                </span>
              </div>
            </div>
            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center space-y-8">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {currentVendor.name}
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed italic">
                "
                {currentVendor.site?.description ||
                  "Une expérience shopping unique à découvrir sur Noboutik."}
                "
              </p>
              <Link
                href={`/products/ui/page/${currentVendor.id}`}
                className="group/btn inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300"
              >
                <Store className="w-10 h-5" />
                Visiter maintenant
                <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        {/* Infinite Ticker Section */}
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
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
