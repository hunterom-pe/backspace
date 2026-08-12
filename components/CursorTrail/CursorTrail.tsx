"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorTrail.module.css";

const COLOR_VARS = ["--cobalt", "--magenta", "--cyan"];
const SPAWN_INTERVAL_MS = 45;
const PARTICLE_LIFETIME_MS = 650;

export function CursorTrail() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices don't fire mousemove from a finger, so this is inert
    // there rather than needing separate handling.

    const layer = layerRef.current;
    if (!layer) return;

    let lastSpawn = 0;

    function handleMove(event: MouseEvent) {
      const now = performance.now();
      if (now - lastSpawn < SPAWN_INTERVAL_MS) return;
      lastSpawn = now;

      const sparkle = document.createElement("span");
      sparkle.className = styles.sparkle;
      const color = COLOR_VARS[Math.floor(Math.random() * COLOR_VARS.length)];
      sparkle.style.setProperty("--sparkle-color", `var(${color})`);
      sparkle.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 30}px`);
      sparkle.style.setProperty("--rotate", `${Math.random() * 360}deg`);
      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;

      layer?.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), PARTICLE_LIFETIME_MS);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <div ref={layerRef} className={styles.layer} aria-hidden="true" />;
}
