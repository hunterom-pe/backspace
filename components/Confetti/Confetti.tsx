"use client";

import { useEffect, useRef } from "react";
import styles from "./Confetti.module.css";

const COLOR_VARS = ["--cobalt", "--magenta", "--cyan"];
const PARTICLE_COUNT = 14;
const LIFETIME_MS = 700;

type BurstDetail = { x: number; y: number };

export function Confetti() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function handleBurst(event: Event) {
      if (reduceMotion) return;

      const layer = layerRef.current;
      if (!layer) return;

      const { x, y } = (event as CustomEvent<BurstDetail>).detail;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.4;
        const distance = 36 + Math.random() * 40;
        const color = COLOR_VARS[Math.floor(Math.random() * COLOR_VARS.length)];

        const piece = document.createElement("span");
        piece.className = styles.piece;
        piece.style.setProperty("--piece-color", `var(${color})`);
        piece.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
        piece.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
        piece.style.setProperty("--rotate", `${Math.random() * 720 - 360}deg`);
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;

        layer.appendChild(piece);
        setTimeout(() => piece.remove(), LIFETIME_MS);
      }
    }

    window.addEventListener("confetti-burst", handleBurst);
    return () => window.removeEventListener("confetti-burst", handleBurst);
  }, []);

  return <div ref={layerRef} className={styles.layer} aria-hidden="true" />;
}
