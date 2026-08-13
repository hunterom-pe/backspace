"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ConfirmDeleteButton.module.css";

export function ConfirmDeleteButton({
  action,
  hiddenFields,
  triggerLabel,
  triggerClassName,
  message,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: Record<string, string>;
  triggerLabel: string;
  triggerClassName: string;
  message: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickAway(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", onClickAway);
    return () => document.removeEventListener("click", onClickAway);
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => setOpen((v) => !v)}
        aria-label={triggerLabel}
        aria-expanded={open}
      >
        {children}
      </button>

      {open ? (
        <div className={styles.popover} role="dialog" aria-label="Confirm delete">
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <form action={action}>
              {Object.entries(hiddenFields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <button type="submit" className={styles.confirmButton}>
                Delete
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
