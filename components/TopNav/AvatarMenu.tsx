"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TopNav.module.css";

export function AvatarMenu({
  initials,
  label,
  onLogout,
}: {
  initials: string;
  label: string;
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
