"use client";

import { useEffect, useState } from "react";
import styles from "./GifPicker.module.css";

type Gif = { id: string; title: string; previewUrl: string; url: string };

export function GifPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/giphy/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setGifs([]);
          } else {
            setError(null);
            setGifs(data.gifs ?? []);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") setError("Could not load GIFs.");
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFs..."
          className={styles.search}
          autoFocus
        />
        <button
          type="button"
          onClick={onClose}
          className={styles.close}
          aria-label="Close GIF picker"
        >
          ×
        </button>
      </div>

      {error ? <p className={styles.status}>{error}</p> : null}
      {!error && loading ? <p className={styles.status}>Loading...</p> : null}
      {!error && !loading && gifs.length === 0 ? (
        <p className={styles.status}>No GIFs found.</p>
      ) : null}

      {!error && gifs.length > 0 ? (
        <div className={styles.grid}>
          {gifs.map((gif) => (
            <button
              key={gif.id}
              type="button"
              className={styles.gifButton}
              onClick={() => onSelect(gif.url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gif.previewUrl} alt={gif.title} className={styles.gifImage} />
            </button>
          ))}
        </div>
      ) : null}

      <p className={styles.attribution}>Powered by GIPHY</p>
    </div>
  );
}
