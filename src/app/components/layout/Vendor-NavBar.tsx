"use client";
import React, { useState } from "react";
import {
  Store,
  UserPlus,
  Share2,
  Home,
  LogOut,
  User,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AnimatedPromoBanner, { NeonPromoBanner } from "../features/Animation";

function VendorNavBar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

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
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Desktop - En haut */}
      <nav className="hidden lg:block bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et Nom */}
            <Link href="/vendor" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                Espace Boutique
              </span>
            </Link>

            {/* Actions Desktop */}
            <div className="flex items-center space-x-3">
              {/* Bouton Espace Vendeur */}
              {user?.role === "VENDEUR" && (
                <button
                  onClick={() => router.push("/admin/ui")}
                  className="group relative cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <Store className="w-5 h-5" />
                  <span>Profile vendeur</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Bouton Accueil */}
              <button
                onClick={() => window.history.back()}
                aria-label="Retour à l'accueil"
                className="px-4 py-2 text-base text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 font-medium flex items-center group"
              >
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Accueil</span>
              </button>

              {/* Bouton Partager */}
              <button
                onClick={handleShare}
                aria-label="Partager la boutique"
                className="px-4 py-2 text-base text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 font-medium flex items-center group"
              >
                <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Partager</span>
              </button>

              {/* User Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-base group"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="max-w-[120px] truncate">
                      {user.name || user.phone}
                    </span>
                  </button>

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
                  <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-base group">
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">Se connecter</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Bannière d'invitation */}
        <AnimatedPromoBanner user={user} />
        {/* <NeonPromoBanner user={user} /> */}
      </nav>

      {/* Header Mobile - En haut (simplifié) */}
      <header className="lg:hidden bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200/50">
        <div className="px-4 py-3">
          <Link
            href="/vendor"
            className="flex items-center justify-center space-x-2 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              Espace Boutique
            </span>
          </Link>
        </div>
        {/* Bannière d'invitation Mobile */}
        <AnimatedPromoBanner user={user} />
        {/* <NeonPromoBanner user={user} /> */}
      </header>

      {/* Navigation Mobile - En bas (Style App) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-4 h-16">
          {/* Accueil */}
          <button
            onClick={() => window.history.back()}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
          >
            <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Accueil</span>
          </button>

          {/* Partager */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
          >
            <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Partager</span>
          </button>
          {/* Espace Vendeur (si vendeur) / Store */}
          {user?.role === "VENDEUR" && (
            <button
              onClick={() => router.push("/admin/ui")}
              className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
            >
              <div className="relative">
                <Store className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full"></div>
              </div>
              <span className="text-xs font-medium">Vendeur</span>
            </button>
          )}
          {/* Profile / Login */}
          {user ? (
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium">Profil</span>
            </button>
          ) : (
            <Link href="/users/ui/login">
              <button className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-teal-600 active:bg-teal-50 transition-all duration-200 group w-full h-full">
                <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Connexion</span>
              </button>
            </Link>
          )}
        </div>
      </nav>
      {/* Menu Modal Mobile (pour options supplémentaires) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200">
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-lg font-bold text-gray-900">Menu</h3>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="px-4 py-6 space-y-3">
              {/* Espace Vendeur - Mobile */}
              {user?.role === "VENDEUR" && (
                <button
                  onClick={() => {
                    router.push("/admin/ui");
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-md font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <Store className="w-5 h-5" />
                    <span>Profile vendeur</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              {/* Info User */}
              {user && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Déconnexion */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-medium border border-red-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Se déconnecter</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown User Desktop */}
      {isDropdownOpen && user && (
        <>
          <div
            className="hidden lg:block fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        </>
      )}
      {/* Dropdown Mobile (depuis icône profil) */}
      {isDropdownOpen && user && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200">
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="px-4 py-6 space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{user.phone}</p>
                </div>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-medium border border-red-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer pour le contenu (évite que le bottom nav cache le contenu) */}
      {/* <div className="lg:hidden h-16" /> */}
      <div className="lg:hidden " />
    </>
  );
}

export default VendorNavBar;
