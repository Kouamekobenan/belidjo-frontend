"use client";
import NavbarDashbordVendor from "@/app/components/layout/DashBordVendor";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import DashbordVendor from "./components/dashbord/Dashbord";
import { AlertCircle, CheckCircle, Clock, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mb-3"></div>
          <p className="text-base text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }
  if (user?.vendorProfile?.isApproved === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <Link href="/page" className="bg-gray-300 rounded-xl p-2">
            Retour
          </Link>
          {/* Icône d'attente */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-teal-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full animate-ping"></div>
            </div>
          </div>
          {/* Titre */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
            Demande en cours de vérification
          </h1>
          {/* Message principal */}
          <div className="bg-blue-50 border-l-4 border-teal-500 p-6 mb-8 rounded-r-lg">
            <p className="text-gray-700 text-lg leading-relaxed">
              Merci d'avoir soumis votre demande pour devenir vendeur ! Votre
              profil est actuellement en cours d'examen par notre équipe
              d'administration.
            </p>
          </div>
          {/* Informations détaillées */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Notification par email ou WhatSapp
                </h3>
                <p className="text-gray-600">
                  Vous recevrez un message wathSapp de confirmation à 
                  <span className="font-medium text-teal-600">
                    {user.phone || "votre adresse"}
                  </span>
                  dès que votre compte sera approuvé.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Délai de traitement
                </h3>
                <p className="text-gray-600">
                  Notre équipe traite généralement les demandes dans un délai de{" "}
                  <span className="font-semibold">24 heures</span> maximum.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Prochaines étapes
                </h3>
                <p className="text-gray-600">
                  Une fois approuvé, vous pourrez accéder à votre espace vendeur
                  et commencer à publier vos produits.
                </p>
              </div>
            </div>
          </div>
          {/* Message d'information supplémentaire */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Informations importantes
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • Vérifiez régulièrement votre boîte mail (y compris les
                    spams) ou WhatSapp
                  </li>
                  <li>
                    • Assurez-vous que vos informations de profil sont complètes
                  </li>
                  <li>• En cas de problème, contactez notre support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavbarDashbordVendor
        name={user?.name}
        phone={user?.phone}
        cityName={user?.cityName}
        vendorProfile={user?.vendorProfile}
      />

      {/* Conteneur principal avec gestion du spacing de la navbar */}
      <main className="flex-1 w-full pt-20 md:pt-2">
        <DashbordVendor />
      </main>
    </div>
  );
}
