import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getNotifications, getUnreadCount } from "@/lib/notifications/queries";
import { DarkModeToggle } from "@/components/DarkModeToggle/DarkModeToggle";
import { NotificationBell } from "@/components/NotificationBell/NotificationBell";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { AvatarMenu } from "./AvatarMenu";
import styles from "./TopNav.module.css";

export async function TopNav({
  displayName,
  username,
  viewerId,
}: {
  displayName: string;
  username: string;
  viewerId: string;
}) {
  const initials = displayName.slice(0, 2).toUpperCase();
  const supabase = await createClient();
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(supabase, viewerId),
    getUnreadCount(supabase, viewerId),
  ]);

  return (
    <header className={styles.nav}>
      <Link href="/feed" className={styles.logo}>
        backspace
      </Link>

      <SearchBox />

      <div className={styles.actions}>
        <NotificationBell
          viewerId={viewerId}
          viewerUsername={username}
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
        />
        <DarkModeToggle />
        <AvatarMenu
          initials={initials}
          label={`@${username}`}
          username={username}
          onLogout={logout}
        />
      </div>
    </header>
  );
}
