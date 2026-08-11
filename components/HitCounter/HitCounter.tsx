import { Card } from "@/components/Card/Card";
import { EyeIcon } from "@/components/icons";
import styles from "./HitCounter.module.css";

const DIGIT_COUNT = 6;

export function HitCounter({ views }: { views: number }) {
  const digits = String(Math.max(0, views)).padStart(DIGIT_COUNT, "0").split("");

  return (
    <Card title="Visitors" icon={<EyeIcon size={17} aria-hidden="true" />}>
      <div className={styles.body}>
        <div className={styles.digits} role="img" aria-label={`${views} profile views`}>
          {digits.map((digit, i) => (
            <span key={i} className={styles.digit} aria-hidden="true">
              {digit}
            </span>
          ))}
        </div>
        <p className={styles.label}>profile views</p>
      </div>
    </Card>
  );
}
