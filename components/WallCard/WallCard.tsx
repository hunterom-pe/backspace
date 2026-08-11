import Link from "next/link";
import { Card } from "@/components/Card/Card";
import { WallComposer } from "./WallComposer";
import { deleteWallComment } from "@/lib/wall/actions";
import { formatRelativeTime } from "@/lib/format-time";
import { MessageBubbleIcon, XIcon } from "@/components/icons";
import type { WallComment } from "@/lib/wall/queries";
import styles from "./WallCard.module.css";

export function WallCard({
  profileId,
  viewerId,
  comments,
}: {
  profileId: string;
  viewerId: string;
  comments: WallComment[];
}) {
  const isWallOwner = viewerId === profileId;

  return (
    <Card title="Wall" icon={<MessageBubbleIcon size={17} aria-hidden="true" />}>
      <WallComposer profileId={profileId} />

      {comments.length === 0 ? (
        <p className={styles.empty}>No comments yet. Be the first to say something!</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment) => {
            const canDelete = isWallOwner || comment.author.id === viewerId;
            const name = comment.author.display_name || comment.author.username;
            const initials = name.slice(0, 2).toUpperCase();

            return (
              <li key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className={styles.commentAuthorLink}
                  >
                    {comment.author.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={comment.author.avatar_url}
                        alt=""
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
                    <form action={deleteWallComment}>
                      <input type="hidden" name="comment_id" value={comment.id} />
                      <button
                        type="submit"
                        className={styles.deleteButton}
                        aria-label="Delete comment"
                      >
                        <XIcon size={13} aria-hidden="true" />
                      </button>
                    </form>
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
    </Card>
  );
}
