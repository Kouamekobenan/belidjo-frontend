// lib/firebase.ts (ou app/lib/firebase.ts selon votre structure)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// Configuration Firebase - Récupérez ces valeurs depuis Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD2FmNvffRnAxDnCao8BtHQ6kYFYD5WRo8",
  authDomain: "otp-findi.firebaseapp.com",
  projectId: "otp-findi",
  storageBucket: "otp-findi.firebasestorage.app",
  messagingSenderId: "909580340044",
  appId: "1:909580340044:web:af1bc575356ed048929de9",
  measurementId: "G-D6T8RP4QYF",
};

// Initialiser Firebase (une seule fois)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Fonction pour obtenir le messaging (avec vérification de support)
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export default app;
