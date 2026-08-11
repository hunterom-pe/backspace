import type { ReactNode } from "react";
import { TopNav } from "@/components/TopNav/TopNav";
import styles from "./AppShell.module.css";

export function AppShell({
  viewerId,
  viewerDisplayName,
  viewerUsername,
  sidebar,
  main,
}: {
  viewerId: string;
  viewerDisplayName: string;
  viewerUsername: string;
  sidebar: ReactNode;
  main: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <TopNav viewerId={viewerId} displayName={viewerDisplayName} username={viewerUsername} />
      <div className={styles.body}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <main className={styles.main}>{main}</main>
      </div>
    </div>
  );
}
