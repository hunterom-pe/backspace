import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Profile } from "@/lib/types";
import { PresenceDot } from "@/components/Presence/PresenceDot";
import { PencilIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/format-time";
import styles from "./ProfileCard.module.css";

export function ProfileCard({
  profile,
  isOwnProfile = false,
  action,
}: {
  profile: Profile;
  isOwnProfile?: boolean;
  action?: ReactNode;
}) {
  const name = profile.display_name || profile.username;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <section className={styles.card}>
      <div className={styles.banner} aria-hidden="true">
        {profile.banner_url ? (
          <Image src={profile.banner_url} alt="" fill className={styles.bannerImage} />
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.avatarWrap}>
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={name}
              width={176}
              height={176}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
          <PresenceDot userId={profile.id} fallbackStatus={profile.status} />
        </div>

        <div className={styles.identity}>
          <p className={styles.name}>{name}</p>
          <p className={styles.username}>@{profile.username}</p>
          {profile.tagline ? <p className={styles.tagline}>{profile.tagline}</p> : null}
        </div>

        {profile.location || isOwnProfile ? (
          <p className={styles.location}>{profile.location || "Add your location"}</p>
        ) : null}

        {profile.mood_status || isOwnProfile ? (
          <p className={styles.mood}>{profile.mood_status || "Set a mood or status..."}</p>
        ) : null}

        <p className={styles.meta}>
          {profile.profile_views.toLocaleString()} profile view
          {profile.profile_views === 1 ? "" : "s"}
          {profile.status !== "online" ? (
            <> &middot; Last online {formatRelativeTime(profile.last_active_at)}</>
          ) : null}
        </p>

        {isOwnProfile ? (
          <Link href="/profile/edit" className={styles.editLink}>
            <PencilIcon size={14} aria-hidden="true" />
            Edit profile
          </Link>
        ) : (
          action
        )}
      </div>
    </section>
  );
}
