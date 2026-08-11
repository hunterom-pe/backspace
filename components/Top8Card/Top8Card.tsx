import { Card } from "@/components/Card/Card";
import styles from "./Top8Card.module.css";

type Top8Friend = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export function Top8Card({ friends = [] }: { friends?: Top8Friend[] }) {
  const slots = Array.from({ length: 8 }, (_, i) => friends[i] ?? null);

  return (
    <Card title="Top 8">
      <div className={styles.grid}>
        {slots.map((friend, i) =>
          friend ? (
            <div key={friend.id} className={styles.slot}>
              {friend.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={friend.avatarUrl}
                  alt={friend.displayName ?? friend.username}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {(friend.displayName ?? friend.username).slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className={styles.name}>{friend.displayName ?? friend.username}</span>
            </div>
          ) : (
            <div key={i} className={styles.emptySlot}>
              <span className={styles.plus}>+</span>
            </div>
          ),
        )}
      </div>
    </Card>
  );
}
