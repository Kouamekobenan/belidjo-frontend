"use client";
import NavbarDashbordVendor from "@/app/components/layout/DashBordVendor";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import DashbordVendor from "./components/dashbord/Dashbord";

export default function AdminPage() {
  const { user } = useAuth();
  if (!user) {
    return <div>Chargement...</div>;
  }
  return (
    <div className="flex">
      <NavbarDashbordVendor
        name={user?.name}
        phone={user?.phone}
        cityName={user?.cityName}
        vendorProfile={user?.vendorProfile}
      />
      <div className="">
        <DashbordVendor />
      </div>
    </div>
  );
}
