import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/Card/Card";
import { WallComposer } from "./WallComposer";
import { deleteWallComment } from "@/lib/wall/actions";
import { formatRelativeTime } from "@/lib/format-time";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton/ConfirmDeleteButton";
import { MessageBubbleIcon, XIcon } from "@/components/icons";
import { EmptyState } from "@/components/EmptyState/EmptyState";
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
        <EmptyState icon={<MessageBubbleIcon size={26} />}>
          No comments yet. Be the first to say something!
        </EmptyState>
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
                      <Image
                        src={comment.author.avatar_url}
                        alt=""
                        width={64}
                        height={64}
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
                    <ConfirmDeleteButton
                      action={deleteWallComment}
                      hiddenFields={{ comment_id: comment.id }}
                      triggerLabel="Delete comment"
                      triggerClassName={styles.deleteButton}
                      message="Delete this post from the wall? This can't be undone."
                    >
                      <XIcon size={13} aria-hidden="true" />
                    </ConfirmDeleteButton>
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
