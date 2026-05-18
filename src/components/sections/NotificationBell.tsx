"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, MessageCircle, Calendar, Star, TrendingDown, Check } from "lucide-react";
import { markAsReadAction, markAllAsReadAction } from "@/server/actions/notification.action";
import { notify } from "@/lib/toast";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationBellProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

function getRelativeTimeString(date: Date | string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function NotificationBell({
  initialNotifications,
  initialUnreadCount,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sync state with server props when they change
  useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleNotificationClick(notif: Notification) {
    setIsOpen(false);

    // Optimistic update
    if (!notif.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const result = await markAsReadAction(notif.id);
      if (result.error) {
        // Rollback on error
        setNotifications(initialNotifications);
        setUnreadCount(initialUnreadCount);
        notify.error(result.error);
        return;
      }
    }

    router.push(notif.href);
  }

  async function handleMarkAllAsRead() {
    if (unreadCount === 0) return;

    // Optimistic update
    const previousNotifications = notifications;
    const previousUnreadCount = unreadCount;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    const result = await markAllAsReadAction();
    if (result.error) {
      // Rollback on error
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      notify.error(result.error);
    } else {
      notify.success("All notifications marked as read");
    }
  }

  function getIcon(type: string) {
    const iconClass = "h-4 w-4 text-mosque dark:text-hint-green";
    switch (type) {
      case "message":
        return <MessageCircle className={iconClass} />;
      case "visit":
        return <Calendar className={iconClass} />;
      case "review":
        return <Star className={iconClass} />;
      case "price_drop":
        return <TrendingDown className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  }

  const displayedNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-nordic">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-nordic/10 bg-white shadow-soft backdrop-blur-md transition-all duration-200 dark:border-white/10 dark:bg-nordic-muted/95 md:w-96 ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {/* Dropdown Header */}
        <div className="flex items-center justify-between border-b border-nordic/10 px-4 py-3 dark:border-white/10">
          <span className="text-sm font-semibold text-nordic dark:text-clear-day">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-xs font-medium text-mosque transition-colors hover:text-mosque/80 dark:text-hint-green dark:hover:text-hint-green/80"
            >
              <Check size={13} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Dropdown List */}
        <div className="max-h-[360px] overflow-y-auto py-1">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-nordic/5 dark:hover:bg-white/5 ${
                  !notif.read ? "bg-hint-green/10" : "bg-transparent"
                }`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-nordic/5 dark:bg-white/5">
                  {getIcon(notif.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs ${!notif.read ? "font-bold text-nordic dark:text-clear-day" : "font-medium text-nordic/80 dark:text-clear-day/80"}`}
                  >
                    {notif.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-nordic-muted dark:text-clear-day/60">
                    {notif.body}
                  </p>
                  <span className="mt-1 block text-[10px] text-nordic-muted/60 dark:text-clear-day/40">
                    {getRelativeTimeString(notif.createdAt)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 text-center">
              <Bell
                size={24}
                className="mx-auto mb-2 text-nordic-muted/40 dark:text-clear-day/30"
              />
              <p className="text-sm text-nordic-muted dark:text-clear-day/60">
                No notifications yet
              </p>
            </div>
          )}
        </div>

        {/* Dropdown Footer */}
        <div className="border-t border-nordic/10 py-1.5 text-center dark:border-white/10">
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-semibold text-nordic-muted transition-colors hover:text-nordic dark:text-clear-day/60 dark:hover:text-clear-day"
          >
            See all
          </Link>
        </div>
      </div>
    </div>
  );
}
