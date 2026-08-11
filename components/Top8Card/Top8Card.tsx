import Link from "next/link";
import { Card } from "@/components/Card/Card";
import type { Profile } from "@/lib/types";
import styles from "./Top8Card.module.css";

export function Top8Card({ slots }: { slots: (Profile | null)[] }) {
  return (
    <Card title="Top 8">
      <div className={styles.grid}>
        {slots.map((friend, i) =>
          friend ? (
            <Link
              key={friend.id}
              href={`/profile/${friend.username}`}
              className={`${styles.slot} ${i === 0 ? styles.slotFirst : ""}`}
            >
              <span
                className={`${styles.ribbon} ${i === 0 ? styles.ribbonFirst : ""}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {friend.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={friend.avatar_url} alt="" className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>
                  {(friend.display_name ?? friend.username).slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className={styles.name}>{friend.display_name ?? friend.username}</span>
            </Link>
          ) : (
            <div key={i} className={styles.emptySlot} />
          ),
        )}
      </div>
    </Card>
  );
}
