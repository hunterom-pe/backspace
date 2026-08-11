import type { Profile } from "@/lib/types";
import { Card } from "@/components/Card/Card";
import styles from "./AboutCard.module.css";

export function AboutCard({ profile }: { profile: Profile }) {
  return (
    <Card title="About Me">
      <p className={styles.text}>{profile.about_me || "Tell people about yourself."}</p>
      <div>
        <p className={styles.label}>Interests</p>
        <p className={styles.text}>{profile.interests || "Add your interests."}</p>
      </div>
    </Card>
  );
}
