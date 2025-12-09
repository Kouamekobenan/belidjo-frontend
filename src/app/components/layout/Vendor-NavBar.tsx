"use client";
import React, { useState } from "react";
import { Store, UserPlus, Share2, Home, LogOut, User } from "lucide-react";
import Link from "next/link";
// Assurez-vous que ce chemin d'importation est correct dans votre projet
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
function VendorNavBar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Fonction pour gérer le partage
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const vendorUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Découvrez cet espace vendeur",
          text: "Visitez cet espace vendeur pour découvrir ses produits",
          url: vendorUrl,
        });
      } else {
        await navigator.clipboard.writeText(vendorUrl);
        toast.success("Lien copié dans le presse-papier !");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Erreur:", err.message);
      }
    }
  };
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };
  return (
    <>
      {/* Navigation principale */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et Nom */}
            <Link href="/vendor" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                Espace Boutique
              </span>
            </Link>
            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Bouton Accueil */}
              <button
                onClick={() => window.history.back()}
                aria-label="Retour à l'accueil"
                className="p-2 sm:px-4 sm:py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 font-medium flex items-center group"
              >
                <Home className="w-5 h-5 sm:mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Accueil</span>
              </button>
              {/* Bouton Partager */}
              <button
                onClick={handleShare}
                aria-label="Partager la boutique"
                className="p-2 sm:px-4 sm:py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 font-medium flex items-center group"
              >
                <Share2 className="w-5 h-5 sm:mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Partager</span>
              </button>
              {/* Section User - Conditionnel */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium group"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline max-w-[120px] truncate">
                      {user.name || user.phone}
                    </span>
                  </button>
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.phone}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/users/ui/login">
                  <button className="flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium group">
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">Se connecter</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Bannière d'invitation AVEC ANIMATION */}
        {!user && (
          <div
            className="
              bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 
              border-t border-teal-100
              shadow-lg
              animate-pulse duration-1000 transition-shadow hover:shadow-xl
            "
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
              <p className="text-xs sm:text-sm text-gray-700 text-center">
                <span className="font-semibold text-teal-600">
                  🎉 Offre exclusive :
                </span>{" "}
                {/* Lien direct dans le texte pour l'appel à l'action */}
                <Link
                  href="/users/ui/login"
                  className="underline hover:no-underline font-bold text-green-700 hover:text-green-800 transition-colors"
                >
                  Créez votre compte
                </Link>
                pour bénéficier de réductions et suivre ce vendeur !
              </p>
            </div>
          </div>
        )}
      </nav>
      {/* Overlay pour fermer le dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
}

export default VendorNavBar;
