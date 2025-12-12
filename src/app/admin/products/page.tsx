"use client";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import NavbarDashbordVendor from "@/app/components/layout/DashBordVendor";
import VendorProductList from "../ui/components/products/ProductListVendor";

export default function ProductListAdmin() {
  const { user } = useAuth();
  const vendorId = user?.vendorProfile.id;
  if (!vendorId) {
    return;
  }
  return (
    <div className="flex ">
      <NavbarDashbordVendor
        name={user?.name}
        phone={user?.phone}
        cityName={user?.cityName}
        vendorProfile={user?.vendorProfile}
      />
      <VendorProductList vendorId={vendorId} />
    </div>
  );
}
