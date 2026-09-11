"use client";

import React from "react";
import { useNotifications } from "@/app/context/NotificationContext";
import { X, ExternalLink, Sparkles, AlertTriangle, BellRing } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getNotificationTargetUrl } from "../utils/navigation";

export const StartupNotificationModal: React.FC = () => {
  const { startupNotification, dismissStartupModal } = useNotifications();

  if (!startupNotification) return null;

  const targetUrl = getNotificationTargetUrl(startupNotification);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Background glow decorator */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={dismissStartupModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Optional Image banner */}
        {startupNotification.imageUrl ? (
          <div className="relative w-full h-48 sm:h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <Image
              src={startupNotification.imageUrl}
              alt={startupNotification.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/90 text-white backdrop-blur-md mb-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Annonce importante</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 pb-0 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Notification prioritaire</span>
              </span>
            </div>
          </div>
        )}

        {/* Modal content body */}
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {startupNotification.title}
          </h3>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {startupNotification.message}
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={dismissStartupModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Fermer
            </button>

            {targetUrl && (
              <Link
                href={targetUrl}
                onClick={dismissStartupModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-600/25 transition-all transform hover:scale-[1.02]"
              >
                <span>Découvrir</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
