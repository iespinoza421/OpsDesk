"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  ticketId: string | null;
  createdAt: string;
};

export default function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unread = notifications.filter((n) => !n.isRead).length;

  async function loadNotifications() {
    const res = await fetch("/api/notifications");

    if (!res.ok) return;

    const data = await res.json();
    setNotifications(data);
  }

  async function markAsRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
    });

    loadNotifications();
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((value) => !value);
          if (!open) markAsRead();
        }}
        className="relative rounded-xl border border-border bg-card p-2 text-foreground transition hover:bg-muted"
      >
        <Bell size={18} />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
  <div className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-3">
            <h3 className="font-semibold text-card-foreground">
              Notifications
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest updates related to your tickets.
            </p>
          </div>

          {notifications.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {notifications.map((notification) => {
                const content = (
                  <div className="rounded-xl border border-border bg-background p-3 transition hover:bg-muted">
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                );

                return notification.ticketId ? (
                  <Link
                    key={notification.id}
                    href={`/tickets/${notification.ticketId}`}
                    onClick={() => setOpen(false)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}