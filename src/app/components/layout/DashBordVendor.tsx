"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
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
  Video,
  Store,
  ExternalLink,
} from "lucide-react";
import { IvendorProfile } from "@/app/lib/globals.type";

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
  const pathname = usePathname();

  const publicStoreUrl = `/products/ui/page/${vendorProfile?.id}`;
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
      label: "Gestion des Produits",
      shortLabel: "Produits",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Catégories",
      shortLabel: "Catégories",
      icon: AlignVerticalDistributeEnd,
    },
    {
      href: "/admin/customer",
      label: "Mes Abonnés & Clients",
      shortLabel: "Clients",
      icon: Users,
    },
    {
      href: "/admin/template/page",
      label: "Créateur de Vidéos",
      shortLabel: "Vidéos",
      icon: Video,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* SIDEBAR DESKTOP PRO (Modern Slate Layout) */}
      {/* ========================================================================= */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out z-40 shadow-2xl border-r border-slate-800/80 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* En-tête avec Logo et Nom Boutique */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <Link href={publicStoreUrl} className="flex items-center gap-3 group overflow-hidden">
              <div className="relative w-11 h-11 flex-shrink-0 rounded-2xl overflow-hidden bg-white p-1 shadow-md border border-slate-700">
                <Image
                  src={imageLogo}
                  fill
                  alt={`Logo ${name}`}
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-sm font-black text-white truncate group-hover:text-green-400 transition-colors">
                    {vendorProfile?.name || name}
                  </h1>
                  <p className="text-[11px] font-semibold text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Espace Marchand</span>
                  </p>
                </div>
              )}
            </Link>

            {/* Bouton de réduction / affichage */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors shrink-0"
              aria-label={isCollapsed ? "Étendre" : "Réduire"}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Banner statut & essai gratuit */}
        {!isCollapsed && (
          <div className="mx-3 mt-4 mb-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">Compte Vendeur</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Actif
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              {trialDaysRemaining} jours restants dans votre abonnement
            </p>
            <Link href={publicStoreUrl} target="_blank">
              <button className="w-full bg-slate-900 hover:bg-green-600 text-white text-[11px] font-bold py-2 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1">
                <span>Voir ma boutique</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </Link>
          </div>
        )}

        {/* Navigation principale */}
        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 group ${
                  active
                    ? "bg-green-600 text-white font-bold shadow-lg shadow-green-600/30"
                    : "hover:bg-slate-900 text-slate-400 hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active ? "text-white" : "text-slate-400 group-hover:text-green-400"
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-xs font-semibold truncate">{item.label}</span>
                )}
              </Link>
            );
          })}

          {/* Paramètres */}
          <Link
            href="/admin/parametre"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 group ${
              isActive("/admin/parametre")
                ? "bg-green-600 text-white font-bold shadow-lg shadow-green-600/30"
                : "hover:bg-slate-900 text-slate-400 hover:text-white"
            }`}
            title={isCollapsed ? "Paramètres" : undefined}
          >
            <Settings
              className={`w-5 h-5 flex-shrink-0 ${
                isActive("/admin/parametre") ? "text-white" : "text-slate-400 group-hover:text-green-400"
              }`}
            />
            {!isCollapsed && <span className="text-xs font-semibold truncate">Paramètres</span>}
          </Link>
        </nav>

        {/* Footer informations vendeur */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          {!isCollapsed ? (
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 truncate">
                <User className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span className="font-semibold text-white truncate">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span className="truncate">{cityName || "Bondoukou"}, CI</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <User className="w-4 h-4 text-green-400" />
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* HEADER MOBILE (Haut de page) */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950 text-white border-b border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={publicStoreUrl} className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 border border-slate-700">
              <Image src={imageLogo} fill alt={`Logo ${name}`} className="object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white truncate max-w-[160px]">
                {vendorProfile?.name || name}
              </h1>
              <p className="text-[10px] text-green-400 font-semibold">NoBoutik Marchand</p>
            </div>
          </Link>

          <Link href="/admin/parametre">
            <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARRE DE NAVIGATION MOBILE BOTTOM (Style App Native iOS/Android) */}
      {/* ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800/80 shadow-2xl">
        <div className="grid grid-cols-5 h-16">
          
          <Link
            href="/admin/ui"
            className={`flex flex-col items-center justify-center space-y-1 relative transition-all ${
              isActive("/admin/ui") ? "text-green-400 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
            {isActive("/admin/ui") && (
              <div className="absolute bottom-0 w-8 h-1 bg-green-500 rounded-t-full" />
            )}
          </Link>

          <Link
            href="/admin/products"
            className={`flex flex-col items-center justify-center space-y-1 relative transition-all ${
              isActive("/admin/products") ? "text-green-400 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px]">Produits</span>
            {isActive("/admin/products") && (
              <div className="absolute bottom-0 w-8 h-1 bg-green-500 rounded-t-full" />
            )}
          </Link>

          <Link
            href="/admin/template/page"
            className={`flex flex-col items-center justify-center space-y-1 relative transition-all ${
              isActive("/admin/template/page") ? "text-green-400 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-[10px]">Vidéos</span>
            {isActive("/admin/template/page") && (
              <div className="absolute bottom-0 w-8 h-1 bg-green-500 rounded-t-full" />
            )}
          </Link>

          <Link
            href={publicStoreUrl}
            target="_blank"
            className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-white transition-all"
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px]">Boutique</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-white transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Menu</span>
          </button>
        </div>
      </nav>

      {/* Modal Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 animate-in fade-in">
          <div className="absolute bottom-16 left-0 right-0 bg-slate-900 rounded-t-3xl border-t border-slate-800 shadow-2xl p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5">
                  <Image src={imageLogo} fill alt={`Logo ${name}`} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{vendorProfile?.name || name}</h3>
                  <p className="text-xs text-slate-400">Paramètres & Actions</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <Link href="/admin/parametre" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-green-400" />
                    <span>Paramètres Boutique</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/admin/categories" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlignVerticalDistributeEnd className="w-5 h-5 text-blue-400" />
                    <span>Catégories Produits</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/admin/customer" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>Mes Abonnés & Clients</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Spacers pour compenser le contenu */}
      <div className={`hidden lg:block ${isCollapsed ? "w-20" : "w-72"}`} />
      <div className="lg:hidden h-14" />
      <div className="lg:hidden h-16" />
    </>
  );
}
