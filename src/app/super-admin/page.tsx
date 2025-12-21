"use client";
import React from "react";
import SuperAdmin from "./ui/components/SuperAdmin";
import NavBarAdmin from "./ui/components/NavBarAdmin";
import { AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
export default function SuperAdminPage() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Accès Restreint
          </h1>
          <p className="text-slate-500 mb-8">
            Veuillez vous connecter pour accéder à l'interface d'administration.
          </p>
          <Link
            href="/users/ui/login"
            className="flex items-center justify-center gap-2 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-200"
          >
            <LogIn className="w-5 h-5" />
            Se connecter
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. La Navigation Latérale (Fixe ou Relative) */}
      <NavBarAdmin />
      {/* 2. Le Conteneur de contenu principal */}
      <main className="flex-1 transition-all duration-300">
        {/* Padding pour ne pas coller aux bords et laisser de la place au bouton mobile */}
        <div className="p-4 md:p-1 mt-14 lg:mt-0">
          <SuperAdmin />
        </div>
      </main>
    </div>
  );
}
