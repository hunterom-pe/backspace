"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { toggleLike } from "@/lib/posts/actions";
import { fireConfettiFromElement } from "@/lib/confetti";
import { HeartIcon } from "@/components/icons";
import styles from "./PostsFeed.module.css";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    if (nextLiked) {
      fireConfettiFromElement(event.currentTarget);
    }

    startTransition(async () => {
      const result = await toggleLike(postId);
      if (result.ok) {
        setLiked(result.liked);
        setCount(result.likeCount);
      } else {
        setLiked(!nextLiked);
        setCount((c) => c + (nextLiked ? -1 : 1));
      }
    });
  }

  return (
    <button
      type="button"
      className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={liked}
    >
      <HeartIcon size={15} filled={liked} aria-hidden="true" />
      <span className={styles.likeCount}>{count}</span>
    </button>
  );
}
