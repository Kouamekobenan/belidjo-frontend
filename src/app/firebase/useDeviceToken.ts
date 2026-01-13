// src/hooks/useDeviceToken.ts
import { useEffect } from "react";
import axios from "axios";
import { requestDeviceToken } from "../lib/firebase";
import { api } from "../lib/api";

export const useDeviceToken = (userId: string, jwt: string) => {
  useEffect(() => {
    if (!userId || !jwt) return;

    const sendDeviceTokenToBackend = async () => {
      try {
        const token = await requestDeviceToken();
        if (!token) return;
        await api.patch("/users/device-token", { deviceToken: token });
        await axios.patch(
          "/api/users/device-token", // ton endpoint backend
          { deviceToken: token },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        console.log("✅ Device token envoyé au backend !");
      } catch (error) {
        console.error("❌ Erreur lors de l'envoi du device token :", error);
      }
    };

    sendDeviceTokenToBackend();
  }, [userId, jwt]);
};
