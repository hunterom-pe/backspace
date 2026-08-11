import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { DarkModeToggle } from "@/components/DarkModeToggle/DarkModeToggle";
import { AvatarMenu } from "./AvatarMenu";
import styles from "./TopNav.module.css";

export function TopNav({
  displayName,
  username,
}: {
  displayName: string;
  username: string;
}) {
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Backspace
      </Link>

      <input
        type="search"
        className={styles.search}
        placeholder="Search Backspace..."
        aria-label="Search Backspace"
        disabled
      />

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.bell}
          aria-label="Notifications (coming soon)"
          disabled
        >
          🔔
        </button>
        <DarkModeToggle />
        <AvatarMenu initials={initials} label={`@${username}`} onLogout={logout} />
      </div>
    </header>
  );
}
