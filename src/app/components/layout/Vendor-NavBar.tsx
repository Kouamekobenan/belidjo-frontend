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
import AnimatedPromoBanner, {
  NeonPromoBanner,
} from "../features/Animation";

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
      {/* Navigation principale */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo et Nom */}
            <Link href="/vendor" className="flex items-center space-x-2 group">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Store className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                <span className="hidden xs:inline">Espace Boutique</span>
                <span className="xs:hidden">Boutique</span>
              </span>
            </Link>

            {/* Actions Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Bouton Espace Vendeur */}
              {user?.role === "VENDEUR" && (
                <button
                  onClick={() => router.push("/admin/ui")}
                  className="group relative cursor-pointer inline-flex items-center justify-center gap-2 px-4 xl:px-6 py-2 xl:py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-sm xl:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <Store className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span>Profile vendeur</span>
                  <ArrowRight className="w-3 h-3 xl:w-4 xl:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {/* Bouton Accueil */}
              <button
                onClick={() => window.history.back()}
                aria-label="Retour à l'accueil"
                className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 font-medium flex items-center group"
              >
                <Home className="w-4 h-4 xl:w-5 xl:h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Accueil</span>
              </button>

              {/* Bouton Partager */}
              <button
                onClick={handleShare}
                aria-label="Partager la boutique"
                className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 font-medium flex items-center group"
              >
                <Share2 className="w-4 h-4 xl:w-5 xl:h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Partager</span>
              </button>

              {/* User Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 xl:px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm xl:text-base group"
                  >
                    <div className="w-7 h-7 xl:w-8 xl:h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                    </div>
                    <span className="max-w-[100px] xl:max-w-[120px] truncate">
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
                  <button className="flex items-center space-x-2 px-4 xl:px-5 py-2 xl:py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm xl:text-base group">
                    <UserPlus className="w-4 h-4 xl:w-5 xl:h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">Se connecter</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Actions Mobile/Tablet */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Bouton Partager Mobile */}
              <button
                onClick={handleShare}
                aria-label="Partager"
                className="p-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* User Avatar ou Login - Mobile */}
              {user ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg shadow-md"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <Link href="/users/ui/login">
                  <button className="p-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg shadow-md">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </Link>
              )}
              {/* Burger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Menu Mobile Déroulant */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg animate-in slide-in-from-top duration-300">
            <div className="px-3 py-4 space-y-2">
              {/* Espace Vendeur - Mobile */}
              {user?.role === "VENDEUR" && (
                <button
                  onClick={() => {
                    router.push("/admin/ui");
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg shadow-md font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <Store className="w-5 h-5" />
                    <span>Profile vendeur</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Accueil */}
              <button
                onClick={() => {
                  window.history.back();
                  closeMobileMenu();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </button>

              {/* Info User ou Login */}
              {user ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.phone}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              ) : (
                <Link href="/users/ui/login" onClick={closeMobileMenu}>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg shadow-md font-medium">
                    <UserPlus className="w-5 h-5" />
                    <span>Se connecter</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
        {/* Dropdown User Mobile */}
        {isDropdownOpen && user && (
          <div className="lg:hidden absolute right-3 top-16 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.phone}</p>
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
        {/* Bannière d'invitation */}
        <AnimatedPromoBanner user={user} />
        <NeonPromoBanner user={user} />
      </nav>

      {/* Overlay pour fermer les menus */}
      {(isDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:bg-transparent"
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
}

export default VendorNavBar;
