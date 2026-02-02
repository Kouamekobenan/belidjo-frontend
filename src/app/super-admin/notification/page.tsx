"use client";

import { useAuth } from "@/app/context/AuthContext";
import { SendNotificationForm } from "@/app/notification/views/components/SenderNotification";
import { SendNotificationModal } from "@/app/notification/views/components/SendModal";
import { Bell, Plus } from "lucide-react";
import { useState } from "react";
import NavBarAdmin from "../ui/components/NavBarAdmin";

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 overflow-x-hidden">
      {/* Sidebar - Assure-toi qu'elle est responsive à l'intérieur de son composant */}
      <NavBarAdmin />

      {/* Main Content - min-w-0 est indispensable pour éviter les débordements flex */}
      <main className="flex-1 min-w-0 pb-24 transition-all duration-300">
        <div className="mt-16 lg:mt-6 p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header Section: Stacked on mobile, row on desktop */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                <Bell size={28} className="shrink-0" />
              </div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                Notifications
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>Nouvelle notification</span>
            </button>
          </header>

          {/* Form Card Container */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-1">
              {" "}
              {/* Padding léger pour isoler le formulaire si besoin */}
              <SendNotificationForm
                senderId={user?.id}
                onSuccess={() => {
                  // Optionnel: Ajouter un Toast ici au lieu d'un console.log
                  console.log("Notification envoyée !");
                }}
              />
            </div>
          </section>

          {/* Modal */}
          <SendNotificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            senderId={user?.id}
          />
        </div>
      </main>
    </div>
  );
}
