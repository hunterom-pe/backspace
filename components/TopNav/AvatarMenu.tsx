"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./TopNav.module.css";

export function AvatarMenu({
  initials,
  label,
  username,
  onLogout,
}: {
  initials: string;
  label: string;
  username: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickAway(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickAway);
    return () => document.removeEventListener("click", onClickAway);
  }, []);

  return (
    <div className={styles.avatarMenu} ref={ref}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        {initials}
      </button>
      {open ? (
        <div className={styles.dropdown} role="menu">
          <p className={styles.dropdownLabel}>{label}</p>
          <Link
            href={`/profile/${username}`}
            className={styles.dropdownItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            My profile
          </Link>
          <Link
            href="/friends"
            className={styles.dropdownItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Friends
          </Link>
          <Link
            href="/messages"
            className={styles.dropdownItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Messages
          </Link>
          <form action={onLogout}>
            <button type="submit" className={styles.dropdownItem} role="menuitem">
              Log out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
