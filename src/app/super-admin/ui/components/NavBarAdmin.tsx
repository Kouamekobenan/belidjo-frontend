"use client";
import { useAuth } from "@/app/context/AuthContext";
import {
  AlertCircle,
  LogIn,
  LayoutDashboard,
  MapPin,
  Menu,
  X,
  User as UserIcon,
  Phone,
  Calendar,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function NavBarAdmin() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const NavItem = ({ href, icon: Icon, children }: any) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-all duration-200 group"
    >
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  return (
    <>
      {/* BOUTON MENU MOBILE */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white shadow-md rounded-xl text-slate-600 border border-slate-100"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR MAIN */}
      <aside
        className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-100 w-72 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full p-6">
          {/* LOGO / TITRE */}
          <Link href="/page">
            <div className="mb-10 px-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Gestion de la ville
              </p>
            </div>
          </Link>
          {/* NAVIGATION */}
          <nav className="flex-1 space-y-2">
            <NavItem href="/super-admin" icon={LayoutDashboard}>
              Tableau de bord
            </NavItem>
            <NavItem href="/super-admin/city" icon={MapPin}>
              Gestion des villes
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
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* AJUSTEMENT DU CONTENU PRINCIPAL */}
      <div className="lg:ml-72 min-h-screen bg-slate-50/50">
        {/* Ton contenu de page viendra ici */}
      </div>
    </>
  );
}
