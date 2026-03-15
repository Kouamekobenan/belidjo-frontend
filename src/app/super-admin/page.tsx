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
     <div className="flex min-h-screen" style={{ background: "#090d13" }}>
       <NavBarAdmin />
       {/*
          min-w-0 : empêche le flex child de dépasser la largeur disponible
          overflow-x-hidden : filet de sécurité contre tout débordement horizontal
          w-0 flex-1 : pattern correct pour qu'un flex child prenne le reste de l'espace
                        sans jamais pousser hors du viewport
        */}
       <main className="w-0 flex-1 min-w-0 overflow-x-hidden pb-24 transition-all duration-300">
         <div className="mt-14 lg:mt-0">
           <SuperAdmin />
         </div>
       </main>
     </div>
   );
}
