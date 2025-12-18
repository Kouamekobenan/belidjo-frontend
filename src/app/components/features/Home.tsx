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
  Store,
  Clock,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { cityName } from "@/app/lib/globals.type";
import { AnimatedHeroTitle } from "./AnimationHome";
import Link from "next/link";

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
            <a
              href="#create"
              className={`font-medium transition-colors hover:text-orange-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Devenir vendeur
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
            <a
              href="#create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              devenir vendeur
            </a>
            <div className="pt-4 border-t border-gray-200">
              <a
                href="/users/ui/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-5 py-3 text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg font-semibold transition-all"
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
                  <Backpack className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" />
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

        <section
          id="create"
          className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20 border border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 text-center">
              Comment devenir vendeur sur{" "}
              <span className="bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent italic">
                {cityName}
              </span>
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto text-sm sm:text-base">
              Rejoignez notre réseau de commerçants locaux et commencez à vendre
              vos produits en quelques étapes simples.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
              {/* Ligne de connexion entre les étapes (visible sur desktop) */}
              <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>

              {/* Étape 1 */}
              <div className="relative flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50 z-10">
                <div className="w-14 h-14 bg-blue-50 text-green-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <UserPlus size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  1. Compte Client
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
                  Créez d'abord votre compte utilisateur standard sur la
                  plateforme.
                </p>
              </div>

              {/* Étape 2 */}
              <div className="relative flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50 z-10">
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <Store size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">2. Ma Boutique</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
                  Remplissez le formulaire de demande pour ouvrir votre espace
                  vendeur.
                </p>
              </div>

              {/* Étape 3 */}
              <div className="relative flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50 z-10">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <Clock size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  3. Validation 24h
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
                  Notre équipe vérifie vos infos. Réponse reçue sous 24h
                  maximum.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/vendor/vendorform"
                className="group flex items-center gap-3 bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all transform hover:scale-105 shadow-xl"
              >
                Créer ma boutique maintenant
              </Link>
              <p className="text-xs text-gray-400 italic">
                ? "Vous êtes connecté. Passez à l'étape vendeur !" : "Déjà un
                compte ? Connectez-vous pour continuer."
              </p>
            </div>
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
