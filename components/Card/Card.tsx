import type { ReactNode } from "react";
import styles from "./Card.module.css";

export function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.card}>
      {title ? (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}
