"use client";
import { useAuth } from "@/app/context/AuthContext";
import {
  LayoutDashboard,
  MapPin,
  Bell,
  User,
  Phone,
  Home,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBarAdmin() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showUserModal, setShowUserModal] = useState(false);
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const NavItem = ({ href, icon: Icon, children }: any) => (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-all duration-200 group"
    >
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  const MobileNavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "text-teal-600 bg-teal-50"
            : "text-slate-500 hover:text-teal-600"
        }`}
      >
        <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full bg-white border-r border-slate-100 w-72 z-40">
        <div className="flex flex-col h-full p-6">
          {/* LOGO / TITRE */}
          <Link href="/vendor">
            <div className="mb-10 px-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Gestion de NoBoutik
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex-1 space-y-2">
            <NavItem href="/vendor" icon={Home}>
              Accueil
            </NavItem>
            <NavItem href="/super-admin" icon={LayoutDashboard}>
              Tableau de bord
            </NavItem>

            <NavItem href="/super-admin/city" icon={MapPin}>
              Gestion des villes
            </NavItem>
            <NavItem href="/super-admin/notification" icon={Bell}>
              Gestion de notifications
            </NavItem>
          </nav>

          {/* INFO UTILISATEUR (BAS DE SIDEBAR) */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-teal-600 font-medium capitalize">
                    Administrateur
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-[13px] text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{user?.cityName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{user?.phone}</span>
                </div>
                <div className="">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* BOTTOM NAVIGATION MOBILE */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          <MobileNavItem href="/vendor" icon={Home} label="Home" />
          <MobileNavItem
            href="/super-admin"
            icon={LayoutDashboard}
            label="Accueil"
          />
          <MobileNavItem
            href="/super-admin/city"
            icon={MapPin}
            label="Villes"
          />
          <MobileNavItem
            href="/super-admin/notification"
            icon={Bell}
            label="Notifications"
          />
          <button
            onClick={() => setShowUserModal(!showUserModal)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
              showUserModal
                ? "text-teal-600 bg-teal-50"
                : "text-slate-500 hover:text-teal-600"
            }`}
          >
            <User className={`w-6 h-6 ${showUserModal ? "scale-110" : ""}`} />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </nav>
      {/* MODAL UTILISATEUR MOBILE */}
      {showUserModal && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            onClick={() => setShowUserModal(false)}
          />
          <div className="lg:hidden fixed bottom-16 left-4 right-4 bg-white rounded-2xl shadow-xl z-50 p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-900">
                  {user?.name}
                </p>
                <p className="text-sm text-teal-600 font-medium capitalize">
                  Administrateur
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{user?.cityName || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{user?.phone}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </>
      )}
      {/* AJUSTEMENT DU CONTENU PRINCIPAL */}
      <div className="lg:ml-72 min-h-screen bg-slate-50/50 pb-20 lg:pb-0">
        {/* Ton contenu de page viendra ici */}
      </div>
    </>
  );
}
