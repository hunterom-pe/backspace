"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { createPost } from "@/lib/posts/actions";
import { fireConfettiFromElement } from "@/lib/confetti";
import { GifPicker } from "@/components/GifPicker/GifPicker";
import { GifFrameIcon, XIcon } from "@/components/icons";
import styles from "./PostsFeed.module.css";

export function PostComposer() {
  const [content, setContent] = useState("");
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const submitRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!content.trim() && !gifUrl) return;

    startTransition(async () => {
      const result = await createPost(content, gifUrl);
      if (result.ok) {
        setContent("");
        setGifUrl(null);
        setError(null);
        if (submitRef.current) {
          fireConfettiFromElement(submitRef.current);
        }
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      {error ? <p className={styles.composerError}>{error}</p> : null}

      <textarea
        className={`field-input ${styles.input}`}
        placeholder="What's on your mind?"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
      />

      {gifUrl ? (
        <div className={styles.gifPreview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gifUrl} alt="Selected GIF" className={styles.gifPreviewImage} />
          <button type="button" className={styles.removeGif} onClick={() => setGifUrl(null)}>
            <XIcon size={12} aria-hidden="true" />
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
          <GifFrameIcon size={16} aria-hidden="true" />
          GIF
        </button>
        <button
          ref={submitRef}
          type="submit"
          className="btn-primary"
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
