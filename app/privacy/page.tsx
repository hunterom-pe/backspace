import type { Metadata } from "next";
import Link from "next/link";
import styles from "../placeholder-page.module.css";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>Privacy Policy</p>
        <p className={styles.message}>
          This page is coming soon. Our privacy policy will be posted here.
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
