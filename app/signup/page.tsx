import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signup } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "../auth-form.module.css";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage(props: PageProps<"/signup">) {
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
        <p className={styles.logo}>backspace</p>
        <p className={styles.subtitle}>Create your profile.</p>

        {error ? <p className={styles.error}>{error}</p> : null}

        <form className={styles.form} action={signup}>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              pattern="[a-z0-9_]{3,20}"
              className="field-input"
              required
            />
            <span className={styles.hint}>
              3-20 characters: lowercase letters, numbers, underscores. This becomes your
              profile URL.
            </span>
          </div>

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
              autoComplete="new-password"
              minLength={6}
              className="field-input"
              required
            />
          </div>

          <button className={`btn-primary ${styles.submit}`} type="submit">
            Sign up
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
