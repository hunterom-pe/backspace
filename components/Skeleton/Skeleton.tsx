import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

export function SkeletonBlock({
  width,
  height,
  circle = false,
}: {
  width?: string;
  height?: string;
  circle?: boolean;
}) {
  const style: CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;
  return (
    <div
      className={`${styles.block} ${circle ? styles.circle : ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.card} aria-hidden="true">
      {children}
    </div>
  );
}

export function SkeletonNav() {
  return <div className={styles.nav} aria-hidden="true" />;
}
