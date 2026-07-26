import React from "react";
import NavBarAdmin from "../ui/components/NavBarAdmin";
import ListCity from "../ui/components/ListCity";

export default function Page() {
  return (
    <div className="flex min-h-screen" style={{ background: "#090d13" }}>
      <NavBarAdmin />
      <main className="w-0 flex-1 min-w-0 overflow-x-hidden pb-24 transition-all duration-300">
        <div className="mt-14 lg:mt-0">
          <ListCity />
        </div>
      </main>
    </div>
  );
}
