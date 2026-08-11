import Link from "next/link";
import { Card } from "@/components/Card/Card";
import { PostComposer } from "./PostComposer";
import { LikeButton } from "./LikeButton";
import { deletePost } from "@/lib/posts/actions";
import { formatRelativeTime } from "@/lib/format-time";
import { XIcon } from "@/components/icons";
import type { FeedPost } from "@/lib/posts/queries";
import styles from "./PostsFeed.module.css";

export function PostsFeed({ viewerId, posts }: { viewerId: string; posts: FeedPost[] }) {
  return (
    <Card title="Posts">
      <PostComposer />

      {posts.length === 0 ? (
        <p className={styles.empty}>No posts yet. Add friends to see their updates here.</p>
      ) : (
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.author.avatar_url} alt="" className={styles.postAvatar} />
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
      )}
    </Card>
  );
}
