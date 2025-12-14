"use client";
import NavbarDashbordVendor from "@/app/components/layout/DashBordVendor";
import { useAuth } from "@/app/context/AuthContext";
import { AlertCircle, LogIn } from "lucide-react";
import React from "react";
import CustomerVendor from "../ui/components/customer/CustomerVendor";
import Link from "next/link";
export default function CustomerPage() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-gray-100">
            {/* Icône animée */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>

            {/* Titre et message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Authentification requise
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Veuillez vous connecter pour voir vos abonnées.
              </p>
            </div>

            {/* Bouton de connexion */}
            <Link
              href="/users/ui/login"
              className="group relative inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <LogIn className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Se connecter</span>
            </Link>

            {/* Lien secondaire */}
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link
                href="/users/ui/register"
                className="text-teal-600 hover:text-teal-700 font-medium underline-offset-4 hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex">
      <NavbarDashbordVendor
        name={user?.name}
        phone={user?.phone}
        cityName={user?.cityName}
        vendorProfile={user?.vendorProfile}
      />
      <div className="mt-8 md:mt-auto">
        <CustomerVendor vendorId={user.vendorProfile.id} />
      </div>
    </div>
  );
}
