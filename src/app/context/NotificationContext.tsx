"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { Notification } from "../notification/domain/entities/notification.entity";
import { NotificationRepository } from "../notification/infrastructure/notification.repository";
import { useAuth } from "./AuthContext";
import { useDeviceToken } from "../firebase/useDeviceToken";
import { getFirebaseMessaging } from "../lib/firebase";
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import Image from "next/image";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  startupNotification: Notification | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  dismissStartupModal: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const repository = new NotificationRepository();

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startupNotification, setStartupNotification] = useState<Notification | null>(null);
  const hasCheckedStartup = useRef<boolean>(false);

  // Enregistrer le device token FCM automatiquement
  useDeviceToken(user?.id);

  // Récupérer la liste des notifications & Featured Popup au lancement
  const refreshNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const list = await repository.getByUserId(user.id);
      setNotifications(list);

      // 🌟 Popup / Modal au Lancement ("Featured Vendor / Boutique en Vedette")
      if (!hasCheckedStartup.current) {
        hasCheckedStartup.current = true;
        try {
          const featuredPopup = await repository.getFeaturedPopup(user.id);
          if (featuredPopup && !featuredPopup.isRead) {
            setStartupNotification(featuredPopup);
          } else {
            // Fallback : recherche d'une notification prioritaire non lue
            const priorityNotif = list.find(
              (n) => !n.isRead && (n.priority === "URGENT" || n.priority === "HIGH" || n.type === "FEATURED_VENDOR")
            );
            if (priorityNotif) {
              setStartupNotification(priorityNotif);
            }
          }
        } catch {
          // Ignorer si pas de popup dédiée
        }
      }
    } catch (err: any) {
      console.error("❌ Erreur lors du chargement des notifications:", err);
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    hasCheckedStartup.current = false;
    refreshNotifications();
  }, [refreshNotifications]);

  // Écouter les Push notifications FCM en premier plan
  useEffect(() => {
    if (typeof window === "undefined") return;

    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 FCM Message reçu en premier plan :", payload);

      const title = payload.notification?.title || payload.data?.title || "Nouvelle notification";
      const body = payload.notification?.body || payload.data?.message || payload.data?.body || "";
      const imageUrl = payload.notification?.image || payload.data?.imageUrl;
      const actionUrl = payload.data?.actionUrl || payload.data?.url;

      // Afficher un toast visuel personnalisé
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 p-4 transition-all hover:scale-[1.02] cursor-pointer`}
            onClick={() => {
              toast.dismiss(t.id);
              if (actionUrl) {
                window.location.href = actionUrl;
              }
            }}
          >
            <div className="flex-1 w-0 p-1">
              <div className="flex items-start gap-3">
                {imageUrl ? (
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    <Image
                      src={imageUrl}
                      alt="Notif"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-lg">
                    🔔
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        { duration: 5000, position: "top-right" }
      );

      // Recharger les notifications In-App
      refreshNotifications();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? new Notification(
              n.id,
              n.senderId,
              n.receiverId,
              n.title,
              n.message,
              n.type,
              true,
              n.createdAt,
              n.imageUrl,
              n.actionUrl,
              n.priority,
              n.channel,
              n.metadata
            )
          : n
      )
    );

    try {
      await repository.markAsRead(id);
    } catch (err) {
      console.error("❌ Erreur markAsRead:", err);
      refreshNotifications();
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    setNotifications((prev) =>
      prev.map(
        (n) =>
          new Notification(
            n.id,
            n.senderId,
            n.receiverId,
            n.title,
            n.message,
            n.type,
            true,
            n.createdAt,
            n.imageUrl,
            n.actionUrl,
            n.priority,
            n.channel,
            n.metadata
          )
      )
    );

    try {
      await repository.markAllAsRead(user.id);
    } catch (err) {
      console.error("❌ Erreur markAllAsRead:", err);
      refreshNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await repository.deleteNotification(id);
    } catch (err) {
      console.error("❌ Erreur deleteNotification:", err);
      refreshNotifications();
    }
  };

  const dismissStartupModal = () => {
    if (startupNotification) {
      markAsRead(startupNotification.id);
    }
    setStartupNotification(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        startupNotification,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        dismissStartupModal,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé au sein d'un NotificationProvider");
  }
  return context;
};
