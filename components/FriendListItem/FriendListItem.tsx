import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./FriendListItem.module.css";

export function FriendListItem({
  profile,
  action,
}: {
  profile: { username: string; display_name: string | null; avatar_url: string | null };
  action?: ReactNode;
}) {
  const name = profile.display_name || profile.username;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <li className={styles.item}>
      <Link href={`/profile/${profile.username}`} className={styles.identity}>
        {profile.avatar_url ? (
          <Image src={profile.avatar_url} alt="" width={88} height={88} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}
        <span className={styles.text}>
          <span className={styles.name}>{name}</span>
          <span className={styles.username}>@{profile.username}</span>
        </span>
      </Link>
      {action ? <div className={styles.action}>{action}</div> : null}
    </li>
  );
}
