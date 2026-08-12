import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { EyeIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/format-time";
import type { ProfileVisit } from "@/lib/visits/queries";
import styles from "./RecentVisitors.module.css";

export function RecentVisitors({ visits }: { visits: ProfileVisit[] }) {
  return (
    <Card title="Recent Visitors" icon={<EyeIcon size={17} aria-hidden="true" />}>
      {visits.length === 0 ? (
        <EmptyState icon={<EyeIcon size={26} />}>No visitors yet.</EmptyState>
      ) : (
        <ul className={styles.list}>
          {visits.map(({ visitor, visitedAt }) => {
            const name = visitor.display_name || visitor.username;
            const initials = name.slice(0, 2).toUpperCase();
            return (
              <li key={visitor.id}>
                <Link href={`/profile/${visitor.username}`} className={styles.item}>
                  {visitor.avatar_url ? (
                    <Image
                      src={visitor.avatar_url}
                      alt=""
                      width={64}
                      height={64}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>{initials}</div>
                  )}
                  <span className={styles.text}>
                    <span className={styles.name}>{name}</span>
                  </span>
                  <span className={styles.time}>{formatRelativeTime(visitedAt)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
