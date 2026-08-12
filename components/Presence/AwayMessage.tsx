"use client";

import { usePresenceStatus } from "./PresenceProvider";
import { MoonIcon } from "@/components/icons";
import styles from "./AwayMessage.module.css";

export function AwayMessage({
  userId,
  fallbackStatus,
  message,
}: {
  userId: string;
  fallbackStatus: "online" | "away" | "offline";
  message: string | null;
}) {
  const status = usePresenceStatus(userId, fallbackStatus);

  if (status !== "away" || !message) return null;

  return (
    <p className={styles.awayMessage}>
      <MoonIcon size={12} className={styles.icon} aria-hidden="true" />
      {message}
    </p>
  );
}
