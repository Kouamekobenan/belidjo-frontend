import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD2FmNvffRnAxDnCao8BtHQ6kYFYD5WRo8",
  authDomain: "otp-findi.firebaseapp.com",
  projectId: "otp-findi",
  storageBucket: "otp-findi.firebasestorage.app",
  messagingSenderId: "909580340044",
  appId: "1:909580340044:web:af1bc575356ed048929de9",
  measurementId: "G-D6T8RP4QYF",
};

// 🔹 Initialise Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Initialise Firebase Cloud Messaging
export const messaging = getMessaging(app);

// 🔹 Fonction pour obtenir le token Firebase
export const requestDeviceToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("⚠️ Permission refusée pour les notifications");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey:
        process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
        "BG7FnzUwqpjoax5sZcznsZxnzybmoFgDaHl0qHEJmIPtauUrpsgn4pwfheOyPW2u5I91pU1D2qym4K1ngjfo0mQ", // ta clé VAPID
    });

    if (token) {
      console.log("✅ Token Firebase :", token);
      return token;
    } else {
      console.warn("⚠️ Aucun token reçu de Firebase");
      return null;
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération du token Firebase :",
      error
    );
    return null;
  }
};

// 🔹 Listener pour les notifications en direct (pendant que l’app est ouverte)
onMessage(messaging, (payload) => {
  console.log("📩 Notification reçue :", payload);
});
