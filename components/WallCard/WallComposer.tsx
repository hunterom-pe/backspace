"use client";

import { useState, useTransition, type FormEvent } from "react";
import { postWallComment } from "@/lib/wall/actions";
import { GifPicker } from "@/components/GifPicker/GifPicker";
import styles from "./WallCard.module.css";

export function WallComposer({ profileId }: { profileId: string }) {
  const [content, setContent] = useState("");
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!content.trim() && !gifUrl) return;

    startTransition(async () => {
      const result = await postWallComment(profileId, content, gifUrl);
      if (result.ok) {
        setContent("");
        setGifUrl(null);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      {error ? <p className={styles.composerError}>{error}</p> : null}

      <textarea
        className={styles.input}
        placeholder="Write something on this wall..."
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
      />

      {gifUrl ? (
        <div className={styles.gifPreview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gifUrl} alt="Selected GIF" className={styles.gifPreviewImage} />
          <button type="button" className={styles.removeGif} onClick={() => setGifUrl(null)}>
            Remove GIF
          </button>
        </div>
      ) : null}

      <div className={styles.composerActions}>
        <button
          type="button"
          className={styles.gifToggle}
          onClick={() => setShowPicker((v) => !v)}
        >
          GIF
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={isPending || (!content.trim() && !gifUrl)}
        >
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>

      {showPicker ? (
        <GifPicker
          onSelect={(url) => {
            setGifUrl(url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      ) : null}
    </form>
  );
}
