import type { Profile } from "@/lib/types";
import { Card } from "@/components/Card/Card";
import styles from "./AboutCard.module.css";

export function AboutCard({
  profile,
  isOwnProfile = false,
}: {
  profile: Profile;
  isOwnProfile?: boolean;
}) {
  if (!isOwnProfile && !profile.about_me && !profile.interests) {
    return null;
  }

  return (
    <Card title="About Me">
      <p className={styles.text}>
        {profile.about_me || (isOwnProfile ? "Tell people about yourself." : "")}
      </p>
      {profile.interests || isOwnProfile ? (
        <div>
          <p className={styles.label}>Interests</p>
          <p className={styles.text}>{profile.interests || "Add your interests."}</p>
        </div>
      ) : null}
    </Card>
  );
}
