"use client";

import { useState, useTransition, type FormEvent } from "react";
import { sendMessage } from "@/lib/messages/actions";
import { GifPicker } from "@/components/GifPicker/GifPicker";
import { formatRelativeTime } from "@/lib/format-time";
import type { ThreadMessage } from "@/lib/messages/queries";
import styles from "./MessageThread.module.css";

export function MessageThread({
  otherUserId,
  viewerId,
  initialMessages,
}: {
  otherUserId: string;
  viewerId: string;
  initialMessages: ThreadMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!content.trim() && !gifUrl) return;

    const tempId = `temp-${messages.length}-${content.length}-${Math.random()
      .toString(36)
      .slice(2)}`;
    const optimistic: ThreadMessage = {
      id: tempId,
      sender_id: viewerId,
      content: content.trim(),
      gif_url: gifUrl,
      created_at: new Date().toISOString(),
    };

    const sentContent = content;
    const sentGif = gifUrl;
    setMessages((m) => [...m, optimistic]);
    setContent("");
    setGifUrl(null);
    setError(null);

    startTransition(async () => {
      const result = await sendMessage(otherUserId, sentContent, sentGif);
      if (!result.ok) {
        setMessages((m) => m.filter((msg) => msg.id !== tempId));
        setError(result.error);
      }
    });
  }

  return (
    <div className={styles.thread}>
      <ul className={styles.list}>
        {messages.length === 0 ? (
          <li className={styles.empty}>No messages yet. Say hello!</li>
        ) : (
          messages.map((m) => {
            const fromMe = m.sender_id === viewerId;
            return (
              <li
                key={m.id}
                className={`${styles.bubbleRow} ${fromMe ? styles.fromMe : styles.fromThem}`}
              >
                <div className={styles.bubble}>
                  {m.content ? <p className={styles.bubbleText}>{m.content}</p> : null}
                  {m.gif_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.gif_url} alt="" className={styles.bubbleGif} />
                  ) : null}
                  <span className={styles.bubbleTime}>{formatRelativeTime(m.created_at)}</span>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <form className={styles.composer} onSubmit={handleSubmit}>
        {error ? <p className={styles.composerError}>{error}</p> : null}

        <textarea
          className={styles.input}
          placeholder="Write a message..."
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
            Send
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
    </div>
  );
}
