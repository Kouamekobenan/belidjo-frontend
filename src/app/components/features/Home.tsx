"use client";
import Image from "next/image";
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
  User,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "../layout/Footer";

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
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-75 blur group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/bj.png"
                  width={60}
                  height={60}
                  alt="Logo Belidjo"
                  className="rounded-lg"
                />{" "}
              </div>
            </div>
            <span
              className={`text-xl sm:text-2xl font-black transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                Belidjo
              </span>
            </span>
          </Link>
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#contenu"
              className={`font-medium transition-colors hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Pourquoi nous choisir
            </Link>
            <Link
              href="#etapes"
              className={`font-medium transition-colors hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Comment ça marche
            </Link>
            <Link
              href="/vendor"
              className={`font-medium transition-colors hover:text-orange-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Nos vendeurs
            </Link>
          </div>

          {/* Boutons d'action Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/users/ui/login"
              className="group inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700  rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              <span>Connexion Vendeur</span>
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
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
            <Link
              href="#contenu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Pourquoi nous choisir
            </Link>
            <Link
              href="#etapes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="/vendor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Nos vendeurs
            </Link>
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/users/ui/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-5 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg font-semibold transition-all"
              >
                <LogIn className="w-5 h-5" />
                <span>Connexion Vendeur</span>
              </Link>
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
    <div className="relative">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight">
        {/* Partie 1: "Belidjo!" avec effet de gradient animé */}
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
          Belidjo!
        </span>

        {/* Élément décoratif - Sparkle */}
        <span className="inline-block ml-2 animate-pulse">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-400 animate-spin-slow"
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
            {/* Effet de highlight animé */}
            <span className="absolute inset-0 bg-yellow-200/30 transform -skew-x-12 animate-pulse-slow"></span>
            <span className="relative z-10">Fais tes achats </span>
          </span>
          <span className="relative inline-block">
            <span className="text-teal-400 font-extrabold animate-bounce-subtle">
              en un clic
            </span>
            {/* Effet de soulignement animé */}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-600 transform origin-left scale-x-0 animate-underline"></span>
          </span>
        </span>

        {/* Icône de clic animée */}
        <span className="inline-block ml-3 animate-click">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400"
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

      {/* Particules décoratives */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-0 -right-10 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-float-delayed"></div>

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
    <div className="relative min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Section Héro avec Titre Animé */}
      <section className="relative h-[480px] sm:h-[480px] md:h-[480px] lg:h-[480px] w-full flex items-center justify-center text-white text-center">
        {/* Image en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/img.jpg"
            alt="Marché en ligne Belidjo"
            layout="fill"
            objectFit="cover"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Contenu de la section Héro */}
        <div className="relative z-10 px-4 sm:px-6 max-w-5xl">
          <AnimatedHeroTitle />

          {/* Sous-titre avec animation */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 font-medium animate-fade-in-up">
            <span className="inline-flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Livraison rapide</span>
              <span className="text-white/60">•</span>
              <span>Paiement sécurisé</span>
              <span className="text-white/60">•</span>
              <span>Prix imbattables</span>
            </span>
          </p>

          {/* Boutons CTA */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vendor"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center">
               Je faire mes achats 
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main
        id="contenu"
        className="relative max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 z-20"
      >
        {/* Section Description et Valeur Ajoutée */}
        <section className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-8 sm:p-12 lg:p-16 mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-12 text-center">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent">
              Belidjo
            </span>
            ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Carte 1 */}
            <div className="group p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl bg-white">
              <div className="flex justify-center mb-6">
                <span className="text-5xl p-4 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Backpack className="w-12 h-12 text-blue-600" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Sélection de Commerçants
              </h3>
              <p className="text-base text-gray-600 leading-relaxed text-center">
                Plusieurs vendeurs locaux regroupés pour un choix optimal et
                diversifié.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="group p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl bg-white">
              <div className="flex justify-center mb-6">
                <span className="text-5xl p-4 bg-teal-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Zap
                    className="w-12 h-12 text-teal-600"
                    fill="currentColor"
                  />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Livraison Rapide et Fiable
              </h3>
              <p className="text-base text-gray-600 leading-relaxed text-center">
                Votre commande livrée dans les plus brefs délais, directement à
                votre porte.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="group p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl bg-white sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-6">
                <span className="text-5xl p-4 bg-red-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <LockKeyhole
                    className="w-12 h-12 text-red-600"
                    fill="currentColor"
                  />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Processus Sécurisé
              </h3>
              <p className="text-base text-gray-600 leading-relaxed text-center">
                Vos transactions et communications sont traitées en toute
                sécurité.
              </p>
            </div>
          </div>
        </section>

        {/* Section Étapes */}
        <section className="mb-12" id="etapes">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-12 text-center">
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

        <Footer />
      </main>

      {/* Bouton flottant */}
      <Link
        href="/vendor"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Voir les vendeurs"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-teal-600 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="hidden lg:block absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
              Voir les vendeurs
              <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </Link>

      <div className="h-24"></div>
    </div>
  );
}
