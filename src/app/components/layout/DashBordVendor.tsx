import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
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
} from "lucide-react";
import { IvendorProfile, User as VendorProfile } from "@/app/lib/globals.type";

interface NavbarDashbordVendorProps {
  id?: string;
  name: string;
  phone?: string;
  cityName?: string;
  vendorProfile?: IvendorProfile;
}

export default function NavbarDashbordVendor({
  name,
  phone,
  cityName,
  vendorProfile,
}: NavbarDashbordVendorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/admin/ui");

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

  const handleTabClick = (href: string) => {
    setActiveTab(href);
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out z-40 shadow-2xl ${
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

        {/* Menu de navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-2 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-teal-600 transition-all duration-200 group"
              >
                <item.icon className="w-5 h-5 flex-shrink-0 text-gray-300 group-hover:text-white" />
                {!isCollapsed && (
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}

            {/* Paramètres */}
            <Link
              href="/admin/parametre"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-teal-600 transition-all duration-200 group"
            >
              <Settings className="w-5 h-5 flex-shrink-0 text-gray-300 group-hover:text-white" />
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">
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

      {/* Header Mobile - En haut (simplifié) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl">
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

      {/* Navigation Mobile Bottom - Style App */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 shadow-2xl">
        <div className="grid grid-cols-5 h-16">
          {/* Dashboard */}
          <Link
            href="/admin/ui"
            onClick={() => handleTabClick("/admin/ui")}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              activeTab === "/admin/ui"
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">Dashboard</span>
            {activeTab === "/admin/ui" && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Produits */}
          <Link
            href="/admin/products"
            onClick={() => handleTabClick("/admin/products")}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              activeTab === "/admin/products"
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <Package className="w-6 h-6" />
            <span className="text-[10px] font-medium">Produits</span>
            {activeTab === "/admin/products" && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Catégories */}
          <Link
            href="/admin/categories"
            onClick={() => handleTabClick("/admin/categories")}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              activeTab === "/admin/categories"
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <AlignVerticalDistributeEnd className="w-6 h-6" />
            <span className="text-[10px] font-medium">Catégories</span>
            {activeTab === "/admin/categories" && (
              <div className="absolute bottom-0 w-12 h-1 bg-teal-400 rounded-t-full" />
            )}
          </Link>

          {/* Clients */}
          <Link
            href="/admin/customer"
            onClick={() => handleTabClick("/admin/customer")}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              activeTab === "/admin/customer"
                ? "text-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Clients</span>
            {activeTab === "/admin/customer" && (
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
      <div className="lg:hidden h-[60px]" />
      <div className="lg:hidden h-16" />
    </>
  );
}
