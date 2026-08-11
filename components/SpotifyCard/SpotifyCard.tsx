import { Card } from "@/components/Card/Card";
import { MusicNoteIcon } from "@/components/icons";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./SpotifyCard.module.css";

function EqualizerBars() {
  return (
    <span className={styles.equalizer} aria-hidden="true">
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
  );
}

export function SpotifyCard({ embedUrl }: { embedUrl: string | null }) {
  return (
    <Card
      title="Now Playing"
      icon={<MusicNoteIcon size={17} aria-hidden="true" />}
      action={embedUrl ? <EqualizerBars /> : null}
    >
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
        <EmptyState icon={<MusicNoteIcon size={26} />}>No Spotify track set yet.</EmptyState>
      )}
    </Card>
  );
}
