import Link from "next/link";
import { SendIcon } from "@/components/icons";
import styles from "./MessageLink.module.css";

export function MessageLink({ username }: { username: string }) {
  return (
    <Link href={`/messages/${username}`} className={`btn-secondary ${styles.link}`}>
      <SendIcon size={15} aria-hidden="true" />
      Message
    </Link>
  );
}
