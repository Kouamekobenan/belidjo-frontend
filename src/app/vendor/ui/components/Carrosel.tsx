"use client";
import React, { useEffect, useState } from "react";
import { Vendor } from "../../domain/entities/vendor.entity";
import { VendorRepository } from "../../infrastructure/api/vendor.api";
import { FindAllFeaturedUseCase } from "../../application/usecases/find-all-featured.usecase";
import Image from "next/image";
import { ArrowRight, Store, Sparkles } from "lucide-react";
import Link from "next/link";

const vendorRepo = new VendorRepository();
const findAllFeaturedUseCase = new FindAllFeaturedUseCase(vendorRepo);

// ── ANIMATED CTA BUTTON ──────────────────────────────────────────────────────

const LINE_H = 24;
const phrases = [
  { text: "Vendre sur NoBoutik", bg: "from-orange-500 to-orange-600" },
  { text: "Ouvrir ma boutique", bg: "from-green-500 to-green-600" },
  { text: "Boostez vos revenus", bg: "from-indigo-600 to-blue-700" },
];

function AnimatedShopButton() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % phrases.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Link
      href="/vendor/vendorform"
      className={`relative group inline-flex items-center justify-between gap-3 sm:gap-4 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r ${phrases[idx].bg} text-white font-bold text-sm tracking-wide shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-700 overflow-hidden border border-white/20 w-full sm:w-auto max-w-md sm:max-w-none`}
      style={{ minWidth: 320 }}
    >
      {/* Shimmer Light Beam Effect */}
      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />

      {/* Left Icon */}
      <div className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 p-1.5 overflow-hidden">
        <img src="/images/shop.png" alt="Shop Icon" className="w-full h-full object-contain" />
      </div>

      {/* Fluid Crisp Text Transition */}
      <div className="relative z-10 flex-1 h-6 overflow-hidden min-w-[180px] sm:min-w-[210px]">
        {phrases.map((phrase, i) => (
          <span
            key={i}
            className={`absolute inset-0 flex items-center justify-center text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] whitespace-nowrap transition-all duration-700 ease-in-out ${
              i === idx
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {phrase.text}
          </span>
        ))}
      </div>

      {/* Right Arrow */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white text-slate-900 group-hover:bg-white group-hover:scale-105 group-hover:translate-x-1 transition-all duration-300 shadow-md flex-shrink-0">
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </div>

      {/* Floating Sparkle */}
      <Sparkles className="absolute right-3 top-2 w-3.5 h-3.5 text-white/70 opacity-60 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-45 transition-all duration-500 pointer-events-none" />
    </Link>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Carrosel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-900 animate-pulse pt-14 md:pt-[88px]">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
          <div className="h-6 bg-slate-700 rounded-lg w-48" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex-none w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-800"
              />
            ))}
          </div>
          <div className="h-12 bg-slate-700 rounded-2xl w-72 mx-auto" />
        </div>
      </div>
    );
  }
  if (vendors.length === 0) return null;

  // Triple les vendeurs pour le scroll infini
  const tripleVendors = [...vendors, ...vendors, ...vendors];

  return (
    <section className="w-full bg-slate-900 relative overflow-hidden pt-14 md:pt-[88px]">
      {/* Glows décoratifs subtils */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 sm:py-14 space-y-8 sm:space-y-10">
        {/* ── Titre ── */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-green-400" />
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Boutiques en vedette
          </h2>
          <div className="hidden sm:block flex-1 h-px bg-white/10 ml-2" />
        </div>

        {/* ── Ticker infini ── */}
        <div className="relative -mx-4">
          {/* Fondu bords */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 sm:gap-5 animate-infinite-scroll hover:pause-animation">
            {tripleVendors.map((vendor, idx) => (
              <Link
                key={`${vendor.id}-${idx}`}
                href={`/products/ui/page/${vendor.id}`}
                className="group flex-none w-32 sm:w-40 md:w-44"
              >
                {/* Card */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-green-400/60 transition-all duration-300 shadow-lg group-hover:shadow-green-500/20 group-hover:-translate-y-1">
                  <Image
                    src={vendor.site.logoUrl}
                    alt={vendor.name}
                    fill
                    sizes="(max-width: 640px) 128px, 176px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Hover text */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex items-center gap-1 text-green-300 text-[10px] sm:text-xs font-bold">
                      <span>Voir</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                {/* Nom */}
                <p className="mt-2.5 text-xs sm:text-sm font-bold text-white/80 group-hover:text-green-400 transition-colors truncate text-center">
                  {vendor.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA Bouton centré ── */}
        <div className="flex justify-center pt-2">
          <AnimatedShopButton />
        </div>
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
          animation: infinite-scroll 30s linear infinite;
          width: max-content;
          display: flex;
        }

        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
