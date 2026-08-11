import type { Metadata } from "next";
import Link from "next/link";
import styles from "../placeholder-page.module.css";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>About backspace</p>
        <p className={styles.message}>
          This page is coming soon. Check back later to learn more about the story behind
          backspace.
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
