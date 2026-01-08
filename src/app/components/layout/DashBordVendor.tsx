import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Package,
  Users,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Menu,
  X,
  Settings,
  AlignVerticalDistributeEnd,
  Home,
  Clock,
  Sparkles,
} from "lucide-react";
import { IvendorProfile, User as VendorProfile } from "@/app/lib/globals.type";

interface NavbarDashbordVendorProps {
  id?: string;
  name: string;
  phone?: string;
  cityName?: string;
  vendorProfile?: IvendorProfile;
  trialDaysRemaining?: number;
}

export default function NavbarDashbordVendor({
  name,
  phone,
  cityName,
  vendorProfile,
  trialDaysRemaining = 30,
}: NavbarDashbordVendorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const pathname = usePathname(); // Hook pour obtenir l'URL actuelle

  const Url = `/products/ui/page/${vendorProfile?.id}`;
  const imageLogo = vendorProfile?.logoUrl ?? "/images/bj.png";

  const menuItems = [
    {
      href: "/admin/ui",
      label: "Tableau de bord",
      shortLabel: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Produits",
      shortLabel: "Produits",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Catégories produits",
      shortLabel: "Catégories",
      icon: AlignVerticalDistributeEnd,
    },
    {
      href: "/admin/customer",
      label: "Mes abonnées",
      shortLabel: "Clients",
      icon: Users,
    },
  ];

  // Fonction pour vérifier si un lien est actif
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      {/* Bannière d'essai gratuit - Desktop (sous le header) */}
      {showTrialBanner && (
        <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">
                  Essai gratuit en cours - {trialDaysRemaining} jours restants
                </p>
                <p className="text-xs text-white/90">
                  Profitez de toutes les fonctionnalités premium gratuitement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="#">
                <button className="bg-white text-orange-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                  Mettre à niveau
                </button>
              </Link>
              <button
                onClick={() => setShowTrialBanner(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 ${
          showTrialBanner ? "top-[60px]" : "top-0"
        } h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out z-40 shadow-2xl ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* En-tête avec Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <Link href={Url} className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-white p-1 shadow-lg">
                <Image
                  src={imageLogo}
                  fill
                  alt={`Logo ${name}`}
                  className="object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-lg font-bold text-white truncate">
                    {vendorProfile?.name}
                  </h1>
                  <p className="text-xs text-gray-400 truncate">
                    Espace vendeur
                  </p>
                </div>
              )}
            </Link>

            {/* Bouton de collapse */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={isCollapsed ? "Étendre" : "Réduire"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {/* Badge essai gratuit dans sidebar (version collapsed) */}
        {!isCollapsed && (
          <div className="mx-3 mt-4 mb-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">
                ESSAI GRATUIT
              </span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              {trialDaysRemaining} jours restants pour profiter de toutes les
              fonctionnalités
            </p>
            <Link href="#">
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold py-2 rounded-lg transition-all">
                Passer à Premium
              </button>
            </Link>
          </div>
        )}

        {/* Menu de navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-2 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? "bg-teal-600 text-white"
                    : "hover:bg-teal-600 text-gray-300"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                />
                {!isCollapsed && (
                  <span
                    className={`text-sm font-medium ${
                      isActive(item.href)
                        ? "text-white"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            ))}

            {/* Paramètres */}
            <Link
              href="/admin/parametre"
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive("/admin/parametre")
                  ? "bg-teal-600 text-white"
                  : "hover:bg-teal-600 text-gray-300"
              }`}
            >
              <Settings
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive("/admin/parametre")
                    ? "text-white"
                    : "text-gray-300 group-hover:text-white"
                }`}
              />
              {!isCollapsed && (
                <span
                  className={`text-sm font-medium ${
                    isActive("/admin/parametre")
                      ? "text-white"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  Paramètre
                </span>
              )}
            </Link>
          </div>
        </nav>
        {/* Informations du vendeur */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-gray-300">{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">
                  {cityName}, Côte d&apos;Ivoire
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <User className="w-5 h-5 text-teal-400" />
              <Phone className="w-5 h-5 text-teal-400" />
              <MapPin className="w-5 h-5 text-teal-400" />
            </div>
          )}
        </div>
      </aside>

      {/* Header Mobile */}
      <div
        className={`lg:hidden fixed ${
          showTrialBanner ? "top-[56px]" : "top-0"
        } left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo et nom */}
          <Link href={Url} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-1 shadow-lg">
              <Image
                src={imageLogo}
                fill
                alt={`Logo ${name}`}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-white truncate max-w-[180px]">
                {vendorProfile?.name}
              </h1>
              <p className="text-xs text-gray-400">Espace vendeur</p>
            </div>
          </Link>

          {/* Bouton Paramètres */}
          <Link href="/admin/parametre">
            <button
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Paramètres"
            >
              <Settings className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>

      {/* Bannière d'essai gratuit - Mobile (en haut) */}
      {showTrialBanner && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2 flex-1">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">
                  Essai gratuit - {trialDaysRemaining}j restants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="#">
                <button className="bg-white text-orange-600 hover:bg-gray-100 px-3 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap">
                  Upgrade
                </button>
              </Link>
              <button
                onClick={() => setShowTrialBanner(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Mobile Bottom - Style App */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 shadow-2xl">
        <div className="grid grid-cols-5 h-16">
          {/* Dashboard */}
          <Link
            href="/admin/ui"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative ${
              isActive("/admin/ui")
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">Dashboard</span>
            {isActive("/admin/ui") && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Produits */}
          <Link
            href="/admin/products"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative ${
              isActive("/admin/products")
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <Package className="w-6 h-6" />
            <span className="text-[10px] font-medium">Produits</span>
            {isActive("/admin/products") && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Catégories */}
          <Link
            href="/admin/categories"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative ${
              isActive("/admin/categories")
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <AlignVerticalDistributeEnd className="w-6 h-6" />
            <span className="text-[10px] font-medium">Catégories</span>
            {isActive("/admin/categories") && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Clients */}
          <Link
            href="/admin/customer"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative ${
              isActive("/admin/customer")
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Clients</span>
            {isActive("/admin/customer") && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Menu / Profil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-teal-300 transition-all duration-200"
          >
            <Menu className="w-6 h-6" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Modal Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 animate-in fade-in duration-200">
          <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-4 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-1">
                  <Image
                    src={imageLogo}
                    fill
                    alt={`Logo ${name}`}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {vendorProfile?.name}
                  </h3>
                  <p className="text-xs text-gray-400">Mon profil vendeur</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="px-4 py-6 space-y-4">
              {/* Notification essai gratuit dans le modal */}
              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-400">
                      Essai gratuit actif
                    </p>
                    <p className="text-xs text-gray-300">
                      {trialDaysRemaining} jours restants
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/subscription"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold py-3 rounded-lg transition-all">
                    Passer à Premium
                  </button>
                </Link>
              </div>

              {/* Informations vendeur */}
              <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/20 rounded-xl p-4 border border-teal-700/30">
                <p className="text-xs font-semibold text-teal-300 mb-3 uppercase tracking-wide">
                  Informations vendeur
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Nom</p>
                      <p className="text-sm text-white font-medium">{name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Téléphone</p>
                      <p className="text-sm text-white font-medium">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Localisation</p>
                      <p className="text-sm text-white font-medium">
                        {cityName}, Côte d&apos;Ivoire
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                  Actions rapides
                </p>

                {/* Voir ma boutique */}
                <Link href={Url} onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-between px-4 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl shadow-lg transition-all duration-200 font-medium">
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5" />
                      <span>Voir ma boutique</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>

                {/* Paramètres */}
                <Link
                  href="/admin/parametre"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full flex items-center justify-between px-4 py-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span>Paramètres</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer pour le contenu principal (desktop) */}
      <div className={`hidden lg:block ${isCollapsed ? "w-20" : "w-72"}`} />

      {/* Spacer pour le contenu principal (mobile) - top et bottom */}
      <div
        className={`lg:hidden ${showTrialBanner ? "h-[116px]" : "h-[60px]"}`}
      />
      <div className="lg:hidden h-16" />
    </>
  );
}
