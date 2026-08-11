"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { markAllNotificationsRead } from "@/lib/notifications/actions";
import { formatRelativeTime } from "@/lib/format-time";
import type { AppNotification, NotificationType } from "@/lib/notifications/queries";
import styles from "./NotificationBell.module.css";

const LABEL: Record<NotificationType, (actorName: string) => string> = {
  friend_request: (name) => `${name} sent you a friend request`,
  friend_accepted: (name) => `${name} accepted your friend request`,
  wall_comment: (name) => `${name} commented on your wall`,
  message: (name) => `${name} sent you a message`,
  top8_added: (name) => `${name} added you to their Top 8`,
};

function linkFor(notification: AppNotification, viewerUsername: string): string {
  const actorUsername = notification.actor?.username;
  switch (notification.type) {
    case "friend_request":
    case "friend_accepted":
      return "/friends";
    case "wall_comment":
      return `/profile/${viewerUsername}`;
    case "message":
      return actorUsername ? `/messages/${actorUsername}` : "/messages";
    case "top8_added":
      return actorUsername ? `/profile/${actorUsername}` : "/";
    default:
      return "/";
  }
}

export function NotificationBell({
  viewerId,
  viewerUsername,
  initialNotifications,
  initialUnreadCount,
}: {
  viewerId: string;
  viewerUsername: string;
  initialNotifications: AppNotification[];
  initialUnreadCount: number;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickAway(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickAway);
    return () => document.removeEventListener("click", onClickAway);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function subscribe() {
      // The realtime websocket needs the session's access token explicitly
      // (via setAuth) before subscribing, or it connects unauthenticated and
      // RLS silently filters out every postgres_changes event.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        supabase.realtime.setAuth(session.access_token);
      }

      channel = supabase
        .channel(`notifications:${viewerId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${viewerId}`,
          },
          (payload) => {
            const row = payload.new as {
              id: string;
              type: NotificationType;
              created_at: string;
              read_at: string | null;
              actor_id: string | null;
            };

            async function applyInsert() {
              let actor: AppNotification["actor"] = null;
              if (row.actor_id) {
                const { data } = await supabase
                  .from("profiles")
                  .select("username, display_name, avatar_url")
                  .eq("id", row.actor_id)
                  .single();
                actor = data;
              }

              setNotifications((prev) =>
                [
                  {
                    id: row.id,
                    type: row.type,
                    created_at: row.created_at,
                    read_at: row.read_at,
                    actor,
                  },
                  ...prev,
                ].slice(0, 15),
              );
              setUnreadCount((c) => c + 1);
            }

            applyInsert();
          },
        )
        .subscribe();
    }

    subscribe();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [viewerId]);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setUnreadCount(0);
      markAllNotificationsRead();
    }
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.bell}
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={open}
      >
        🔔
        {unreadCount > 0 ? (
          <span className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        ) : null}
      </button>

      {open ? (
        <div className={styles.dropdown} role="menu">
          <p className={styles.dropdownTitle}>Notifications</p>
          {notifications.length === 0 ? (
            <p className={styles.empty}>No notifications yet.</p>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => {
                const actorName = n.actor?.display_name || n.actor?.username || "Someone";
                const label = LABEL[n.type](actorName);
                return (
                  <li key={n.id}>
                    <Link
                      href={linkFor(n, viewerUsername)}
                      className={styles.item}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.itemText}>{label}</span>
                      <span className={styles.itemTime}>{formatRelativeTime(n.created_at)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
