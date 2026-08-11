"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./status-page.module.css";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.code}>Oops</p>
        <p className={styles.title}>Something backfired.</p>
        <p className={styles.message}>
          That&apos;s on us, not you. Try again, or head back and pick up where you left off.
        </p>
        <div className={styles.actions}>
          <button type="button" className="btn-primary" onClick={() => retry()}>
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
