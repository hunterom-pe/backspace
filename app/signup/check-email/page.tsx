import Link from "next/link";
import styles from "../../auth-form.module.css";

export default function CheckEmailPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>Check your email</p>
        <p className={styles.subtitle}>
          We sent a confirmation link to finish setting up your account. Click it, then come
          back and log in.
        </p>
        <p className={styles.footer}>
          <Link href="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
