import { useEffect, useRef } from "react";
import { requestDeviceToken } from "../lib/firebase";
import { api } from "../lib/api";

export const useDeviceToken = (userId?: string, jwt?: string) => {
  const lastSentToken = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const sendDeviceTokenToBackend = async () => {
      try {
        const token = await requestDeviceToken();
        if (!token || token === lastSentToken.current) return;

        await api.patch("/users/device-token", { deviceToken: token });
        lastSentToken.current = token;
        console.log("✅ FCM Device token enregistré sur le backend !");
      } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement du device token :", error);
      }
    };

    sendDeviceTokenToBackend();
  }, [userId, jwt]);
};

