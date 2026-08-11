import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "../auth-form.module.css";

export default async function LoginPage(props: PageProps<"/login">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>Backspace</p>
        <p className={styles.subtitle}>Log in to your profile.</p>

        {error ? <p className={styles.error}>{error}</p> : null}

        <form className={styles.form} action={login}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className={styles.submit} type="submit">
            Log in
          </button>
        </form>

        <p className={styles.footer}>
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
