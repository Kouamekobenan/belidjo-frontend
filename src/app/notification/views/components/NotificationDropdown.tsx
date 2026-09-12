"use client";

import React, { useState } from "react";
import { useNotifications } from "@/app/context/NotificationContext";
import { Notification } from "../../domain/entities/notification.entity";
import {
  CheckCheck,
  Check,
  Trash2,
  Bell,
  ExternalLink,
  ShoppingBag,
  Tag,
  Info,
  AlertTriangle,
  Sparkles,
  Heart,
  MessageSquare,
  Package,
  AlertCircle,
  Store,
  TrendingUp,
  Flame,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getNotificationTargetUrl } from "../utils/navigation";

interface NotificationDropdownProps {
  onClose?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } =
    useNotifications();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  // Filtrage et tri par date décroissante
  const filteredNotifications = notifications
    .filter((n) => (filter === "UNREAD" ? !n.isRead : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatRelativeTime = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const getNotificationIcon = (type: string, priority?: string) => {
    if (priority === "URGENT") {
      return (
        <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
          <Flame className="w-4 h-4" />
        </div>
      );
    }
    if (priority === "HIGH") {
      return (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }

    switch (type) {
      case "LIKE":
        return (
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <Heart className="w-4 h-4" />
          </div>
        );
      case "COMMENT":
        return (
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case "ORDER_STATUS":
        return (
          <div className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            <Package className="w-4 h-4" />
          </div>
        );
      case "STOCK_ALERT":
        return (
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case "NEW_PRODUCT":
        return (
          <div className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case "FEATURED_VENDOR":
        return (
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Store className="w-4 h-4" />
          </div>
        );
      case "TRENDING":
        return (
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        );
      case "NEW_INVITATION":
        return (
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case "PROMO":
      case "PROMO_MODAL":
        return (
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Tag className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  const getTargetUrl = (notification: Notification): string | null => {
    return getNotificationTargetUrl(notification);
  };


  return (
    <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden backdrop-blur-xl z-50 flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "À jour"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl transition-all"
            title="Tout marquer comme lu"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tout lire</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-2 bg-white dark:bg-slate-900">
        <button
          onClick={() => setFilter("ALL")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            filter === "ALL"
              ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            filter === "UNREAD"
              ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Non lues ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[380px] min-h-[160px]">
        {loading && notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Chargement des notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Aucune notification
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Vous n'avez pas de notification {filter === "UNREAD" ? "non lue" : ""} pour le moment.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const targetUrl = getTargetUrl(notif);
            return (
              <div
                key={notif.id}
                className={`p-3.5 group relative flex items-start gap-3 transition-colors ${
                  notif.isRead
                    ? "bg-white dark:bg-slate-900 opacity-75 hover:opacity-100"
                    : "bg-green-500/5 dark:bg-green-950/20"
                }`}
              >
                {/* Indicator dot */}
                {!notif.isRead && (
                  <span className="absolute left-1.5 top-5 w-2 h-2 rounded-full bg-green-500" />
                )}

                {/* Icon or Image */}
                <div className="flex-shrink-0 mt-0.5">
                  {notif.imageUrl ? (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <Image
                        src={notif.imageUrl}
                        alt="Image notification"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    getNotificationIcon(notif.type, notif.priority)
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Action Link */}
                  {targetUrl && (
                    <div className="mt-2">
                      <Link
                        href={targetUrl}
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif.id);
                          if (onClose) onClose();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 hover:underline"
                      >
                        <span>Voir les détails</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Actions (Mark read / Delete) */}
                <div className="absolute right-2 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 p-1 rounded-xl shadow-sm">
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-green-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
        <p className="text-[11px] text-slate-400 font-medium">
          NoBoutik Notifications
        </p>
      </div>
    </div>
  );
};
