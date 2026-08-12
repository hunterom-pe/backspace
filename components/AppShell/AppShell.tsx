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
  pageTheme,
}: {
  viewerId: string;
  viewerDisplayName: string;
  viewerUsername: string;
  sidebar: ReactNode;
  main: ReactNode;
  /** Profile-owner accent theme (see lib/theme.ts) applied to just that slot. */
  sidebarTheme?: string;
  mainTheme?: string;
  /** Same theme, applied to the page background behind the cards (the
   *  per-theme pattern in AppShell.module.css) — pass only where the whole
   *  page is already the profile owner's, i.e. alongside mainTheme. */
  pageTheme?: string;
}) {
  return (
    <div className={styles.page}>
      <TopNav viewerId={viewerId} displayName={viewerDisplayName} username={viewerUsername} />
      <div className={styles.body} data-profile-theme={pageTheme}>
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
