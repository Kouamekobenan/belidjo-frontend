import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD2FmNvffRnAxDnCao8BtHQ6kYFYD5WRo8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "otp-findi.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otp-findi",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "otp-findi.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "909580340044",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:909580340044:web:af1bc575356ed048929de9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-D6T8RP4QYF",
};

// 🔹 Initialise Firebase App (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      return getMessaging(app);
    } catch (err) {
      console.error("❌ Firebase Messaging not supported in this browser environment:", err);
      return null;
    }
  }
  return null;
};

// 🔹 Fonction pour obtenir le token Firebase
export const requestDeviceToken = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("⚠️ Permission refusée pour les notifications Push");
      return null;
    }

    const messaging = getFirebaseMessaging();
    if (!messaging) return null;

    // Enregistrer le Service Worker FCM s'il n'est pas actif
    let serviceWorkerRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      try {
        serviceWorkerRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
      } catch (swErr) {
        console.warn("⚠️ Service worker registration warning:", swErr);
      }
    }

    const vapidKey =
      process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
      "BG7FnzUwqpjoax5sZcznsZxnzybmoFgDaHl0qHEJmIPtauUrpsgn4pwfheOyPW2u5I91pU1D2qym4K1ngjfo0mQ";

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    if (token) {
      console.log("✅ Token FCM récuperé avec succès :", token);
      return token;
    } else {
      console.warn("⚠️ Aucun token FCM retourné par Firebase");
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du Device Token FCM :", error);
    return null;
  }
};

export { app };

