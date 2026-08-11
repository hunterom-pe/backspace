import type { ReactNode } from "react";
import { TopNav } from "@/components/TopNav/TopNav";
import styles from "./AppShell.module.css";

export function AppShell({
  displayName,
  username,
  sidebar,
  main,
}: {
  displayName: string;
  username: string;
  sidebar: ReactNode;
  main: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <TopNav displayName={displayName} username={username} />
      <div className={styles.body}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <main className={styles.main}>{main}</main>
      </div>
    </div>
  );
}
