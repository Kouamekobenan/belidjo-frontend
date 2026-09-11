"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/app/context/NotificationContext";
import { Bell } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
  badgeClassName?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = "",
  iconClassName = "w-5 h-5",
  badgeClassName = "",
}) => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className={iconClassName} />

        {unreadCount > 0 && (
          <>
            {/* Ping indicator animation */}
            <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>

            {/* Unread badge count */}
            <span
              className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full shadow-md border-2 border-white dark:border-slate-900 ${badgeClassName}`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};
