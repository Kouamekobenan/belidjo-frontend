// src/app/vendors/page.tsx
"use client";

import { ArrowRight, LogIn, Menu, X, HelpCircle } from "lucide-react";
import { AnimatedHeroTitle } from "../components/features/AnimationHome";
import VendorPage from "./ui/pages/Vendor";
import Link from "next/link";
import { cityName } from "../lib/globals.type";
import Image from "next/image";
import { useEffect, useState } from "react";

// Constantes
const LOGO_SRC = "/images/bj.png";
const SCROLL_THRESHOLD = 20;

// Composant Navbar séparé et optimisé
export const Navbar = () => {
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/page"
            className="flex items-center space-x-2 group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg transition-all"
            aria-label={`Retour à l'accueil de ${cityName}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 blur group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center overflow-hidden">
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
              className={`text-lg sm:text-xl md:text-2xl font-black transition-colors duration-300 ${
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
            className="hidden md:flex items-center space-x-6"
            aria-label="Menu principal"
          ></div>

          {/* Bouton Connexion Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/users/ui/login"
              className="group inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              <span>Connexion Vendeur</span>
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100/20 focus:outline-none focus:ring-2 focus:ring-teal-500 flex-shrink-0"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X
                className={`w-6 h-6 transition-colors ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 transition-colors ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile avec animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/users/ui/login"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center space-x-2 w-full px-5 py-3 text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Connexion Vendeur</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Composant Bouton d'aide flottant
const FloatingHelpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher le bouton après un court délai
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link
      href="/page"
      className={`fixed left-6 bottom-6 z-40 group transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
      aria-label="Besoin d'aide ?"
    >
      <div className="relative">
        {/* Effet de pulsation */}
        <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-75"></div>

        {/* Bouton principal */}
        <div className="relative flex items-center bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group-hover:from-teal-700 group-hover:to-green-700">
          {/* Icône seule sur mobile */}
          <div className="flex items-center justify-center w-14 h-14 sm:hidden">
            <HelpCircle className="w-6 h-6" />
          </div>
          {/* Bouton complet sur desktop */}
          <div className="hidden sm:flex items-center space-x-2 px-5 py-3">
            <HelpCircle className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="font-semibold text-sm whitespace-nowrap">
              Besoin d'aide ?
            </span>
          </div>
        </div>

        {/* Tooltip pour mobile */}
        <div className="sm:hidden absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Besoin d'aide ?
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
      </div>
    </Link>
  );
};

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
              <span>Paiement sécurisé</span>
              <span className="text-white/60 hidden sm:inline">•</span>
              <span>Prix imbattables</span>
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

      {/* Bouton d'aide flottant */}
      <FloatingHelpButton />
    </div>
  );
}
