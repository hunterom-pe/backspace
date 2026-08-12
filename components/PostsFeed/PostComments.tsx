"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  createPostComment,
  deletePostComment,
  loadPostComments,
} from "@/lib/posts/actions";
import { GifPicker } from "@/components/GifPicker/GifPicker";
import { formatRelativeTime } from "@/lib/format-time";
import { MessageBubbleIcon, GifFrameIcon, XIcon } from "@/components/icons";
import type { PostComment } from "@/lib/posts/comments";
import styles from "./PostsFeed.module.css";

export function PostComments({
  postId,
  viewerId,
  initialCount,
}: {
  postId: string;
  viewerId: string;
  initialCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [count, setCount] = useState(initialCount);
  const [content, setContent] = useState("");
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && comments === null) {
      startTransition(async () => {
        const loaded = await loadPostComments(postId);
        setComments(loaded);
      });
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!content.trim() && !gifUrl) return;

    startTransition(async () => {
      const result = await createPostComment(postId, content, gifUrl);
      if (result.ok) {
        setComments((prev) => [...(prev ?? []), result.comment]);
        setCount((c) => c + 1);
        setContent("");
        setGifUrl(null);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(commentId: string) {
    setComments((prev) => (prev ? prev.filter((c) => c.id !== commentId) : prev));
    setCount((c) => Math.max(c - 1, 0));

    const formData = new FormData();
    formData.set("comment_id", commentId);
    startTransition(() => {
      deletePostComment(formData);
    });
  }

  return (
    <>
      <button type="button" className={styles.commentToggle} onClick={handleToggle}>
        <MessageBubbleIcon size={14} aria-hidden="true" />
        {count === 0 ? "Comment" : `${count} comment${count === 1 ? "" : "s"}`}
      </button>

      {expanded ? (
        <div className={styles.commentsSection}>
          {comments === null ? (
            <p className={styles.commentStatus}>Loading comments...</p>
          ) : (
            <ul className={styles.commentList}>
              {comments.map((comment) => {
                const name = comment.author.display_name || comment.author.username;
                const initials = name.slice(0, 2).toUpperCase();
                const canDelete = comment.author.id === viewerId;

                return (
                  <li key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <Link
                        href={`/profile/${comment.author.username}`}
                        className={styles.commentAuthorLink}
                      >
                        {comment.author.avatar_url ? (
                          <Image
                            src={comment.author.avatar_url}
                            alt=""
                            width={48}
                            height={48}
                            className={styles.commentAvatar}
                          />
                        ) : (
                          <div className={styles.commentAvatarFallback}>{initials}</div>
                        )}
                        <span>
                          <span className={styles.commentAuthor}>{name}</span>
                          <span className={styles.commentTime}>
                            {formatRelativeTime(comment.created_at)}
                          </span>
                        </span>
                      </Link>
                      {canDelete ? (
                        <button
                          type="button"
                          className={styles.commentDeleteButton}
                          onClick={() => handleDelete(comment.id)}
                          aria-label="Delete comment"
                        >
                          <XIcon size={11} aria-hidden="true" />
                        </button>
                      ) : null}
                    </div>
                    {comment.content ? (
                      <p className={styles.commentBody}>{comment.content}</p>
                    ) : null}
                    {comment.gif_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={comment.gif_url} alt="" className={styles.commentGif} />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          <form className={styles.composer} onSubmit={handleSubmit}>
            {error ? <p className={styles.composerError}>{error}</p> : null}

            <textarea
              className={`field-input ${styles.input}`}
              placeholder="Reply..."
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
            />

            {gifUrl ? (
              <div className={styles.gifPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gifUrl} alt="Selected GIF" className={styles.gifPreviewImage} />
                <button
                  type="button"
                  className={styles.removeGif}
                  onClick={() => setGifUrl(null)}
                >
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
                type="submit"
                className="btn-primary"
                disabled={isPending || (!content.trim() && !gifUrl)}
              >
                Reply
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
      ) : null}
    </>
  );
}
