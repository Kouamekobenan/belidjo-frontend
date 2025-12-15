"use client";
import React, { useEffect, useState } from "react";
import {
  Backpack,
  LockKeyhole,
  Zap,
  ShoppingBag,
  ArrowRight,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cityName } from "@/app/lib/globals.type";

// ============================================
// INTERFACES
// ============================================

interface Items {
  number: string;
  title: string;
  description: string;
}

// ============================================
// COMPOSANT NAVBAR
// ============================================

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const LOGO_SRC = "/images/bj.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-75 blur group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  <Image
                    src={LOGO_SRC}
                    width={80}
                    height={80}
                    alt="Logo Belidjo - Retour à l'accueil"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
            <span
              className={`text-lg sm:text-xl md:text-2xl font-black transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                {cityName}
              </span>
            </span>
          </a>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#contenu"
              className={`font-medium transition-colors hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Pourquoi nous choisir
            </a>
            <a
              href="#etapes"
              className={`font-medium transition-colors hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Comment ça marche
            </a>
            <a
              href="/vendor"
              className={`font-medium transition-colors hover:text-orange-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Nos vendeurs
            </a>
          </div>

          {/* Boutons d'action Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/users/ui/login"
              className="group inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              <span>Connexion Vendeur</span>
            </a>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100/20 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            <a
              href="#contenu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Pourquoi nous choisir
            </a>
            <a
              href="#etapes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Comment ça marche
            </a>
            <a
              href="/vendor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Nos vendeurs
            </a>
            <div className="pt-4 border-t border-gray-200">
              <a
                href="/users/ui/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-5 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg font-semibold transition-all"
              >
                <LogIn className="w-5 h-5" />
                <span>Connexion Vendeur</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// ============================================
// COMPOSANT TITRE ANIMÉ
// ============================================

const AnimatedHeroTitle = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative max-w-full overflow-hidden px-2">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight break-words">
        {/* Partie 1: "NoBoutik!" avec effet de gradient animé */}
        <span
          className={`
            inline-block
            bg-gradient-to-r from-teal-500 via-green-500 to-pink-600 
            bg-clip-text text-transparent
            animate-gradient-x
            transform transition-all duration-1000
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
          style={{
            backgroundSize: "200% auto",
          }}
        >
          NoBoutik!
        </span>

        {/* Élément décoratif - Sparkle */}
        <span className="inline-block ml-2 animate-pulse">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400 animate-spin-slow"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>

        <br />

        {/* Partie 2: Slogan avec effet de typing */}
        <span
          className={`
            inline-block
            text-white
            transform transition-all duration-1000 delay-300
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
        >
          <span className="relative">
            <span className="absolute inset-0 bg-yellow-200/30 transform -skew-x-12 animate-pulse-slow"></span>
            <span className="relative z-10">Fais tes achats </span>
          </span>
          <span className="relative inline-block">
            <span className="text-teal-400 font-extrabold animate-bounce-subtle">
              en un clic
            </span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-600 transform origin-left scale-x-0 animate-underline"></span>
          </span>
        </span>

        {/* Icône de clic animée */}
        <span className="inline-block ml-2 sm:ml-3 animate-click">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        </span>
      </h1>

      {/* Particules décoratives - cachées sur mobile */}
      <div className="hidden sm:block absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
      <div className="hidden sm:block absolute top-0 -right-10 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-float-delayed"></div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes underline {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        @keyframes click {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(-15px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-underline {
          animation: underline 1s ease-out 1s forwards;
        }
        .animate-click {
          animation: click 1.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// ============================================
// COMPOSANT STEP CARD
// ============================================

const StepCard = ({ number, title, description }: Items) => (
  <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xl font-black shadow-lg group-hover:scale-110 transition-transform">
      {number}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex-1">
        <Navbar />
      </div>

      {/* Section Héro avec Titre Animé */}
      <section className="relative h-[480px] sm:h-[480px] md:h-[480px] w-full flex items-center justify-center text-white text-center overflow-hidden">
        {/* Image en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-teal-600 via-green-600 to-blue-700"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Contenu de la section Héro */}
        <div className="relative z-10 px-4 sm:px-6 w-full max-w-5xl">
          <AnimatedHeroTitle />

          {/* Sous-titre avec animation */}
          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/90 font-medium animate-fade-in-up px-4">
            <span className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Livraison rapide</span>
              </span>
              <span className="text-white/60 hidden sm:inline">•</span>
              <span>Paiement sécurisé</span>
              <span className="text-white/60 hidden sm:inline">•</span>
              <span>Prix imbattables</span>
            </span>
          </p>

          {/* Boutons CTA */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
            <a
              href="/vendor"
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center">
                Faire mes achats
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main
        id="contenu"
        className="relative max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 z-20"
      >
        {/* Section Description et Valeur Ajoutée */}
        <section className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-8 sm:mb-12 text-center px-2">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent">
              {cityName}
            </span>
            ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Carte 1 */}
            <div className="group p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl bg-white">
              <div className="flex justify-center mb-6">
                <span className="text-5xl p-4 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Backpack className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                Sélection de Commerçants
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                Plusieurs vendeurs locaux regroupés pour un choix optimal et
                diversifié.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="group p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl bg-white">
              <div className="flex justify-center mb-6">
                <span className="text-5xl p-4 bg-teal-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Zap
                    className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600"
                    fill="currentColor"
                  />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                Livraison Rapide et Fiable
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                Votre commande livrée dans les plus brefs délais, directement à
                votre porte.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="group p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl bg-white sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-6">
                <span className="text-5xl p-4 bg-red-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <LockKeyhole
                    className="w-10 h-10 sm:w-12 sm:h-12 text-red-600"
                    fill="currentColor"
                  />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                Processus Sécurisé
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                Vos transactions et communications sont traitées en toute
                sécurité.
              </p>
            </div>
          </div>
        </section>

        {/* Section Étapes */}
        <section className="mb-12" id="etapes">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-8 sm:mb-12 text-center px-2">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <StepCard
              number="1"
              title="Trouvez votre marché"
              description="Cliquez sur 'Faire mes achats' pour explorer notre sélection de commerçants."
            />
            <StepCard
              number="2"
              title="Sélectionnez un vendeur"
              description="Choisissez le commerçant qui propose les produits dont vous avez besoin."
            />
            <StepCard
              number="3"
              title="Connectez-vous"
              description="Accédez directement à l'espace du commerçant pour voir ses offres."
            />
            <StepCard
              number="4"
              title="Commandez via WhatsApp"
              description="Finalisez votre commande rapidement et simplement via une discussion sécurisée WhatsApp."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2024 NoBoutik. Tous droits réservés.</p>
        </footer>
      </main>
      {/* Bouton flottant */}
      <a
        href="/vendor"
        className="fixed bottom-6 right-4 sm:right-6 z-50 group"
        aria-label="Voir les vendeurs"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-teal-600 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="hidden lg:block absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
              Voir les vendeurs
              <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
