"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageCircle, Calendar, Star, TrendingDown, Trash2, Check } from "lucide-react";
import {
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
} from "@/server/actions/notification.action";
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

interface NotificationsClientProps {
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

export default function NotificationsClient({
  initialNotifications,
  initialUnreadCount,
}: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleMarkAsRead(notif: Notification) {
    if (!notif.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const result = await markAsReadAction(notif.id);
      if (result.error) {
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

    const previousNotifications = notifications;
    const previousUnreadCount = unreadCount;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    const result = await markAllAsReadAction();
    if (result.error) {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      notify.error(result.error);
    } else {
      notify.success("All notifications marked as read");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    setDeletingId(id);
    const result = await deleteNotificationAction(id);
    setDeletingId(null);

    if (result.error) {
      notify.error(result.error);
    } else {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      // If deleted notification was unread, decrement the count
      const deletedNotif = notifications.find((n) => n.id === id);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      notify.success("Notification deleted");
    }
  }

  function getIcon(type: string) {
    const iconClass = "h-5 w-5 text-mosque dark:text-hint-green";
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between border-b border-nordic/10 pb-6 dark:border-white/10">
        <div>
          <h1 className="font-sf text-3xl font-light text-nordic dark:text-clear-day">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-nordic-muted dark:text-clear-day/60">
            You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 rounded-lg border border-nordic/10 bg-white px-4 py-2 text-sm font-semibold text-mosque transition-all hover:bg-nordic/5 dark:border-white/10 dark:bg-white/5 dark:text-hint-green dark:hover:bg-white/10"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 rounded-xl border border-nordic/10 p-5 shadow-sm transition-all dark:border-white/10 ${
                !notif.read
                  ? "border-l-4 border-l-mosque bg-hint-green/5 dark:border-l-hint-green"
                  : "bg-white dark:bg-nordic-muted/10"
              }`}
            >
              {/* Notification Type Icon */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-nordic/5 dark:bg-white/5">
                {getIcon(notif.type)}
              </div>

              {/* Notification Content */}
              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => handleMarkAsRead(notif)}
              >
                <h3
                  className={`text-sm ${!notif.read ? "font-bold text-nordic dark:text-clear-day" : "font-semibold text-nordic/90 dark:text-clear-day/90"}`}
                >
                  {notif.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-nordic-muted dark:text-clear-day/70">
                  {notif.body}
                </p>
                <span className="mt-2 block text-xs text-nordic-muted/60 dark:text-clear-day/40">
                  {getRelativeTimeString(notif.createdAt)}
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleDelete(notif.id)}
                disabled={deletingId === notif.id}
                aria-label="Delete notification"
                className="flex-shrink-0 rounded-lg p-2 text-nordic-muted transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-nordic/20 py-16 text-center dark:border-white/10">
          <Bell size={48} className="mx-auto mb-4 text-nordic-muted/30 dark:text-clear-day/20" />
          <h2 className="text-lg font-medium text-nordic dark:text-clear-day">
            No notifications yet
          </h2>
          <p className="mt-1 text-sm text-nordic-muted dark:text-clear-day/55">
            We will let you know when something new arrives!
          </p>
        </div>
      )}
    </div>
  );
}
