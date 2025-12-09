import Image from "next/image";
import React from "react";
import { Backpack, LockKeyhole, Zap } from "lucide-react";
import Link from "next/link";

interface Items {
  number: string;
  title: string;
  description: string;
}
// Sous-composant pour l'étape (Conservé pour la réutilisation)
const StepCard = ({ number, title, description }: Items) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px]">
    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 rounded-full bg-teal-600 text-white text-xl font-bold">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function HomePage() {
  return (
    // Conteneur principal (La classe "relative" est importante pour le contenu défilant)
    <div className="relative min-h-screen bg-gray-50">
      {/* --- NOUVELLE 1. Section Héro (Plein Écran avec Image et Texte) --- */}
      <section className="relative h-[500px] w-full flex items-center justify-center text-white text-center">
        {/* L'image en arrière-plan plein écran */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/img.jpg" // Assurez-vous que le chemin est correct
            alt="Marché en ligne Belidjo"
            layout="fill" // Remplir le conteneur parent
            objectFit="cover" // S'assurer que l'image couvre tout l'espace
            quality={90}
          />
          {/* Calque de superposition pour améliorer la lisibilité du texte (optionnel) */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Contenu de la section Héro (texte par-dessus l'image) */}
        <div className="relative z-10 p-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Belidjo: votre marché en ligne.
          </h1>
          {/* Le bouton d'action a été déplacé ici pour être plus visible */}
          <div className="mt-8">
            <Link
              href="../../vendor"
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition duration-150 ease-in-out shadow-xl transform hover:scale-105"
            >
              Faire mes achats maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Contenu principal (responsive padding) */}
      <main
        id="contenu"
        className="relative max-w-7xl mx-auto py-16 px-4 sm:px-2 lg:px-3 bg-gray-50 z-20 shadow-2xl"
      >
        <hr className="my-2 border-gray-200" />
        {/* --- 2. Section Description et Valeur Ajoutée (Mise en évidence) --- */}
        <section className="bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-xl p-8 md:p-12 mb-20 py-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
            Pourquoi choisir **Belidjo** ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Carte 1 */}
            <div className="p-6 transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl rounded-lg">
              <div className="flex justify-center mb-4">
                <span className="text-5xl text-blue-600 p-3 bg-blue-50 rounded-full inline-block">
                  {/* L'icône sera centrée par `justify-center` du parent `div` */}
                  <Backpack />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sélection de Commerçants
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Plusieurs vendeurs locaux regroupés pour un choix **optimal et
                diversifié**.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="p-6 transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl rounded-lg">
              <div className="flex justify-center mb-4">
                <span className="text-5xl text-teal-600 p-3 bg-blue-50 rounded-full inline-block">
                  {/* L'icône est centrée de la même manière */}
                  <Zap fill="teal" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Livraison Rapide et Fiable
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Votre commande livrée dans les **plus brefs délais**,
                directement à votre porte.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="p-6 transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl rounded-lg">
              <div className="flex justify-center mb-4">
                <span className="text-5xl text-red-600 p-3 bg-blue-50 rounded-full inline-block">
                  {/* L'icône est centrée de la même manière */}
                  <LockKeyhole fill="red" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Processus Sécurisé
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Vos transactions et communications sont traitées en **toute
                sécurité**.
              </p>
            </div>
          </div>
        </section>

        <hr className="my-10 border-gray-200" />

        {/* --- 3. Section Étapes (Processus clair et numéroté) --- */}
        <section className="mb-10" id="etapes">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Étape 1 */}
            <StepCard
              number="1"
              title="Trouvez votre marché"
              description="Cliquez sur 'Faire mes achats' pour explorer notre sélection de commerçants."
            />

            {/* Étape 2 */}
            <StepCard
              number="2"
              title="Sélectionnez un vendeur"
              description="Choisissez le commerçant qui propose les produits dont vous avez besoin."
            />

            {/* Étape 3 */}
            <StepCard
              number="3"
              title="Connectez-vous"
              description="Accédez directement à l'espace du commerçant pour voir ses offres."
            />

            {/* Étape 4 */}
            <StepCard
              number="4"
              title="Commandez via WhatsApp"
              description="Finalisez votre commande rapidement et simplement via une discussion sécurisée WhatsApp."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
