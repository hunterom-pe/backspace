import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="Footer">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </nav>
      <p className={styles.tagline}>Built on pure nostalgia.</p>
    </footer>
  );
}
