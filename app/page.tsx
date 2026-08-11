import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BackspaceMark } from "@/components/Logo/BackspaceMark";
import styles from "./page.module.css";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/feed");
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <BackspaceMark size={30} />
          </span>
          <h1 className={styles.title}>backspace</h1>
        </div>
        <p className={styles.tagline}>Hit backspace on the last twenty years of the internet.</p>
        <p className={styles.subtitle}>
          Profiles, Top 8s, wall posts, and away messages — the whole bit is back. Claim your
          username before your middle school nemesis does.
        </p>
        <div className={styles.ctas}>
          <Link href="/signup" className="btn-primary">
            Sign up
          </Link>
          <Link href="/login" className="btn-secondary">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
