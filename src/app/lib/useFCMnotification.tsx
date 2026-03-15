// hooks/useFCMNotifications.ts
"use client";
import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useAuth } from "@/app/context/AuthContext";
import app from "./fireb";

export const useFCMNotifications = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const registerFCMToken = async () => {
      try {
        // Demander la permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("❌ Permission notifications refusée");
          return;
        }
        const messaging = getMessaging(app);
        // Obtenir le token FCM
        const fcmToken = await getToken(messaging, {
          vapidKey:
            process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
            "BG7FnzUwqpjoax5sZcznsZxnzybmoFgDaHl0qHEJmIPtauUrpsgn4pwfheOyPW2u5I91pU1D2qym4K1ngjfo0mQ",
        });


        // 🔔 ÉCOUTER LES NOTIFICATIONS EN PREMIER PLAN
        onMessage(messaging, (payload) => {
          // console.log("📩 Message reçu en premier plan:", payload);

          // Afficher une notification personnalisée
          if (payload.notification) {
            new Notification(
              payload.notification.title || "Nouvelle notification",
              {
                body: payload.notification.body,
                icon: "/images/bj.png",
                badge: "/images/bj.png",
                tag: payload.data?.notificationId,
              },
            );
          }
        });
      } catch (error) {
        console.error("❌ Erreur configuration FCM:", error);
      }
    };
    registerFCMToken();
  }, [user]);
};

// Utiliser dans votre composant principal
// app/layout.tsx ou app/providers.tsx
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useFCMNotifications();
  return <>{children}</>;
}
