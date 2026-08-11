import Link from "next/link";
import styles from "./status-page.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <p className={styles.title}>This page got deleted for real.</p>
        <p className={styles.message}>
          Whatever you were looking for isn&apos;t here — the profile might not exist, or the
          link&apos;s just broken.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn-primary">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
