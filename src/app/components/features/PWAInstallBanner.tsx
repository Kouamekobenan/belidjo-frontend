"use client";
import { usePWAInstall } from "@/app/hook/usePWAInstall";
import Image from "next/image";

export default function PWAInstallBanner() {
  const { isInstallable, handleInstallClick } = usePWAInstall();

  // On ne l'affiche que si l'installation est possible (Service Worker actif + compatible)
  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:max-w-md md:left-auto md:right-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-500">
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            src="/images/bj.png"
            alt="Logo noBoutik"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 text-sm">noBoutik</h3>
          <p className="text-xs text-gray-500">
            Installez l'app pour une meilleure expérience
          </p>
        </div>

        <button
          onClick={handleInstallClick}
          className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
        >
          Installer
        </button>
      </div>
    </div>
  );
}
