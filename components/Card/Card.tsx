import type { ReactNode } from "react";
import styles from "./Card.module.css";

export function Card({
  title,
  icon,
  action,
  children,
}: {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.card}>
      {title ? (
        <header className={styles.header}>
          <h2 className={styles.title}>
            {icon ? (
              <span className={styles.titleIcon} aria-hidden="true">
                {icon}
              </span>
            ) : null}
            {title}
          </h2>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}
