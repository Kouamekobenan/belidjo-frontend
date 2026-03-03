import React from "react";
import UserComponent from "../ui/components/UserComponent";
import NavBarAdmin from "../ui/components/NavBarAdmin";
export default function Users() {
  return (
      <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
        <NavBarAdmin />
        <main className="flex-1 pb-24 transition-all duration-300">
          <div className="mt-14 lg:mt-0">
            <UserComponent />
          </div>
        </main>
      </div>
  );
}
