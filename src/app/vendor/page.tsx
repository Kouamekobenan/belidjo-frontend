// src/app/vendors/page.tsx
"use client";

import { ArrowRight, LogIn, Menu, X, Home, Info, Phone } from "lucide-react";
import { AnimatedHeroTitle } from "../components/features/AnimationHome";
import VendorPage from "./ui/pages/Vendor";
import Link from "next/link";
import { cityName } from "../lib/globals.type";
import Image from "next/image";
import { useEffect, useState } from "react";

// Constantes
const LOGO_SRC = "/images/bj.png";
const SCROLL_THRESHOLD = 20;

// const SCROLL_THRESHOLD = 50;
// const cityName = "Votreville"; // Remplacez par le nom de votre ville

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Navbar Desktop */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/page"
              className="flex items-center space-x-2 group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg transition-all"
              aria-label={`Retour à l'accueil de ${cityName}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 blur group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={LOGO_SRC}
                    width={80}
                    height={80}
                    alt={`Logo ${cityName}`}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <span
                className={`text-2xl font-black transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                  {cityName}
                </span>
              </span>
            </Link>
            {/* Menu Desktop - Placeholder pour navigation future */}
            <div
              className="flex items-center space-x-6"
              aria-label="Menu principal"
            ></div>

            {/* Bouton Connexion Desktop */}
            <div className="flex items-center space-x-4">
              <Link
                href="/users/ui/login"
                className="group inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Connexion Vendeur</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Mobile - En haut (simplifié) */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="px-4 py-3">
          <Link
            href="/page"
            className="flex items-center justify-center space-x-2 group"
            aria-label={`Retour à l'accueil de ${cityName}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 blur group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                <Image
                  src={LOGO_SRC}
                  width={80}
                  height={80}
                  alt={`Logo ${cityName}`}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="text-xl font-black">
              <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                {cityName}
              </span>
            </span>
          </Link>
        </div>
      </header>

      {/* Navigation Mobile Bottom - Style App */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-3 h-16">
          {/* Accueil */}
          <Link
            href="/page"
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
          >
            <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Accueil</span>
          </Link>

          {/* Contact (placeholder) */}
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
          >
            <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Menu</span>
          </button>

          {/* Connexion */}
          <Link
            href="/users/ui/login"
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
          >
            <div className="relative">
              <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xs font-medium">Connexion</span>
          </Link>
        </div>
      </nav>

      {/* Modal Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200">
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br bg-teal-500 rounded-lg flex items-center justify-center shadow-md">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Menu</h3>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="px-4 py-6 space-y-4">
              {/* Section Information */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Information
                </p>
                <div className="space-y-2">
                  <Link
                    href="/page"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Info className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        À propos
                      </p>
                      <p className="text-xs text-gray-500">
                        Découvrez notre plateforme
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/page"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Contact
                      </p>
                      <p className="text-xs text-gray-500">Besoin d'aide ?</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bouton Connexion Vendeur */}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/users/ui/login"
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-center gap-2 w-full px-5 py-4 text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-xl shadow-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 group"
                >
                  <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  <span>Connexion Vendeur</span>
                </Link>
              </div>
              {/* Section Suivez-nous (placeholder) */}
            </div>
          </div>
        </div>
      )}

      {/* Spacer pour le contenu (mobile) */}
      <div className="md:hidden h-[60px]" />
      <div className="md:hidden h-16" />
    </>
  );
};

// Composant Bouton d'aide flottant

// Composant Section Héro
const HeroSection = () => {
  return (
    <section
      className="relative h-[480px] sm:h-[480px] md:h-[480px] w-full flex items-center justify-center text-white text-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Arrière-plan avec dégradé */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-teal-600 via-green-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

        {/* Effet de grille animé */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px),
                             repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`,
            }}
          ></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 px-4 sm:px-6 w-full max-w-5xl">
        <AnimatedHeroTitle />

        {/* Caractéristiques */}
        <div className="mt-6 animate-fade-in-up">
          <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium px-4">
            <span className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full absolute"></span>
                <span>Livraison rapide</span>
              </span>
              <span className="text-white/60 hidden sm:inline">•</span>
              <span>Vendeurs specialiser</span>
            </span>
          </p>
        </div>

        {/* Bouton CTA */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Link
            href="/vendor/vendorform"
            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600"
          >
            {/* Effet de brillance au survol */}
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

            <span className="relative flex items-center">
              Créer ma boutique
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Composant principal de la page
export default function Vendors() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Section Héro */}
      <HeroSection />

      {/* Contenu principal */}
      <main className="relative z-0">
        <VendorPage />
      </main>
    </div>
  );
}
