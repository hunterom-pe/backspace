import type { ReactNode } from "react";
import { TopNav } from "@/components/TopNav/TopNav";
import styles from "./AppShell.module.css";

export function AppShell({
  viewerId,
  viewerDisplayName,
  viewerUsername,
  sidebar,
  main,
  sidebarTheme,
  mainTheme,
}: {
  viewerId: string;
  viewerDisplayName: string;
  viewerUsername: string;
  sidebar: ReactNode;
  main: ReactNode;
  /** Profile-owner accent theme (see lib/theme.ts) applied to just that slot. */
  sidebarTheme?: string;
  mainTheme?: string;
}) {
  return (
    <div className={styles.page}>
      <TopNav viewerId={viewerId} displayName={viewerDisplayName} username={viewerUsername} />
      <div className={styles.body}>
        <aside className={styles.sidebar} data-profile-theme={sidebarTheme}>
          {sidebar}
        </aside>
        <main className={styles.main} data-profile-theme={mainTheme}>
          {main}
        </main>
      </div>
    </div>
  );
}
