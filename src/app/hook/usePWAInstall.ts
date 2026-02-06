"use client";
import { useState, useEffect } from "react";

/**
 * Ce fichier sert à capturer l'événement d'installation du navigateur.
 * Par défaut, le navigateur cache cet événement. Ce hook nous permet
 * de le récupérer pour l'utiliser sur notre propre bouton.
 */

export const usePWAInstall = () => {
  // On stocke l'événement d'installation ici
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Est-ce que l'application peut être installée ? (Oui/Non)
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // 1. On empêche le navigateur d'afficher sa propre petite barre moche
      e.preventDefault();

      // 2. On garde l'événement précieusement pour plus tard
      setDeferredPrompt(e);

      // 3. On prévient l'interface qu'on peut maintenant afficher notre bouton
      setIsInstallable(true);
    };

    // On écoute l'événement spécial "beforeinstallprompt"
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      // Nettoyage si on quitte la page
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 4. On montre la fenêtre d'installation officielle du système (Android/Chrome)
    deferredPrompt.prompt();

    // 5. On attend de voir si l'utilisateur a accepté ou refusé
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("L'utilisateur a installé l'application !");
      setIsInstallable(false); // On cache le bouton puisqu'il a installé
    } else {
      console.log("L'utilisateur a refusé l'installation.");
    }

    // On vide l'événement, il ne peut être utilisé qu'une seule fois
    setDeferredPrompt(null);
  };

  return { isInstallable, handleInstallClick };
};
