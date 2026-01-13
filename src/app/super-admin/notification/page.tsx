// app/admin/notifications/page.tsx
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
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      <NavBarAdmin />
      <main className="flex-1 transition-all duration-300">
        <div className="mt-14 lg:mt-3 p-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell size={32} />
              Gestion des notifications
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Nouvelle notification
            </button>
          </div>

          {/* Formulaire en ligne */}
          <div className="mb-8">
            <SendNotificationForm
              senderId={user?.id}
              onSuccess={() => {
                console.log("Notification envoyée !");
              }}
            />
          </div>

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
