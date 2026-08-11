import { SkeletonBlock, SkeletonNav } from "@/components/Skeleton/Skeleton";
import styles from "./edit-profile.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <SkeletonNav />
      <div className={styles.wrap}>
        <div
          className={styles.card}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <SkeletonBlock height="1.4rem" width="40%" />
          <SkeletonBlock height="4rem" width="4rem" circle />
          <SkeletonBlock height="2.5rem" width="100%" />
          <SkeletonBlock height="2.5rem" width="100%" />
          <SkeletonBlock height="2.5rem" width="100%" />
          <SkeletonBlock height="6rem" width="100%" />
          <SkeletonBlock height="2.75rem" width="100%" />
        </div>
      </div>
    </div>
  );
}
