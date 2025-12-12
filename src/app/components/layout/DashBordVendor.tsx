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
  const Url = `/products/ui/page/${vendorProfile?.id}`;
  const imageLogo = vendorProfile?.logoUrl ?? "/images/bj.png";
  const menuItems = [
    {
      href: "/admin/ui",
      label: "Tableau de bord",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Produits",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Catégories produits",
      icon: AlignVerticalDistributeEnd,
    },
    {
      href: "/admin/customer",
      label: "Clients",
      icon: Users,
    },
    {
      href: "/admin/parametre",
      label: "Paramètre",
      icon: Settings,
    },
  ];
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
                  {cityName},Côte d&apos;Ivoire
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
      {/* Navbar Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl">
        <div className="flex items-center justify-between p-4">
          {/* Logo et nom */}
          <Link href={Url} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-1">
              <Image
                src={imageLogo}
                fill
                alt={`Logo ${name}`}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">
                {vendorProfile?.name}
              </h1>
              <p className="text-xs text-gray-400">Espace vendeur</p>
            </div>
          </Link>

          {/* Bouton menu burger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        {/* Menu mobile déroulant */}
        {isMobileMenuOpen && (
          <div className="bg-gray-800 border-t border-gray-700 shadow-xl">
            <nav className="py-4">
              <div className="space-y-1 px-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-600 transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5 text-gray-300" />
                    <span className="text-sm font-medium text-gray-300">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Informations vendeur mobile */}
            <div className="px-4 py-4 border-t border-gray-700 bg-gray-900/50">
              <p className="text-xs font-semibold text-gray-400 mb-3">
                Informations vendeur
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-gray-300">{name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-gray-300">{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-gray-300">
                    {cityName},Côte d&pos;Ivoire
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer le menu mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Spacer pour le contenu principal (desktop) */}
      <div className={`hidden lg:block ${isCollapsed ? "w-20" : "w-72"}`} />

      {/* Spacer pour le contenu principal (mobile) */}
      <div className="lg:hidden h-16" />
    </>
  );
}
