import React from "react";
import NavBarAdmin from "../ui/components/NavBarAdmin";
import ListCity from "../ui/components/ListCity";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      <NavBarAdmin />
      <main className="flex-1 transition-all duration-300">
        <div className="mt-14 lg:mt-0">
          <ListCity />
        </div>
      </main>
    </div>
  );
}
