"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { MONSTERS, type Monster } from "./monsters";
import styles from "./HeaderMonster.module.css";

function subscribe() {
  return () => {};
}

function getServerSnapshot(): Monster | null {
  return null;
}

export function HeaderMonster() {
  // A ref (not module scope) so each mount — i.e. each page load, since
  // TopNav is rendered fresh per page — gets its own fresh pick, while
  // useSyncExternalStore keeps the very first client render matching the
  // server's (null) render so there's no hydration mismatch from
  // Math.random() disagreeing between server and client.
  const pickedRef = useRef<Monster | null>(null);
  const getSnapshot = useCallback((): Monster => {
    if (!pickedRef.current) {
      pickedRef.current = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    }
    return pickedRef.current;
  }, []);

  const monster = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!monster) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      className={styles.monster}
      role="img"
      aria-label={monster.label}
    >
      {monster.svg}
    </svg>
  );
}
