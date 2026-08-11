import type { Profile } from "@/lib/types";
import styles from "./ProfileCard.module.css";

const STATUS_LABEL: Record<Profile["status"], string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

export function ProfileCard({ profile }: { profile: Profile }) {
  const name = profile.display_name || profile.username;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <section className={styles.card}>
      <div className={styles.avatarWrap}>
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}
        <span
          className={`${styles.statusDot} ${styles[profile.status]}`}
          title={STATUS_LABEL[profile.status]}
        />
      </div>

      <div className={styles.identity}>
        <p className={styles.name}>{name}</p>
        <p className={styles.username}>@{profile.username}</p>
      </div>

      <p className={styles.location}>{profile.location || "Add your location"}</p>

      <p className={styles.mood}>
        {profile.mood_status || "Set a mood or status..."}
      </p>
    </section>
  );
}
