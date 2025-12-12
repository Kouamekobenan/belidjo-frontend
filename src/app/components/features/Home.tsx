import Image from "next/image";
import React from "react";
import {
  Backpack,
  LockKeyhole,
  Zap,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "../layout/Footer";

interface Items {
  number: string;
  title: string;
  description: string;
}

// Sous-composant pour l'étape
const StepCard = ({ number, title, description }: Items) => (
  <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px]">
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 rounded-full bg-teal-600 text-white text-lg sm:text-xl font-bold">
      {number}
    </div>
    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-gray-600">{description}</p>
  </div>
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Section Héro */}
      <section className="relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full flex items-center justify-center text-white text-center">
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
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Contenu de la section Héro */}
        <div className="relative z-10 px-4 sm:px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Belidjo: votre marché en ligne.
          </h1>
          <div className="mt-4 sm:mt-6">
            <Link
              href="/vendor"
              className="inline-flex items-center justify-center px-5 sm:px-7 lg:px-9 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition duration-150 ease-in-out shadow-xl transform hover:scale-105"
            >
              Faire mes achats maintenant
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main
        id="contenu"
        className="relative max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 z-20 shadow-2xl"
      >
        <hr className="my-4 sm:my-6 border-gray-200" />

        {/* Section Description et Valeur Ajoutée */}
        <section className="bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-xl p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-10 lg:mb-12 text-center tracking-tight">
            Pourquoi choisir <span className="text-teal-600">Belidjo</span> ?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Carte 1 */}
            <div className="p-4 sm:p-6 transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl rounded-lg">
              <div className="flex justify-center mb-3 sm:mb-4">
                <span className="text-4xl sm:text-5xl text-blue-600 p-2 sm:p-3 bg-blue-50 rounded-full inline-block">
                  <Backpack className="w-8 h-8 sm:w-10 sm:h-10" />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Sélection de Commerçants
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                Plusieurs vendeurs locaux regroupés pour un choix optimal et
                diversifié.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="p-4 sm:p-6 transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl rounded-lg">
              <div className="flex justify-center mb-3 sm:mb-4">
                <span className="text-4xl sm:text-5xl text-teal-600 p-2 sm:p-3 bg-teal-50 rounded-full inline-block">
                  <Zap
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    fill="currentColor"
                  />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Livraison Rapide et Fiable
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                Votre commande livrée dans les plus brefs délais, directement à
                votre porte.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="p-4 sm:p-6 transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-3 sm:mb-4">
                <span className="text-4xl sm:text-5xl text-red-600 p-2 sm:p-3 bg-red-50 rounded-full inline-block">
                  <LockKeyhole
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    fill="currentColor"
                  />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Processus Sécurisé
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                Vos transactions et communications sont traitées en toute
                sécurité.
              </p>
            </div>
          </div>
        </section>

        <hr className="my-6 sm:my-8 lg:my-10 border-gray-200" />

        {/* Section Étapes */}
        <section className="mb-8 sm:mb-10 lg:mb-12" id="etapes">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10 text-center">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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

      {/* Bouton flottant pour aller à la page vendor */}
      <Link
        href="/vendor"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Voir les vendeurs"
      >
        <div className="relative">
          {/* Effet de pulsation */}
          <div className="absolute inset-0 bg-teal-600 rounded-full animate-ping opacity-75"></div>
          {/* Bouton principal */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          {/* Tooltip au survol (desktop uniquement) */}
          <div className="hidden lg:block absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
              Voir les vendeurs
              <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </Link>

      {/* Espacement pour éviter que le contenu soit caché par le bouton flottant */}
      <div className="h-20 sm:h-24"></div>
    </div>
  );
}
