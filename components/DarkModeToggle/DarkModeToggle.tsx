"use client";

import { useSyncExternalStore } from "react";
import styles from "./DarkModeToggle.module.css";

const THEME_EVENT = "backspace-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot(): boolean {
  // Light is the default; dark only applies once the user explicitly opts in
  // via this toggle (persisted to localStorage by lib/theme-script.ts).
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerSnapshot(): boolean {
  return false;
}

function setTheme(isDark: boolean) {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function DarkModeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
