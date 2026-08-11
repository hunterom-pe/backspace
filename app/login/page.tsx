import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "../auth-form.module.css";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage(props: PageProps<"/login">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/feed");
  }

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.logo}>backspace</p>
        <p className={styles.subtitle}>Log in to your profile.</p>

        {error ? <p className={styles.error}>{error}</p> : null}

        <form className={styles.form} action={login}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="field-input"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="field-input"
              required
            />
          </div>

          <button className={`btn-primary ${styles.submit}`} type="submit">
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
