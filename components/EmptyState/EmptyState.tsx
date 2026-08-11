import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

export function EmptyState({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <p className={styles.message}>{children}</p>
    </div>
  );
}
