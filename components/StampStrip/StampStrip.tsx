import { SunIcon, MoonIcon, HeartIcon } from "@/components/icons";
import styles from "./StampStrip.module.css";

const STAMPS = [
  { icon: SunIcon, label: "EARLY MEMBER" },
  { icon: MoonIcon, label: "NIGHT OWL" },
  { icon: HeartIcon, label: "TOP 8 CERTIFIED" },
];

export function StampStrip() {
  return (
    <div className={styles.strip} aria-hidden="true">
      {STAMPS.map(({ icon: Icon, label }) => (
        <div key={label} className={styles.stamp}>
          <Icon size={18} />
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
