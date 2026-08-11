import { SkeletonBlock, SkeletonNav } from "@/components/Skeleton/Skeleton";
import styles from "./loading.module.css";

const BUBBLE_WIDTHS = ["45%", "60%", "35%", "50%", "40%"];

export default function Loading() {
  return (
    <div className={styles.page}>
      <SkeletonNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <SkeletonBlock height="2.25rem" width="2.25rem" circle />
          <SkeletonBlock height="1rem" width="8rem" />
        </div>
        {BUBBLE_WIDTHS.map((width, i) => (
          <div key={i} className={`${styles.bubbleRow} ${i % 2 ? styles.fromMe : ""}`}>
            <SkeletonBlock height="2.25rem" width={width} />
          </div>
        ))}
      </div>
    </div>
  );
}
