"use client";
import { usePWAInstall } from "@/app/hook/usePWAInstall";
// import { usePWABannerState } from "@/app/hook/usePWABannerState";
import Image from "next/image";
import { X, Download, Smartphone, Zap, Star, CheckCircle } from "lucide-react";
import { usePWABannerState } from "./usePWABannerState";

type BannerStyle = "minimal" | "standard" | "premium";

interface PWAInstallBannerProps {
  style?: BannerStyle;
}

export default function PWAInstallBanner({
  style = "premium",
}: PWAInstallBannerProps) {
  const { isInstallable, handleInstallClick } = usePWAInstall();
  const {
    isDismissed,
    isMinimized,
    handleDismiss,
    handleMinimize,
    handleMaximize,
    handleInstall: onInstallComplete,
  } = usePWABannerState();

  if (!isInstallable || isDismissed) return null;

  const handleInstall = async () => {
    await handleInstallClick();
    onInstallComplete();
  };

  // ============================================
  // MODE ICÔNE (Minimisé)
  // ============================================
  if (isMinimized) {
    return (
      <button
        onClick={handleMaximize}
        className="fixed bottom-6 right-6 z-[9999] group"
        aria-label="Installer l'application"
      >
        <div className="relative">
          {/* Cercles d'animation */}
          <span className="absolute inset-0 flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          </span>

          {/* Badge notification */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5 z-10">
            <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-teal-500 to-emerald-500 items-center justify-center shadow-lg">
              <Download size={11} className="text-white" />
            </span>
          </span>

          {/* Icône principale */}
          <div className="relative h-14 w-14 rounded-2xl shadow-2xl overflow-hidden border-2 border-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Image
              src="/images/bj.png"
              alt="Logo noBoutik"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Tooltip animé */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap shadow-2xl">
            ⚡ Installer noBoutik
            <div className="absolute top-full right-4 -mt-1">
              <div className="border-[5px] border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  // ============================================
  // STYLE MINIMAL
  // ============================================
  if (style === "minimal") {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[9999] md:max-w-sm md:left-auto md:right-6 animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src="/images/bj.png"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-grow min-w-0">
            <p className="text-xs text-gray-700 font-medium">
              Installer <strong>noBoutik</strong>
            </p>
          </div>

          <button
            onClick={handleInstall}
            className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            Installer
          </button>

          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // STYLE STANDARD
  // ============================================
  if (style === "standard") {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[9999] md:max-w-md md:left-auto md:right-6 animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 flex items-center gap-4">
            <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/bj.png"
                alt="Logo noBoutik"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                noBoutik
              </h3>
              <p className="text-xs text-gray-600">
                Installez pour un accès rapide et hors ligne
              </p>
            </div>

            <button
              onClick={handleMinimize}
              className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
            >
              <Smartphone size={18} />
            </button>

            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Installer maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // STYLE PREMIUM (par défaut)
  // ============================================
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:bottom-6 md:left-auto md:right-6 md:max-w-md animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-gradient-to-br from-white via-white to-teal-50 border border-gray-200 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 px-4 py-2.5 flex items-center justify-between relative overflow-hidden">
          {/* Animation de fond */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>

          <div className="flex items-center gap-2 text-white z-10">
            <Zap size={16} className="fill-current animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wide">
              App Disponible
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Gratuit
            </span>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              onClick={handleMinimize}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all"
              aria-label="Réduire"
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-4 md:p-5">
          <div className="flex items-start gap-4">
            {/* Logo avec effets */}
            <div className="relative flex-shrink-0">
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden shadow-xl ring-4 ring-teal-100">
                <Image
                  src="/images/bj.png"
                  alt="Logo noBoutik"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Badge étoile */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white p-1.5 rounded-full shadow-lg">
                <Star size={12} className="fill-current" />
              </div>
            </div>

            {/* Contenu texte */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-gray-900 text-base md:text-lg">
                  noBoutik
                </h3>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase">
                  PWA
                </span>
              </div>

              <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
                Profitez de l'<strong>accès instantané</strong>, du{" "}
                <strong>mode hors ligne</strong> et des{" "}
                <strong>notifications push</strong>
              </p>

              {/* Liste des avantages */}
              <div className="space-y-1.5 mb-4">
                {[
                  { icon: "⚡", text: "Chargement ultra-rapide" },
                  { icon: "📱", text: "Fonctionne hors ligne" },
                  { icon: "🔔", text: "Notifications en temps réel" },
                  { icon: "🎯", text: "Interface optimisée" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-gray-700"
                  >
                    <CheckCircle
                      size={14}
                      className="text-teal-500 flex-shrink-0"
                    />
                    <span>
                      {feature.icon} {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bouton CTA principal */}
              <button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Download size={18} className="group-hover:animate-bounce" />
                <span>Installer maintenant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer sécurisé */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-2.5 border-t border-gray-100">
          <p className="text-[10px] md:text-xs text-gray-500 text-center flex items-center justify-center gap-2">
            <span className="text-green-600">🔒</span>
            Sécurisé • Gratuit • Installation en 1 clic
          </p>
        </div>
      </div>
    </div>
  );
}
