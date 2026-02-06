"use client";
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // 🔍 DEBUG: Vérifier l'environnement
    console.log("🚀 [PWA] Hook initialized");
    console.log("🌍 [PWA] Environment:", {
      isClient: typeof window !== "undefined",
      isSecure: window.location.protocol === "https:",
      userAgent: navigator.userAgent,
      standalone: window.matchMedia("(display-mode: standalone)").matches,
    });

    // ⚠️ Si déjà installé, on arrête
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("✅ [PWA] Already installed - hiding banner");
      setIsInstallable(false);
      return;
    }

    const handler = (e: Event) => {
      console.log("🎉 [PWA] beforeinstallprompt event fired!", e);
      e.preventDefault();

      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      console.log("✅ [PWA] Install prompt captured - banner should show now");
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 🔍 DEBUG: Vérifier après 3 secondes si l'événement s'est déclenché
    const debugTimeout = setTimeout(() => {
      if (!deferredPrompt) {
        console.warn("⚠️ [PWA] beforeinstallprompt NOT fired after 3s");
        console.log("💡 Possible reasons:");
        console.log("  - App already installed");
        console.log("  - Not HTTPS (prod requirement)");
        console.log("  - Service Worker not registered");
        console.log("  - Manifest.json invalid or missing");
        console.log("  - Browser doesn't support PWA (iOS Safari)");
        console.log("  - Install criteria not met");
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(debugTimeout);
    };
  }, [deferredPrompt]); // ⚠️ Ajout de dépendance

  const handleInstallClick = async () => {
    console.log("🖱️ [PWA] Install button clicked");

    if (!deferredPrompt) {
      console.error("❌ [PWA] No install prompt available");
      return;
    }

    try {
      console.log("📲 [PWA] Showing install prompt...");
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      console.log("📊 [PWA] User choice:", outcome);

      if (outcome === "accepted") {
        console.log("✅ [PWA] User accepted installation!");
        setIsInstallable(false);
      } else {
        console.log("❌ [PWA] User dismissed installation");
      }
    } catch (error) {
      console.error("💥 [PWA] Install error:", error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return { isInstallable, handleInstallClick };
};
