"use client";
import { useState, useEffect } from "react";

const DISMISS_KEY = "pwa-banner-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes

export function usePWABannerState() {
  const [isDismissed, setIsDismissed] = useState(true); // Par défaut masqué
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Vérifier si le banner a été fermé récemment
    const dismissedTime = localStorage.getItem(DISMISS_KEY);

    if (dismissedTime) {
      const elapsed = Date.now() - parseInt(dismissedTime);

      // Si moins de 7 jours se sont écoulés, garder masqué
      if (elapsed < DISMISS_DURATION) {
        setIsDismissed(true);
      } else {
        // Sinon, réafficher et nettoyer le localStorage
        localStorage.removeItem(DISMISS_KEY);
        setIsDismissed(false);
      }
    } else {
      // Première visite, afficher le banner
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleInstall = () => {
    // Après installation, masquer définitivement
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  return {
    isDismissed,
    isMinimized,
    handleDismiss,
    handleMinimize,
    handleMaximize,
    handleInstall,
  };
}
