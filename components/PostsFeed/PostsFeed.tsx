"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/Card/Card";
import { PostComposer } from "./PostComposer";
import { LikeButton } from "./LikeButton";
import { deletePost, loadMoreFeedPosts } from "@/lib/posts/actions";
import { FEED_PAGE_SIZE, type FeedPost } from "@/lib/posts/queries";
import { formatRelativeTime } from "@/lib/format-time";
import { XIcon, PencilIcon } from "@/components/icons";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./PostsFeed.module.css";

export function PostsFeed({
  viewerId,
  posts: initialPosts,
}: {
  viewerId: string;
  posts: FeedPost[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialPosts.length === FEED_PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    const cursor = posts[posts.length - 1]?.created_at;
    if (!cursor) return;

    startTransition(async () => {
      const next = await loadMoreFeedPosts(cursor);
      setPosts((prev) => [...prev, ...next]);
      setHasMore(next.length === FEED_PAGE_SIZE);
    });
  }

  return (
    <Card title="Posts">
      <PostComposer />

      {posts.length === 0 ? (
        <EmptyState icon={<PencilIcon size={26} />}>
          No posts yet. Add friends to see their updates here.
        </EmptyState>
      ) : (
        <>
          <ul className={styles.list}>
            {posts.map((post) => {
              const name = post.author.display_name || post.author.username;
              const initials = name.slice(0, 2).toUpperCase();
              const isOwn = post.author.id === viewerId;

              return (
                <li key={post.id} className={styles.post}>
                  <div className={styles.postHeader}>
                    <Link
                      href={`/profile/${post.author.username}`}
                      className={styles.postAuthorLink}
                    >
                      {post.author.avatar_url ? (
                        <Image
                          src={post.author.avatar_url}
                          alt=""
                          width={64}
                          height={64}
                          className={styles.postAvatar}
                        />
                      ) : (
                        <div className={styles.postAvatarFallback}>{initials}</div>
                      )}
                      <span>
                        <span className={styles.postAuthor}>{name}</span>
                        <span className={styles.postTime}>
                          {formatRelativeTime(post.created_at)}
                        </span>
                      </span>
                    </Link>

                    {isOwn ? (
                      <form action={deletePost}>
                        <input type="hidden" name="post_id" value={post.id} />
                        <button
                          type="submit"
                          className={styles.deleteButton}
                          aria-label="Delete post"
                        >
                          <XIcon size={13} aria-hidden="true" />
                        </button>
                      </form>
                    ) : null}
                  </div>

                  {post.content ? <p className={styles.postBody}>{post.content}</p> : null}
                  {post.gif_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.gif_url} alt="" className={styles.postGif} />
                  ) : null}

                  <LikeButton
                    postId={post.id}
                    initialLiked={post.liked_by_viewer}
                    initialCount={post.like_count}
                  />
                </li>
              );
            })}
          </ul>

          {hasMore ? (
            <button
              type="button"
              className={`btn-secondary ${styles.loadMore}`}
              onClick={handleLoadMore}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Load more"}
            </button>
          ) : null}
        </>
      )}
    </Card>
  );
}
