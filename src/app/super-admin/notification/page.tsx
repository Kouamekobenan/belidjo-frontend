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
    <div className="flex min-h-screen" style={{ background: "#090d13" }}>
      <NavBarAdmin />

      <main className="w-0 flex-1 min-w-0 overflow-x-hidden pb-24 transition-all duration-300">
        <div className="mt-14 lg:mt-0 min-h-screen" style={{ background: "#090d13" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  <Bell className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                    Notifications
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">
                    Envoyez des messages ciblés à vos utilisateurs.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border self-start sm:self-auto active:scale-95"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  color: "#fbbf24",
                  borderColor: "rgba(245,158,11,0.25)",
                }}
              >
                <Plus size={16} />
                Nouvelle notification
              </button>
            </div>

            {/* FORM CARD */}
            <div
              className="rounded-2xl overflow-hidden border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <div
                className="px-6 py-4 border-b border-white/[0.05]"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <h2 className="text-sm font-semibold text-slate-300">
                  Envoyer une notification
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <SendNotificationForm
                  senderId={user?.id}
                  onSuccess={() => {}}
                />
              </div>
            </div>

            {/* MODAL */}
            <SendNotificationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              senderId={user?.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
