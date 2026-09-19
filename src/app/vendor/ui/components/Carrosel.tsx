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
        px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl
        transition-all duration-500 ease-out
        shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]
        hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.4)]
        hover:-translate-y-1 active:scale-95
        bg-gradient-to-r ${phrases[idx].bg}
      `}
      style={{ minWidth: 280 }}
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
            transform: sliding
              ? `translateY(-${LINE_H}px)`
              : "translateY(0px)",
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
