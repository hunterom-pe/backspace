import styles from "./UnderConstructionBanner.module.css";

const MESSAGE = "🚧 UNDER CONSTRUCTION — PARDON OUR PIXELS — CHECK BACK SOON 🚧";

export function UnderConstructionBanner() {
  return (
    <div className={styles.banner} role="status" aria-label="Profile under construction">
      <div className={styles.track}>
        <span className={styles.text}>{MESSAGE}</span>
        <span className={styles.text} aria-hidden="true">
          {MESSAGE}
        </span>
      </div>
    </div>
  );
}
