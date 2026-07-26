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
import ProductSearch from "../products/ui/components/ProductSearch";

const LOGO_SRC = "/images/bj.png";
const SCROLL_THRESHOLD = 20;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // Détection dynamique des rôles
  const isAdmin = user?.role === UserRole.ADMIN;
  const isVendor = user?.role === UserRole.VENDEUR; // Remplace par ton enum exact
  const isClient = user?.role === UserRole.CUSTOMER; // Remplace par ton enum exact
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Configuration dynamique selon le rôle
  const getRoleConfig = () => {
    if (isAdmin)
      return {
        label: "Mode Admin",
        href: "/super-admin",
        color: "text-green-600",
        bg: "bg-green-50",
        dot: "bg-green-500",
        icon: <LayoutDashboard size={18} />,
      };
    if (isVendor)
      return {
        label: "Mode Vendeur",
        href: "/admin/ui",
        color: "text-orange-600",
        bg: "bg-orange-50",
        dot: "bg-orange-500",
        icon: <Store size={18} />,
      };
    if (isClient)
      return {
        label: "Mode Client",
        href: "/profile",
        color: "text-blue-600",
        bg: "bg-blue-50",
        dot: "bg-blue-500",
        icon: <User size={18} />,
      };
    return null;
  };

  const roleConfig = getRoleConfig();
  // Sous-composant pour les boutons d'action
  const AuthButtons = ({ mobile = false }) => {
    if (isAuthenticated && roleConfig) {
      return (
        <Link
          href={roleConfig.href}
          className={`group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-teal-600 rounded-xl shadow-md transition-all ${mobile ? "w-full justify-center py-4" : ""}`}
        >
          {roleConfig.icon}
          <span>{roleConfig.label}</span>
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
        <span>Connexion</span>
      </Link>
    );
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 py-2" : "bg-transparent py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
          <Link href="/vendor" className="flex items-center gap-3 group shrink-0">
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

          <div className="flex-1 flex justify-center">
            <ProductSearch variant="bar" triggerClassName="relative w-full max-w-md" />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Badge de mode sur Desktop (Optionnel) */}
            {isAuthenticated && roleConfig && (
              <div
                className={`hidden lg:flex items-center gap-2 ${roleConfig.bg} px-3 py-1.5 rounded-full border border-gray-100`}
              >
                <div
                  className={`w-2 h-2 ${roleConfig.dot} rounded-full animate-pulse`}
                />
                <span
                  className={`text-[11px] font-bold ${roleConfig.color} uppercase tracking-wider`}
                >
                  {roleConfig.label}
                </span>
              </div>
            )}
            <AuthButtons />
          </div>
        </div>
      </nav>

      {/* --- MOBILE HEADER (TOP) --- */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white/50 backdrop-blur-sm"}`}
      >
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-xl font-black text-gray-900">{cityName}</span>

          <div className="flex items-center gap-2">
            <ProductSearch triggerClassName="p-2 rounded-xl text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-colors" />
            {/* Badge Dynamique : Admin, Vendeur ou Client */}
            {isAuthenticated && roleConfig && (
              <div
                className={`flex items-center gap-2 ${roleConfig.bg} px-3 py-1 rounded-full`}
              >
                <div
                  className={`w-2 h-2 ${roleConfig.dot} rounded-full animate-pulse`}
                />
                <span
                  className={`text-[10px] font-bold ${roleConfig.color} uppercase`}
                >
                  {roleConfig.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
        <div className="grid grid-cols-3 h-16">
          <Link
            href="/vendor"
            className="flex flex-col items-center justify-center text-gray-400 hover:text-teal-600"
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
            href={
              isAuthenticated && roleConfig
                ? roleConfig.href
                : "/users/ui/login"
            }
            className="flex flex-col items-center justify-center text-gray-400 hover:text-teal-600"
          >
            {isAuthenticated && roleConfig ? (
              <div className={roleConfig.color}>{roleConfig.icon}</div>
            ) : (
              <User size={22} />
            )}
            <span className="text-[10px] mt-1 font-medium">
              {isAuthenticated ? "Mon Profil" : "Compte"}
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
                  href="/page"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                    <Info size={20} />
                  </div>
                  <span className="font-semibold">À propos de nous</span>
                </Link>
                <a
                  href="tel:+2250506832678"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Phone size={20} />
                  </div>
                  <span className="font-semibold">Appelez nous!</span>
                </a>
              </div>
              <div className="pt-2">
                <AuthButtons mobile />
              </div>
            </div>
          </div>
        </div>
      )}
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
