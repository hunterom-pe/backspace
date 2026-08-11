import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Backspace</h1>
        <p className={styles.subtitle}>
          Your profile, your Top 8, your wall — back from the dead. Sign up to claim your
          username.
        </p>
        <div className={styles.ctas}>
          <Link href="/signup" className={styles.primary}>
            Sign up
          </Link>
          <Link href="/login" className={styles.secondary}>
            Log in
          </Link>
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Backspace</h1>
      <p className={styles.welcome}>
        Welcome back, {profile?.display_name ?? profile?.username ?? user.email}.
      </p>
      <p className={styles.subtitle}>
        Profile, friends, Top 8, and the rest of the dashboard are coming in the next
        build steps.
      </p>
      <form className={styles.logoutForm} action={logout}>
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
