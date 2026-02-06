"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      ("serviceWorker" in navigator &&
        window.location.hostname !== "localhost") ||
      true
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW enregistré avec succès !"))
        .catch((err) => console.error("Erreur SW:", err));
    }
  }, []);

  return null; // Ce composant n'affiche rien, il exécute juste le code
}
