import React from "react";
import UserComponent from "../ui/components/UserComponent";
import NavBarAdmin from "../ui/components/NavBarAdmin";

export default function Users() {
  return (
    <div className="flex min-h-screen" style={{ background: "#090d13" }}>
      <NavBarAdmin />
      {/*
        min-w-0 : empêche le flex child de dépasser la largeur disponible
        overflow-x-hidden : filet de sécurité contre tout débordement horizontal
        w-0 flex-1 : pattern correct pour qu'un flex child prenne le reste de l'espace
                      sans jamais pousser hors du viewport
      */}
      <main className="w-0 flex-1 min-w-0 overflow-x-hidden pb-24 transition-all duration-300">
        <div className="mt-14 lg:mt-0">
          <UserComponent />
        </div>
      </main>
    </div>
  );
}
