import type { Metadata } from "next";
import Link from "next/link";
import styles from "../placeholder-page.module.css";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>Contact Us</p>
        <p className={styles.message}>
          This page is coming soon. We&apos;ll have a way for you to reach us here shortly.
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
