"use client";

import { usePresenceStatus } from "./PresenceProvider";
import styles from "./PresenceDot.module.css";

const STATUS_LABEL = {
  online: "Online",
  away: "Away",
  offline: "Offline",
} as const;

export function PresenceDot({
  userId,
  fallbackStatus,
  className,
}: {
  userId: string;
  fallbackStatus: "online" | "away" | "offline";
  className?: string;
}) {
  const status = usePresenceStatus(userId, fallbackStatus);

  return (
    <span
      className={`${styles.dot} ${styles[status]} ${className ?? ""}`}
      title={STATUS_LABEL[status]}
    />
  );
}
