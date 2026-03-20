"use client";
import React from "react";
import { Navbar } from "../vendor/page";
import ProfileComponent from "../components/features/Profile";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <main className="relative z-0 pb-24 md:pb-12">
        <ProfileComponent />
      </main>
    </div>
  );
}
