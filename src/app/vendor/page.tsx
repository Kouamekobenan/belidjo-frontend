"use client";

import {
  LogIn,
  X,
  Home,
  Info,
  Phone,
  Store,
  LayoutDashboard,
  User,
} from "lucide-react";
import VendorPage from "./ui/pages/Vendor";
import Link from "next/link";
import { cityName } from "../lib/globals.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import Carrosel from "./ui/components/Carrosel";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../users/domain/enums/role.enum";

const LOGO_SRC = "/images/bj.png";
const SCROLL_THRESHOLD = 20;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // Vérification sécurisée du rôle admin
  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Sous-composant pour les boutons d'action (Connexion ou Admin)
  const AuthButtons = ({ mobile = false }) => {
    if (isAdmin) {
      return (
        <Link
          href="/super-admin"
          className={`group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-teal-600 rounded-xl shadow-md hover:shadow-indigo-200 transition-all ${mobile ? "w-full justify-center py-4" : ""}`}
        >
          <LayoutDashboard size={18} />
          <span>Espace Admin</span>
        </Link>
      );
    }

    return (
      <Link
        href="/users/ui/login"
        className={`group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg transition-all ${mobile ? "w-full justify-center py-4" : ""}`}
      >
        <LogIn
          size={18}
          className="group-hover:translate-x-0.5 transition-transform"
        />
        <span>Connexion Vendeur</span>
      </Link>
    );
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-gray-50">
              <Image
                src={LOGO_SRC}
                width={40}
                height={40}
                alt="Logo"
                className="object-contain"
                priority
              />
            </div>
            <span
              className={`text-2xl font-black tracking-tighter ${isScrolled ? "text-gray-900" : "text-teal-600"}`}
            >
              {cityName}
              <span className="text-teal-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Tu peux ajouter des liens de nav ici */}
            <AuthButtons />
          </div>
        </div>
      </nav>

      {/* --- MOBILE HEADER (TOP) --- */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white/50 backdrop-blur-sm"
        }`}
      >
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-xl font-black text-gray-900">{cityName}</span>
          {isAdmin && (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 uppercase">
                Mode Admin
              </span>
            </div>
          )}
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
        <div className="grid grid-cols-3 h-16">
          <Link
            href="/vendor"
            className="flex flex-col items-center justify-center text-gray-400 hover:text-teal-600 transition-colors"
          >
            <Home size={22} />
            <span className="text-[10px] mt-1 font-medium">Accueil</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center text-gray-400"
          >
            <div className="bg-gray-900 text-white p-2 rounded-xl -mt-8 shadow-lg border-4 border-white">
              <Store size={22} />
            </div>
            <span className="text-[10px] mt-1 font-medium text-gray-900">
              Explorer
            </span>
          </button>
          <Link
            href={isAdmin ? "/super-admin" : "/users/ui/login"}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-teal-600"
          >
            {isAdmin ? (
              <LayoutDashboard size={22} className="text-green-600" />
            ) : (
              <User size={22} />
            )}
            <span className="text-[10px] mt-1 font-medium">
              {isAdmin ? "Admin" : "Compte"}
            </span>
          </Link>
        </div>
      </nav>
      {/* --- MOBILE MENU MODAL --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Navigation</h3>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                    <Info size={20} />
                  </div>
                  <span className="font-semibold">À propos de nous</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Phone size={20} />
                  </div>
                  <span className="font-semibold">Contactez le support</span>
                </Link>
              </div>

              <div className="pt-2">
                <AuthButtons mobile />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacers */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default function Vendors() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Carrosel />
      <main className="relative z-0 pb-24 md:pb-12 px-4 max-w-7xl mx-auto">
        <VendorPage />
      </main>
    </div>
  );
}
