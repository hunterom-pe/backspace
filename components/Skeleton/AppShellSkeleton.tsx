import { SkeletonBlock, SkeletonCard, SkeletonNav } from "./Skeleton";
import styles from "./AppShellSkeleton.module.css";

export function AppShellSkeleton() {
  return (
    <div className={styles.page}>
      <SkeletonNav />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <SkeletonCard>
            <SkeletonBlock height="5.5rem" width="5.5rem" circle />
            <SkeletonBlock height="1rem" width="60%" />
            <SkeletonBlock height="0.85rem" width="40%" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBlock height="0.9rem" width="35%" />
            <SkeletonBlock height="0.85rem" width="90%" />
            <SkeletonBlock height="0.85rem" width="75%" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBlock height="0.9rem" width="30%" />
            <SkeletonBlock height="6rem" width="100%" />
          </SkeletonCard>
        </aside>
        <main className={styles.main}>
          <SkeletonCard>
            <SkeletonBlock height="0.9rem" width="25%" />
            <SkeletonBlock height="4.5rem" width="100%" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBlock height="0.9rem" width="20%" />
            <SkeletonBlock height="3rem" width="100%" />
            <SkeletonBlock height="3rem" width="100%" />
          </SkeletonCard>
        </main>
      </div>
    </div>
  );
}
