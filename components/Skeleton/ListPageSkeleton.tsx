import { SkeletonBlock, SkeletonNav } from "./Skeleton";
import styles from "./ListPageSkeleton.module.css";

export function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={styles.page}>
      <SkeletonNav />
      <div className={styles.container}>
        <SkeletonBlock height="1.4rem" width="30%" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.row}>
            <SkeletonBlock height="2.75rem" width="2.75rem" circle />
            <div className={styles.rowBody}>
              <SkeletonBlock height="0.9rem" width="45%" />
              <SkeletonBlock height="0.8rem" width="70%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
