import Link from "next/link";
import styles from "./MessageLink.module.css";

export function MessageLink({ username }: { username: string }) {
  return (
    <Link href={`/messages/${username}`} className={styles.link}>
      Message
    </Link>
  );
}
