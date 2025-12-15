"use client";
import NavbarDashbordVendor from "@/app/components/layout/DashBordVendor";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import DashbordVendor from "./components/dashbord/Dashbord";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mb-3"></div>
          <p className="text-base text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavbarDashbordVendor
        name={user?.name}
        phone={user?.phone}
        cityName={user?.cityName}
        vendorProfile={user?.vendorProfile}
      />

      {/* Conteneur principal avec gestion du spacing de la navbar */}
      <main className="flex-1 w-full pt-9">
        <DashbordVendor />
      </main>
    </div>
  );
}
