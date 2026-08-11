import { Card } from "@/components/Card/Card";
import styles from "./SpotifyCard.module.css";

export function SpotifyCard({ embedUrl }: { embedUrl: string | null }) {
  return (
    <Card title="Now Playing">
      {embedUrl ? (
        <iframe
          className={styles.frame}
          src={embedUrl}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <p className={styles.empty}>No Spotify track set yet.</p>
      )}
    </Card>
  );
}
