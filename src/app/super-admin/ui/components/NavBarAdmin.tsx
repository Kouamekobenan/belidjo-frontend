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
  ChevronRight,
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

  const NavItem = ({ href, icon: Icon, children }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden
          ${
            isActive
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/20"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
          }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-full" />
        )}
        <Icon
          className={`w-4 h-4 flex-shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? "text-cyan-400" : ""}`}
        />
        <span className="text-sm font-medium tracking-wide">{children}</span>
        {isActive && (
          <ChevronRight className="w-3 h-3 ml-auto text-cyan-400/60" />
        )}
      </Link>
    );
  };

  const MobileNavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "text-cyan-400 bg-cyan-500/10"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
        <span className="text-[10px] font-semibold tracking-wider uppercase">
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 h-full flex-col w-72 z-40"
        style={{
          background: "linear-gradient(180deg, #0d1117 0%, #0f1923 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="flex flex-col h-full p-5">
          {/* LOGO */}
          <Link href="/vendor">
            <div className="mb-8 px-2 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                  }}
                >
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2
                    className="text-sm font-bold tracking-wider uppercase"
                    style={{
                      background:
                        "linear-gradient(90deg, #e2e8f0 0%, #94a3b8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    NoBoutik
                  </h2>
                  <p className="text-[10px] text-teal-500/70 uppercase tracking-widest font-semibold">
                    Admin Panel
                  </p>
                </div>
              </div>
            </div>
          </Link>
          {/* SECTION LABEL */}
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold px-4 mb-3">
            Navigation
          </p>
          {/* NAVIGATION */}
          <nav className="flex-1 space-y-1">
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
              Notifications
            </NavItem>
            <NavItem href="/super-admin/users" icon={User}>
              Utilisateurs
            </NavItem>
          </nav>
          {/* USER INFO */}
          <div className="mt-auto pt-5">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                  }}
                >
                  {user?.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-teal-400 font-medium uppercase tracking-wider">
                    Administrateur
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-slate-600" />
                  <span>{user?.cityName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-600" />
                  <span>{user?.phone}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* BOTTOM NAVIGATION MOBILE */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        style={{
          background: "rgba(13, 17, 23, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
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
            label="Alerts"
          />
          <MobileNavItem href="/super-admin/users" icon={User} label="Users" />
          <button
            onClick={() => setShowUserModal(!showUserModal)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
              showUserModal
                ? "text-cyan-400 bg-cyan-500/10"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <User className={`w-5 h-5 ${showUserModal ? "scale-110" : ""}`} />
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              Profil
            </span>
          </button>
        </div>
      </nav>
      {/* MODAL UTILISATEUR MOBILE */}
      {showUserModal && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowUserModal(false)}
          />
          <div
            className="lg:hidden fixed bottom-16 left-4 right-4 rounded-2xl z-50 p-5"
            style={{
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                }}
              >
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-base font-bold text-slate-100">
                  {user?.name}
                </p>
                <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                  Administrateur
                </p>
              </div>
            </div>
            <div
              className="space-y-3 text-sm text-slate-500 rounded-xl p-3 mb-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600" />
                <span>{user?.cityName || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-600" />
                <span>{user?.phone}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Se déconnecter</span>
            </button>
          </div>
        </>
      )}

      {/* CONTENU PRINCIPAL */}
      <div
        className="lg:ml-72 min-h-screen pb-20 lg:pb-0"
        style={{ background: "#090d13" }}
      >
        {/* Ton contenu de page viendra ici */}
      </div>
    </>
  );
}
